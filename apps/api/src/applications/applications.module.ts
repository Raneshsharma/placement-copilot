import { Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({ controllers: [ApplicationsController], providers: [ApplicationsService], imports: [PrismaModule] })
export class ApplicationsModule {}
