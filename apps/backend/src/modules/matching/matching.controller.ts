import { Controller, Post, Body } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchRequestDto } from './dto/match-request.dto';

@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('find')
  async findMatchingDishes(@Body() dto: MatchRequestDto) {
    return this.matchingService.findMatchingDishes(dto);
  }
}
