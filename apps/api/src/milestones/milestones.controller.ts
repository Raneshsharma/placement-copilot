import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MilestonesService } from './milestones.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('milestones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('milestones')
export class MilestonesController {
  constructor(private milestonesService: MilestonesService) {}

  @Get()
  @ApiOperation({ summary: 'Get recent activity milestones' })
  @ApiResponse({ status: 200, description: 'Returns recent activity milestones' })
  getRecent(@Req() req: any, @Query('limit') limit?: string) {
    return this.milestonesService.getRecent(req.user.userId, parseInt(limit || '5'));
  }
}
