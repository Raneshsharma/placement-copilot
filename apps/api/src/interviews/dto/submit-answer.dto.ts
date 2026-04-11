import { IsString, IsOptional, IsEnum, IsNumber, IsArray, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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

export class SubmitAnswerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  questionId?: string;

  @ApiProperty()
  @IsString()
  answer!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  duration?: number;
}

export class UpdateInterviewDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  feedback?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  duration?: number;
}
