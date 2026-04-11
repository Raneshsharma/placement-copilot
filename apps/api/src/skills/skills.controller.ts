import { Controller, Get, Post, Query, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyzeSkillsDto } from './dto/analyze-skills.dto';

@ApiTags('skills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('skills')
export class SkillsController {
  constructor(private skillsService: SkillsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user skills and target role' })
  @ApiResponse({ status: 200, description: 'Returns skills and target role' })
  getSkills(@Req() req: any) {
    return this.skillsService.getUserSkills(req.user.userId);
  }

  @Get('gap')
  @ApiOperation({ summary: 'Get skill gap analysis for target role' })
  @ApiResponse({ status: 200, description: 'Returns gaps, matched skills, readiness' })
  getGap(@Req() req: any, @Query('role') role?: string) {
    return this.skillsService.analyzeGap(req.user.userId, role || 'Software Engineer');
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze skills with AI' })
  @ApiResponse({ status: 200, description: 'Returns full analysis with radar data' })
  analyze(@Req() req: any, @Body() dto: AnalyzeSkillsDto) {
    return this.skillsService.analyzeSkills(req.user.userId, dto.targetRole);
  }
}
