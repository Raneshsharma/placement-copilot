import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { AiModule } from '../ai/ai.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ controllers: [ProfilesController], providers: [ProfilesService], imports: [AiModule, PrismaModule] })
export class ProfilesModule {}
