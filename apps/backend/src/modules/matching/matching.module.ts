import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { DishModule } from '../dish/dish.module';
import { PrismaService } from '../../common/services/prisma.service';

@Module({
  imports: [DishModule],
  controllers: [MatchingController],
  providers: [MatchingService, PrismaService],
  exports: [MatchingService],
})
export class MatchingModule {}
