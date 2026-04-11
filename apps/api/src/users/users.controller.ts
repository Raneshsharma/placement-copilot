import {
  Controller, Get, Put, Patch, Post, Delete, Body, Param, UseGuards, Req, UseInterceptors,
  UploadedFile, Query, BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateMeDto } from './dto/update-me.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the current user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@Req() req: any) {
    return this.usersService.getMe(req.user.userId);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateMe(@Req() req: any, @Body() dto: UpdateMeDto) {
    return this.usersService.updateMe(req.user.userId, dto);
  }

  @Get('me/notifications')
  @ApiOperation({ summary: 'Get notification preferences' })
  @ApiResponse({ status: 200, description: 'Returns notification preferences' })
  getNotifications(@Req() req: any) {
    return this.usersService.getNotificationPreferences(req.user.userId);
  }

  @Put('me/notifications')
  @ApiOperation({ summary: 'Update notification preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated' })
  updateNotifications(@Req() req: any, @Body() dto: UpdateNotificationsDto) {
    return this.usersService.updateNotificationPreferences(req.user.userId, dto);
  }

  @Post('me/avatar')
  @ApiOperation({ summary: 'Upload avatar image' })
  @ApiResponse({ status: 200, description: 'Avatar uploaded' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, callback) => {
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      if (allowed.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new BadRequestException('Only JPEG, PNG, and WebP files are allowed'), false);
      }
    },
  }))
  uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.usersService.uploadAvatar(req.user.userId, `/uploads/avatars/${file.filename}`);
  }

  @Get('me/data-export')
  @ApiOperation({ summary: 'Export all user data' })
  @ApiResponse({ status: 200, description: 'Returns all user data as JSON' })
  exportData(@Req() req: any) {
    return this.usersService.exportData(req.user.userId);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Soft delete current user account' })
  @ApiResponse({ status: 200, description: 'Account deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  deleteMe(@Req() req: any) {
    return this.usersService.softDelete(req.user.userId);
  }
}
