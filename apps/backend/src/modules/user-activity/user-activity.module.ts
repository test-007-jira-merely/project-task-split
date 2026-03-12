import { Module } from '@nestjs/common';
import { UserActivityController } from './user-activity.controller';
import { UserActivityService } from './user-activity.service';
import { UserActivityRepository } from './user-activity.repository';
import { DishModule } from '../dish/dish.module';
import { PrismaService } from '../../common/services/prisma.service';

@Module({
  imports: [DishModule],
  controllers: [UserActivityController],
  providers: [UserActivityService, UserActivityRepository, PrismaService],
  exports: [UserActivityService],
})
export class UserActivityModule {}
