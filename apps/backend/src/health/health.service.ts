import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  private startTime: number;

  constructor(private prisma: PrismaService) {
    this.startTime = Date.now();
  }

  async getHealthStatus() {
    let dbHealthy = true;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      dbHealthy = false;
    }

    const uptime = Math.floor((Date.now() - this.startTime) / 1000);

    return {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime,
      version: '1.0.0',
      database: dbHealthy ? 'connected' : 'disconnected',
    };
  }
}
