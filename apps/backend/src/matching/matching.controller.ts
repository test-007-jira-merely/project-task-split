import { Controller, Post, Body } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { createSuccessResponse } from '../common/decorators/api-response.decorator';
import { MatchRequestDto } from './dto/match-request.dto';

@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post()
  async findMatches(@Body() matchRequest: MatchRequestDto) {
    const results = await this.matchingService.findMatchingDishes(
      matchRequest.ingredients,
      matchRequest.allowSubstitutes ?? true,
      matchRequest.maxResults ?? 10,
    );

    return createSuccessResponse(results);
  }
}
