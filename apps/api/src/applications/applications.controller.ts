import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}
  @Get() list(@Req() req: any) { return this.applicationsService.list(req.user.userId); }
  @Post() create(@Req() req: any, @Body() dto: any) { return this.applicationsService.create(req.user.userId, dto); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: any) { return this.applicationsService.update(id, dto); }
  @Get(':id/timeline') timeline(@Param('id') id: string) { return this.applicationsService.getTimeline(id); }
  @Delete(':id') delete(@Param('id') id: string) { return this.applicationsService.delete(id); }
}
