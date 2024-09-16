import { Module } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { RecyclerController } from './recycler.controller';
import { RecyclerService } from './recycler.service';

@Module({
  controllers: [RecyclerController],
  providers: [RecyclerService, PrismaService],
})
export class RecyclerModule {}
