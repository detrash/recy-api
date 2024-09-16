import { Module } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { UserModule } from '../user/user.module';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';

@Module({
  imports: [UserModule],
  controllers: [PartnerController],
  providers: [PartnerService, PrismaService],
})
export class PartnerModule {}
