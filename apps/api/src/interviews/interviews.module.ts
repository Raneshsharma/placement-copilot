import { Module } from '@nestjs/common';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';
import { InterviewsGateway } from './interviews.gateway';
import { AiModule } from '../ai/ai.module';

@Module({ controllers: [InterviewsController], providers: [InterviewsService, InterviewsGateway], imports: [AiModule] })
export class InterviewsModule {}
