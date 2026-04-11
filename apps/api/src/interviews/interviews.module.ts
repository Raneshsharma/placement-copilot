import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';
import { InterviewsGateway } from './interviews.gateway';
import { AiModule } from '../ai/ai.module';
import { PrismaModule } from '../prisma/prisma.module';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is required.');
  return secret;
}

@Module({
  controllers: [InterviewsController],
  providers: [InterviewsService, InterviewsGateway],
  imports: [AiModule, PrismaModule, JwtModule.register({ secret: getJwtSecret(), signOptions: { expiresIn: '15m' } })],
})
export class InterviewsModule {}
