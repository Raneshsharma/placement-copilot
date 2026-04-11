import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SavedJobsService } from './saved-jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSavedJobDto } from './dto/create-saved-job.dto';

@ApiTags('saved-jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('saved-jobs')
export class SavedJobsController {
  constructor(private savedJobsService: SavedJobsService) {}

  @Get()
  @ApiOperation({ summary: 'List user saved jobs' })
  @ApiResponse({ status: 200, description: 'Returns saved jobs with job data' })
  list(@Req() req: any) {
    return this.savedJobsService.list(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Save a job' })
  @ApiResponse({ status: 201, description: 'Job saved' })
  create(@Req() req: any, @Body() dto: CreateSavedJobDto) {
    return this.savedJobsService.create(req.user.userId, dto.jobId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove saved job' })
  @ApiResponse({ status: 200, description: 'Job unsaved' })
  delete(@Req() req: any, @Param('id') id: string) {
    return this.savedJobsService.delete(req.user.userId, id);
  }
}
