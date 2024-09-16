import { Module } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { UserModule } from '../user/user.module';
import { AuditorController } from './auditor.controller';
import { AuditorService } from './auditor.service';

@Module({
  imports: [UserModule],
  controllers: [AuditorController],
  providers: [AuditorService, PrismaService],
})
export class AuditorModule {}
