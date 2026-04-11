import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@ApiTags('jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'List jobs with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated job listings' })
  list(@Query() q: SearchJobsDto) {
    return this.jobsService.list(q);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search jobs by query, skills, location' })
  @ApiResponse({ status: 200, description: 'Returns search results' })
  search(@Query() q: SearchJobsDto) {
    return this.jobsService.search(q);
  }

  @Get('recommended')
  @ApiOperation({ summary: 'Get recommended jobs based on user profile' })
  @ApiResponse({ status: 200, description: 'Returns recommended jobs' })
  recommended(@Req() req: any) {
    return this.jobsService.recommended(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job by ID' })
  @ApiResponse({ status: 200, description: 'Returns the job' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  get(@Param('id') id: string) {
    return this.jobsService.findById(id);
  }

  @Post('saved')
  @ApiOperation({ summary: 'Save a job listing' })
  @ApiResponse({ status: 201, description: 'Job saved' })
  save(@Req() req: any, @Body() dto: CreateJobDto) {
    return this.jobsService.save(req.user.userId, dto);
  }

  @Patch('saved/:id')
  @ApiOperation({ summary: 'Update a saved job' })
  @ApiResponse({ status: 200, description: 'Job updated' })
  update(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(id, dto);
  }

  @Delete('saved/:id')
  @ApiOperation({ summary: 'Remove a saved job' })
  @ApiResponse({ status: 200, description: 'Job removed' })
  unsave(@Param('id') id: string) {
    return this.jobsService.unsave(id);
  }

  @Get('saved')
  @ApiOperation({ summary: 'Get saved job listings' })
  @ApiResponse({ status: 200, description: 'Returns saved jobs with pagination' })
  getSaved(@Req() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.jobsService.getSavedJobs(
      req.user.userId,
      parseInt(page || '1'),
      parseInt(limit || '20'),
    );
  }
}
