import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { HealthCheck } from '@meal-platform/shared-types';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private startTime = Date.now();

  constructor(private prisma: PrismaService) {}

  async getHealthCheck(): Promise<HealthCheck> {
    const checks = {
      database: false,
      cache: true, // Always true for now (no external cache)
    };

    // Check database connection
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch (error) {
      this.logger.error('Database health check failed', error);
    }

    const allHealthy = checks.database && checks.cache;
    const status: HealthCheck['status'] = allHealthy
      ? 'healthy'
      : checks.database
      ? 'degraded'
      : 'unhealthy';

    return {
      status,
      version: '1.0.0',
      uptime: Date.now() - this.startTime,
      timestamp: new Date().toISOString(),
      checks,
    };
  }
}
