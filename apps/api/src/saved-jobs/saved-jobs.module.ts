import { Module } from '@nestjs/common';
import { SavedJobsController } from './saved-jobs.controller';
import { SavedJobsService } from './saved-jobs.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [SavedJobsController],
  providers: [SavedJobsService],
  imports: [PrismaModule],
})
export class SavedJobsModule {}
