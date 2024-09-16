import { Module } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { UserModule } from '../user/user.module';
import { WasteGeneratorController } from './waste-generator.controller';
import { WasteGeneratorService } from './waste-generator.service';

@Module({
  imports: [UserModule],
  controllers: [WasteGeneratorController],
  providers: [WasteGeneratorService, PrismaService],
})
export class WasteGeneratorModule {}
