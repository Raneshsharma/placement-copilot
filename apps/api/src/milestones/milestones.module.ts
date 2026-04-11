import { Module } from '@nestjs/common';
import { MilestonesController } from './milestones.controller';
import { MilestonesService } from './milestones.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [MilestonesController],
  providers: [MilestonesService],
  imports: [PrismaModule],
})
export class MilestonesModule {}
