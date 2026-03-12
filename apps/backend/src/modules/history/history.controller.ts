import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { HistoryService } from './history.service';

@ApiTags('history')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get user history' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'History retrieved successfully' })
  async getHistory(@Query('userId') userId: string, @Query('limit') limit?: number) {
    const history = await this.historyService.getUserHistory(
      userId,
      limit ? Number(limit) : undefined
    );

    return {
      success: true,
      data: history,
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Add dish to history' })
  @ApiResponse({ status: 200, description: 'Dish added to history' })
  async addToHistory(
    @Body() body: { userId: string; dishId: string; cooked?: boolean }
  ) {
    await this.historyService.addToHistory(body.userId, body.dishId, body.cooked);

    return {
      success: true,
      message: 'Dish added to history',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get user preferences based on history' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiResponse({ status: 200, description: 'Preferences retrieved successfully' })
  async getPreferences(@Query('userId') userId: string) {
    const preferences = await this.historyService.getUserPreferences(userId);

    return {
      success: true,
      data: preferences,
      timestamp: new Date().toISOString(),
    };
  }
}
