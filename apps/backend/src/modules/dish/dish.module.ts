import { Module } from '@nestjs/common';
import { DishController } from './dish.controller';
import { DishService } from './dish.service';
import { DishRepository } from './dish.repository';
import { PrismaService } from '../../common/services/prisma.service';

@Module({
  controllers: [DishController],
  providers: [DishService, DishRepository, PrismaService],
  exports: [DishService],
})
export class DishModule {}
