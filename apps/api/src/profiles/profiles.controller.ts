import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the user profile' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  get(@Req() req: any) {
    return this.profilesService.findByUserId(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create user profile' })
  @ApiResponse({ status: 201, description: 'Profile created' })
  @ApiResponse({ status: 400, description: 'Profile already exists' })
  create(@Req() req: any, @Body() dto: CreateProfileDto) {
    return this.profilesService.create(req.user.userId, dto);
  }

  @Put()
  @ApiOperation({ summary: 'Create or update user profile (upsert)' })
  @ApiResponse({ status: 200, description: 'Profile upserted' })
  upsert(@Req() req: any, @Body() dto: CreateProfileDto) {
    return this.profilesService.upsert(req.user.userId, dto);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  update(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.profilesService.update(req.user.userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get profile by ID' })
  @ApiResponse({ status: 200, description: 'Returns the profile' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  getById(@Param('id') id: string) {
    return this.profilesService.findById(id);
  }

  @Get(':id/analysis')
  @ApiOperation({ summary: 'Get AI analysis of profile' })
  @ApiResponse({ status: 200, description: 'Returns AI analysis' })
  getAnalysis(@Param('id') id: string) {
    return this.profilesService.getAnalysis(id);
  }
}
