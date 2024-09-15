import { Module } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { PartnerController } from './waste-generators.controller';
import { PartnerService } from './waste-generators.service';

@Module({
  controllers: [PartnerController],
  providers: [PartnerService, PrismaService],
})
export class PartnerModule {}
