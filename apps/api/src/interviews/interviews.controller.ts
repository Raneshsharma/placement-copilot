import { Controller, Get, Post, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InterviewsService } from './interviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StartInterviewDto, SubmitAnswerDto } from './dto/submit-answer.dto';

@ApiTags('interviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('interviews')
export class InterviewsController {
  constructor(private interviewsService: InterviewsService) {}

  @Get()
  @ApiOperation({ summary: 'List user interviews' })
  @ApiResponse({ status: 200, description: 'Returns paginated interviews' })
  list(@Req() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.interviewsService.list(
      req.user.userId,
      parseInt(page || '1'),
      parseInt(limit || '20'),
    );
  }

  @Post('start')
  @ApiOperation({ summary: 'Start a new mock interview' })
  @ApiResponse({ status: 201, description: 'Interview started with questions' })
  start(@Req() req: any, @Body() dto: StartInterviewDto) {
    return this.interviewsService.start(req.user.userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get interview by ID' })
  @ApiResponse({ status: 200, description: 'Returns the interview' })
  @ApiResponse({ status: 404, description: 'Interview not found' })
  get(@Param('id') id: string) {
    return this.interviewsService.findById(id);
  }

  @Post(':id/answer')
  @ApiOperation({ summary: 'Submit an answer to an interview question' })
  @ApiResponse({ status: 200, description: 'Answer submitted' })
  submitAnswer(@Param('id') id: string, @Body() dto: SubmitAnswerDto) {
    return this.interviewsService.submitAnswer(id, {
      questionId: dto.questionId || 'general',
      answer: dto.answer,
      duration: dto.duration,
    });
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete an interview session' })
  @ApiResponse({ status: 200, description: 'Interview completed with feedback' })
  complete(@Param('id') id: string) {
    return this.interviewsService.complete(id);
  }

  @Get(':id/feedback')
  @ApiOperation({ summary: 'Get interview feedback' })
  @ApiResponse({ status: 200, description: 'Returns feedback and scores' })
  @ApiResponse({ status: 404, description: 'Interview not completed' })
  feedback(@Param('id') id: string) {
    return this.interviewsService.getFeedback(id);
  }
}
