import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ResumesModule } from './resumes/resumes.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { InterviewsModule } from './interviews/interviews.module';
import { SkillGapsModule } from './skill-gaps/skill-gaps.module';
import { ProgressModule } from './progress/progress.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AiModule } from './ai/ai.module';
import { PrismaModule } from './prisma/prisma.module';
import { MilestonesModule } from './milestones/milestones.module';
import { SavedJobsModule } from './saved-jobs/saved-jobs.module';
import { SkillsModule } from './skills/skills.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule, UsersModule, ProfilesModule, ResumesModule, JobsModule,
    ApplicationsModule, InterviewsModule, SkillGapsModule, ProgressModule,
    NotificationsModule, AiModule, MilestonesModule, SavedJobsModule, SkillsModule,
  ],
})
export class AppModule {}
