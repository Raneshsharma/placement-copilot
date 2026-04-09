import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}
  @Get(':userId') get(@Param('userId') id: string) { return this.profilesService.findByUserId(id); }
  @Post() create(@Req() req: any, @Body() dto: any) { return this.profilesService.create(req.user.userId, dto); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: any) { return this.profilesService.update(id, dto); }
  @Get(':id/analysis') getAnalysis(@Param('id') id: string) { return this.profilesService.getAnalysis(id); }
}
