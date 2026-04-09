import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ResumesService } from './resumes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('resumes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('resumes')
export class ResumesController {
  constructor(private resumesService: ResumesService) {}
  @Post('upload') @UseInterceptors(FileInterceptor('file')) upload(@Req() req: any, @UploadedFile() file: any) { return this.resumesService.upload(req.user.userId, file); }
  @Get() list(@Req() req: any) { return this.resumesService.list(req.user.userId); }
  @Get(':id') get(@Param('id') id: string) { return this.resumesService.findById(id); }
  @Delete(':id') delete(@Param('id') id: string) { return this.resumesService.delete(id); }
  @Post(':id/analyze') analyze(@Param('id') id: string) { return this.resumesService.analyze(id); }
  @Post(':id/optimize') optimize(@Param('id') id: string, @Body() dto: any) { return this.resumesService.optimize(id, dto); }
}
