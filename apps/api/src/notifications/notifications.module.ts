import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ controllers: [NotificationsController], providers: [NotificationsService], imports: [PrismaModule] })
export class NotificationsModule {}
