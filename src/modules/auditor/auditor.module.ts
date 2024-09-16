import { Module } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { AuditorController } from './auditor.controller';
import { AuditorService } from './auditor.service';

@Module({
  controllers: [AuditorController],
  providers: [AuditorService, PrismaService],
})
export class AuditorModule {}
