import { IsOptional, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  headline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  experience?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  education?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  skills?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  certifications?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  languages?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  projects?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  portfolioUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;
}
