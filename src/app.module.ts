import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CalculatorModule } from './modules/calculator/calculator.module';
import { HealthModule } from './modules/health/health.module';
import { MailModule } from './modules/mail/mail.module';
import { PartnerModule } from './modules/partner/partner.module';
import { WasteGeneratorsModule } from './modules/waste-generator/waste-generator.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CalculatorModule,
    MailModule,
    PartnerModule,
    WasteGeneratorsModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
