import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSavedJobDto {
  @IsNotEmpty()
  @IsString()
  jobId!: string;
}
