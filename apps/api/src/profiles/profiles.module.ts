import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { AiModule } from '../ai/ai.module';

@Module({ controllers: [ProfilesController], providers: [ProfilesService], imports: [AiModule] })
export class ProfilesModule {}
