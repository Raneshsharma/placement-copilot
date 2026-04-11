import { Controller, Post, Get, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SkillGapsService } from './skill-gaps.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyzeSkillGapDto } from './dto/analyze-skill-gap.dto';

@ApiTags('skill-gaps')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('skill-gaps')
export class SkillGapsController {
  constructor(private skillGapsService: SkillGapsService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze skill gaps for a target role' })
  @ApiResponse({ status: 201, description: 'Returns gap analysis with roadmap' })
  analyze(@Req() req: any, @Body() dto: AnalyzeSkillGapDto) {
    return this.skillGapsService.analyze(req.user.userId, dto);
  }

  @Get('current')
  @ApiOperation({ summary: 'Get most recent skill gap analysis' })
  @ApiResponse({ status: 200, description: 'Returns current analysis or null' })
  getCurrent(@Req() req: any) {
    return this.skillGapsService.getCurrent(req.user.userId);
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get skill gap recommendations' })
  @ApiResponse({ status: 200, description: 'Returns recommendations' })
  recommendations(@Req() req: any) {
    return this.skillGapsService.getRecommendations(req.user.userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get skill gap analysis history' })
  @ApiResponse({ status: 200, description: 'Returns analysis history' })
  history(@Req() req: any, @Query('targetRole') targetRole?: string) {
    return this.skillGapsService.getHistory(req.user.userId, targetRole);
  }
}
