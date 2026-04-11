import { Module } from '@nestjs/common';
import { SkillGapsController } from './skill-gaps.controller';
import { SkillGapsService } from './skill-gaps.service';
import { AiModule } from '../ai/ai.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ controllers: [SkillGapsController], providers: [SkillGapsService], imports: [AiModule, PrismaModule] })
export class SkillGapsModule {}
