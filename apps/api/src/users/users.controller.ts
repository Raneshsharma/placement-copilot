import { Controller, Get, Patch, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('me') getMe(@Req() req: any) { return this.usersService.findById(req.user.userId); }
  @Patch('me') updateMe(@Req() req: any, @Body() dto: any) { return this.usersService.update(req.user.userId, dto); }
  @Delete('me') deleteMe(@Req() req: any) { return this.usersService.softDelete(req.user.userId); }
}
