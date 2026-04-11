import { Module } from '@nestjs/common';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { AiModule } from '../ai/ai.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ProgressController],
  providers: [ProgressService],
  imports: [AiModule, PrismaModule],
})
export class ProgressModule {}
