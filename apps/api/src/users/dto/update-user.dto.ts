import { IsOptional, IsString, IsEnum, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password?: string;

  @IsOptional()
  @IsEnum(['USER', 'PREMIUM', 'ADMIN'])
  role?: 'USER' | 'PREMIUM' | 'ADMIN';
}
