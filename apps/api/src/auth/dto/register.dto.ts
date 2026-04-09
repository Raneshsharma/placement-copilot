import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty() @IsEmail() email!: string;
  @ApiProperty() @IsString() @MinLength(8) @MaxLength(50) password!: string;
  @ApiProperty() @IsString() firstName!: string;
  @ApiProperty() @IsString() lastName!: string;
}
