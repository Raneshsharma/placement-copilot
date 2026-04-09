import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}
  @Get() list(@Query() q: any) { return this.jobsService.list(q); }
  @Get('search') search(@Query() q: any) { return this.jobsService.search(q); }
  @Get(':id') get(@Param('id') id: string) { return this.jobsService.findById(id); }
  @Post('saved') save(@Req() req: any, @Body() dto: any) { return this.jobsService.save(req.user.userId, dto); }
  @Delete('saved/:id') unsave(@Param('id') id: string) { return this.jobsService.unsave(id); }
}
