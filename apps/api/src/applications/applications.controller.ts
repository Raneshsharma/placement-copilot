import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UpdateApplicationStatusDto, AddApplicationNoteDto } from './dto/update-application-status.dto';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get()
  @ApiOperation({ summary: 'List user applications' })
  @ApiResponse({ status: 200, description: 'Returns paginated applications' })
  list(@Req() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.applicationsService.list(
      req.user.userId,
      parseInt(page || '1'),
      parseInt(limit || '20'),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new application' })
  @ApiResponse({ status: 201, description: 'Application created' })
  create(@Req() req: any, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(req.user.userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application by ID' })
  @ApiResponse({ status: 200, description: 'Returns the application' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  get(@Param('id') id: string) {
    return this.applicationsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an application' })
  @ApiResponse({ status: 200, description: 'Application updated' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  update(@Param('id') id: string, @Body() dto: UpdateApplicationDto) {
    return this.applicationsService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update application status with validation' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 400, description: 'Invalid transition' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateApplicationStatusDto) {
    return this.applicationsService.updateStatus(id, dto as any);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add a note to an application' })
  @ApiResponse({ status: 200, description: 'Note added' })
  addNote(@Param('id') id: string, @Body() dto: AddApplicationNoteDto) {
    if (!dto.notes) return { message: 'Note content required' };
    return this.applicationsService.addNote(id, dto.notes);
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Get application timeline' })
  @ApiResponse({ status: 200, description: 'Returns timeline entries' })
  timeline(@Param('id') id: string) {
    return this.applicationsService.getTimeline(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an application' })
  @ApiResponse({ status: 200, description: 'Application deleted' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  delete(@Param('id') id: string) {
    return this.applicationsService.delete(id);
  }
}
