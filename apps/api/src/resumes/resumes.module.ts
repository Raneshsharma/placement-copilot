import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';
import { AiModule } from '../ai/ai.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    MulterModule.register({ dest: './uploads/resumes' }),
    AiModule,
    PrismaModule,
  ],
  controllers: [ResumesController],
  providers: [ResumesService],
  exports: [ResumesService],
})
export class ResumesModule {}
