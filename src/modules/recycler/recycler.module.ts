import { Module } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { UserModule } from '../user/user.module';
import { RecyclerController } from './recycler.controller';
import { RecyclerService } from './recycler.service';

@Module({
  imports: [UserModule],
  controllers: [RecyclerController],
  providers: [RecyclerService, PrismaService],
})
export class RecyclerModule {}
