import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateNotificationsDto {
  @IsOptional()
  @IsBoolean()
  applicationUpdates?: boolean;

  @IsOptional()
  @IsBoolean()
  interviewReminders?: boolean;

  @IsOptional()
  @IsBoolean()
  newJobRecommendations?: boolean;

  @IsOptional()
  @IsBoolean()
  skillGapInsights?: boolean;

  @IsOptional()
  @IsBoolean()
  tipsAndTricks?: boolean;
}
