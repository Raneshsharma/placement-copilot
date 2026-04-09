import { PartialType, PickType } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(['USER', 'PREMIUM', 'ADMIN'])
  role?: 'USER' | 'PREMIUM' | 'ADMIN';
}
