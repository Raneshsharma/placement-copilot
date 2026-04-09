import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}
  @Get('dashboard') dashboard(@Req() req: any) { return this.progressService.getDashboard(req.user.userId); }
  @Get('analytics') analytics(@Req() req: any) { return this.progressService.getAnalytics(req.user.userId); }
  @Get('timeline') timeline(@Req() req: any) { return this.progressService.getTimeline(req.user.userId); }
}
