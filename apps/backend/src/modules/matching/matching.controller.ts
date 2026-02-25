import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { MatchingService } from './matching.service';
import { MatchRequestDto } from './dto/match-request.dto';

@ApiTags('matching')
@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Match ingredients against dish database' })
  @ApiResponse({ status: 200, description: 'Matching completed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  async matchIngredients(@Body() request: MatchRequestDto) {
    const result = await this.matchingService.matchIngredients(request);

    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }
}
