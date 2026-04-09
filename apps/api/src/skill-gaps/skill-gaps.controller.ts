import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SkillGapsService } from './skill-gaps.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('skill-gaps')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('skill-gaps')
export class SkillGapsController {
  constructor(private skillGapsService: SkillGapsService) {}
  @Post('analyze') analyze(@Body() dto: any) { return this.skillGapsService.analyze(dto); }
  @Get('recommendations') recommendations() { return []; }
}
