import { Module } from '@nestjs/common';
import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';
import { AiModule } from '../ai/ai.module';

@Module({ controllers: [ResumesController], providers: [ResumesService], imports: [AiModule] })
export class ResumesModule {}
