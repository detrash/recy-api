import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuditorModule } from './modules/auditor/auditor.module';
import { CalculatorModule } from './modules/calculator/calculator.module';
import { HealthModule } from './modules/health/health.module';
import { MailModule } from './modules/mail/mail.module';
import { PartnerModule } from './modules/partner/partner.module';
import { RecyclerModule } from './modules/recycler/recycler.module';
import { WasteGeneratorModule } from './modules/waste-generator/waste-generator.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CalculatorModule,
    MailModule,
    PartnerModule,
    WasteGeneratorModule,
    RecyclerModule,
    AuditorModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
