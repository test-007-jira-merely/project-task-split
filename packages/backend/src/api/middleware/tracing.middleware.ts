import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { LoggerService } from '../../infrastructure/logging/logger.service';
import { MetricsService } from '../../infrastructure/metrics/metrics.service';

@Injectable()
export class TracingMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerService,
    private readonly metrics: MetricsService,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = uuidv4();
    const startTime = Date.now();

    // Attach request ID to request object
    req['requestId'] = requestId;

    // Add request ID to response headers
    res.setHeader('X-Request-ID', requestId);

    // Log incoming request
    this.logger.log(
      `Incoming ${req.method} ${req.url}`,
      'HTTP',
      {
        requestId,
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      }
    );

    // Capture response
    const originalSend = res.send;
    let responseBody: any;

    res.send = function (body: any): Response {
      responseBody = body;
      return originalSend.call(this, body);
    };

    // Log response when finished
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const logLevel = res.statusCode >= 400 ? 'error' : 'log';

      this.logger[logLevel](
        `Completed ${req.method} ${req.url}`,
        'HTTP',
        {
          requestId,
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
        }
      );

      // Record metrics
      if (res.statusCode >= 400) {
        this.metrics.recordError(req.url);
      } else {
        this.metrics.recordRequest(req.url, duration);
      }
    });

    next();
  }
}
