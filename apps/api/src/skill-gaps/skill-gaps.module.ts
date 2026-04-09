import { Module } from '@nestjs/common';
import { SkillGapsController } from './skill-gaps.controller';
import { SkillGapsService } from './skill-gaps.service';
import { AiModule } from '../ai/ai.module';

@Module({ controllers: [SkillGapsController], providers: [SkillGapsService], imports: [AiModule] })
export class SkillGapsModule {}
