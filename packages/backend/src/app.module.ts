import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER } from '@nestjs/core';

// Infrastructure
import { PrismaService } from './infrastructure/database/prisma.service';
import { DishRepository } from './infrastructure/repositories/dish.repository';
import { LoggerService } from './infrastructure/logging/logger.service';

// Domain
import { MatchingAlgorithmService } from './domain/services/matching-algorithm.service';
import { SubstitutionMatrixService } from './domain/services/substitution-matrix.service';

// API
import { DishesController } from './api/controllers/dishes.controller';
import { HealthController } from './api/controllers/health.controller';
import { LoggingMiddleware } from './api/middleware/logging.middleware';
import { HttpExceptionFilter } from './api/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
  ],
  controllers: [DishesController, HealthController],
  providers: [
    PrismaService,
    DishRepository,
    LoggerService,
    MatchingAlgorithmService,
    SubstitutionMatrixService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
