import { IsEnum, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InterviewType } from '@prisma/client';

export class StartInterviewDto {
  @ApiProperty({ enum: InterviewType })
  @IsEnum(InterviewType)
  type!: InterviewType;

  @ApiProperty()
  @IsString()
  role!: string;

  @ApiProperty()
  @IsString()
  company!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  difficulty?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  applicationId?: string;
}
