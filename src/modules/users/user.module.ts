import { forwardRef, Module } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { Auth0Module } from '../auth0/auth0.module';
import { Auth0Service } from '../auth0/auth0.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [Auth0Module],
  controllers: [UserController],
  providers: [UserService, PrismaService, Auth0Service],
  exports: [UserService],
})
export class UserModule {}
