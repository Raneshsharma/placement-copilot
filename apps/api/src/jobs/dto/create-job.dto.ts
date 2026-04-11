import { IsString, IsOptional, IsInt, IsEnum, Min, Max, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { LocationType, JobSource } from '@prisma/client';

export class CreateJobDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  jobListingId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(LocationType)
  locationType?: LocationType;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  salaryMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  salaryMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
