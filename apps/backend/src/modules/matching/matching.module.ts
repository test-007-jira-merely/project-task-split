import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { IngredientMatcherService } from '../../domain/services/ingredient-matcher.service';
import { RankingService } from '../../domain/services/ranking.service';
import { DishesModule } from '../dishes/dishes.module';

@Module({
  imports: [DishesModule],
  controllers: [MatchingController],
  providers: [MatchingService, IngredientMatcherService, RankingService],
  exports: [MatchingService],
})
export class MatchingModule {}
