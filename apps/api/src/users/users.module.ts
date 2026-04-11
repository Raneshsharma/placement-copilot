import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    PrismaModule,
    MulterModule.register({
      dest: './uploads/avatars',
    }),
  ],
  exports: [UsersService],
})
export class UsersModule {}
