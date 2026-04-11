import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get()
  @ApiOperation({ summary: 'Get PPS score and breakdown' })
  @ApiResponse({ status: 200, description: 'Returns PPS score and breakdown data' })
  getPPS(@Req() req: any) {
    return this.progressService.getPPS(req.user.userId);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get comprehensive dashboard data' })
  @ApiResponse({ status: 200, description: 'Returns dashboard analytics' })
  dashboard(@Req() req: any) {
    return this.progressService.getDashboard(req.user.userId);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get detailed analytics' })
  @ApiResponse({ status: 200, description: 'Returns analytics data' })
  analytics(@Req() req: any) {
    return this.progressService.getAnalytics(req.user.userId);
  }

  @Get('timeline')
  @ApiOperation({ summary: 'Get application timeline' })
  @ApiResponse({ status: 200, description: 'Returns timeline data' })
  timeline(@Req() req: any) {
    return this.progressService.getTimeline(req.user.userId);
  }
}
