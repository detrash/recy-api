import { Module } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service'; // Ensure the correct path

import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
