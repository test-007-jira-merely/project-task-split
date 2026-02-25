import { Controller, Get } from '@nestjs/common';
import { MetricsService } from '../../infrastructure/metrics/metrics.service';

@Controller('api/metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  getMetrics() {
    return {
      success: true,
      data: {
        endpoints: this.metricsService.getMetrics(),
        summary: this.metricsService.getSummary(),
      },
      timestamp: new Date(),
    };
  }
}
