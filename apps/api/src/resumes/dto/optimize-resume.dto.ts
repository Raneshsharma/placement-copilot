import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OptimizeResumeDto {
  @ApiProperty()
  @IsString()
  targetRole: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  targetCompanies?: string[];
}
