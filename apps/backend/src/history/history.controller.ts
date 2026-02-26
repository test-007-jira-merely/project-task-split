import { Controller, Get, Post, Delete, Body, Query } from '@nestjs/common';
import { HistoryService } from './history.service';
import { createSuccessResponse } from '../common/decorators/api-response.decorator';
import { AddHistoryDto } from './dto/add-history.dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  async addToHistory(@Body() dto: AddHistoryDto) {
    const entry = await this.historyService.addToHistory(dto.dishId, dto.userId);
    return createSuccessResponse(entry);
  }

  @Get()
  async getHistory(
    @Query('userId') userId?: string,
    @Query('limit') limit?: number,
  ) {
    const history = await this.historyService.getHistory(userId, limit);
    return createSuccessResponse(history);
  }

  @Delete()
  async clearHistory(@Query('userId') userId?: string) {
    const result = await this.historyService.clearHistory(userId);
    return createSuccessResponse(result);
  }
}
