import { IsNotEmpty, IsString } from 'class-validator';

export class AnalyzeSkillsDto {
  @IsNotEmpty()
  @IsString()
  targetRole!: string;
}
