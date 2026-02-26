import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DishModule } from './modules/dish/dish.module';
import { MatchingModule } from './modules/matching/matching.module';
import { UserActivityModule } from './modules/user-activity/user-activity.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DishModule,
    MatchingModule,
    UserActivityModule,
    HealthModule,
  ],
})
export class AppModule {}
