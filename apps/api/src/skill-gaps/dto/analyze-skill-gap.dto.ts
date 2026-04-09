import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnalyzeSkillGapDto {
  @ApiProperty()
  @IsString()
  targetRole!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  currentSkills?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  experience?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  education?: any[];
}
