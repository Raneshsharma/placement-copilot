import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InterviewsService } from './interviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('interviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('interviews')
export class InterviewsController {
  constructor(private interviewsService: InterviewsService) {}
  @Post('start') start(@Req() req: any, @Body() dto: any) { return this.interviewsService.start(req.user.userId, dto); }
  @Get() list(@Req() req: any) { return this.interviewsService.list(req.user.userId); }
  @Get(':id') get(@Param('id') id: string) { return this.interviewsService.findById(id); }
  @Post(':id/answer') answer(@Param('id') id: string, @Body() dto: any) { return this.interviewsService.answer(id, dto); }
  @Get(':id/feedback') feedback(@Param('id') id: string) { return this.interviewsService.getFeedback(id); }
}
