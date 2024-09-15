import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CalculatorModule } from './modules/calculator/calculator.module';
import { HealthModule } from './modules/health/health.module';
import { MailModule } from './modules/mail/mail.module';
import { PartnerModule } from './modules/partner/partner.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CalculatorModule,
    MailModule,
    PartnerModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
