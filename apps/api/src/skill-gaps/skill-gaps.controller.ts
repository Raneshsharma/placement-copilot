import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SkillGapsService } from './skill-gaps.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('skill-gaps')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('skill-gaps')
export class SkillGapsController {
  constructor(private skillGapsService: SkillGapsService) {}

  @Post('analyze')
  analyze(@Req() req: any, @Body() dto: any) {
    return this.skillGapsService.analyze(req.user.userId, dto);
  }

  @Get('recommendations')
  recommendations(@Req() req: any) {
    return this.skillGapsService.getRecommendations(req.user.userId);
  }
}
