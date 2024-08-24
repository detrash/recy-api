import { Module } from '@nestjs/common';

import { MailModule } from '@/modules/mail';

import { CalculatorController } from './calculator.controller';
import { CalculatorService } from './calculator.service';

@Module({
  imports: [CalculatorModule, MailModule],
  controllers: [CalculatorController],
  providers: [CalculatorService],
})
export class CalculatorModule {}
