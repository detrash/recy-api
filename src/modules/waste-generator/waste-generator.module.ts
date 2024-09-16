import { Module } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { WasteGeneratorController } from './waste-generator.controller';
import { WasteGeneratorService } from './waste-generator.service';

@Module({
  controllers: [WasteGeneratorController],
  providers: [WasteGeneratorService, PrismaService],
})
export class WasteGeneratorModule {}
