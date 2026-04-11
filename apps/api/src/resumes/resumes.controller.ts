import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ResumesService } from './resumes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadResumeDto } from './dto/upload-resume.dto';
import { OptimizeResumeDto } from './dto/optimize-resume.dto';

@ApiTags('resumes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('resumes')
export class ResumesController {
  constructor(private resumesService: ResumesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a resume file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadResumeDto })
  @ApiResponse({ status: 201, description: 'Resume uploaded' })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (!/\.(pdf|docx?|txt)$/i.test(file.originalname)) {
          return cb(new Error('Only PDF, DOC, DOCX, and TXT files allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  upload(@Req() req: any, @UploadedFile() file: Express.Multer.File, @Body() dto: UploadResumeDto) {
    return this.resumesService.upload(req.user.userId, file, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List user resumes' })
  @ApiResponse({ status: 200, description: 'Returns all resumes' })
  list(@Req() req: any) {
    return this.resumesService.list(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resume by ID' })
  @ApiResponse({ status: 200, description: 'Returns the resume' })
  @ApiResponse({ status: 403, description: 'Not authorized to access this resume' })
  async get(@Req() req: any, @Param('id') id: string) {
    return this.resumesService.findByIdForUser(id, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a resume' })
  @ApiResponse({ status: 200, description: 'Resume deleted' })
  @ApiResponse({ status: 403, description: 'Not authorized to delete this resume' })
  async delete(@Req() req: any, @Param('id') id: string) {
    return this.resumesService.deleteForUser(id, req.user.userId);
  }

  @Post(':id/primary')
  @ApiOperation({ summary: 'Set resume as primary' })
  @ApiResponse({ status: 200, description: 'Primary resume updated' })
  @ApiResponse({ status: 403, description: 'Not authorized to modify this resume' })
  async setPrimary(@Req() req: any, @Param('id') id: string) {
    return this.resumesService.setPrimary(id, req.user.userId);
  }

  @Post(':id/analyze')
  @ApiOperation({ summary: 'Analyze resume with AI' })
  @ApiResponse({ status: 200, description: 'Returns analysis' })
  @ApiResponse({ status: 403, description: 'Not authorized to access this resume' })
  async analyze(@Req() req: any, @Param('id') id: string) {
    return this.resumesService.analyzeForUser(id, req.user.userId);
  }

  @Post(':id/optimize')
  @ApiOperation({ summary: 'Optimize resume for a target role' })
  @ApiResponse({ status: 200, description: 'Returns optimization suggestions' })
  @ApiResponse({ status: 403, description: 'Not authorized to access this resume' })
  async optimize(@Req() req: any, @Param('id') id: string, @Body() dto: OptimizeResumeDto) {
    return this.resumesService.optimizeForUser(id, req.user.userId, dto);
  }
}
