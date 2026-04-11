import { Module } from '@nestjs/common';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { AiModule } from '../ai/ai.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [SkillsController],
  providers: [SkillsService],
  imports: [AiModule, PrismaModule],
})
export class SkillsModule {}
