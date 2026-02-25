import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@meal-platform/shared';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Controller('api/health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getHealth(): Promise<HealthCheck> {
    const isDatabaseHealthy = await this.prisma.isHealthy();

    return {
      status: isDatabaseHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date(),
      services: {
        database: isDatabaseHealthy ? 'up' : 'down'
      },
      version: '1.0.0'
    };
  }
}
