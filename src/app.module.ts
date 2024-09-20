import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuditModule } from './modules/audit/audit.module';
import { CalculatorModule } from './modules/calculator/calculator.module';
import { HealthModule } from './modules/health/health.module';
import { MailModule } from './modules/mail/mail.module';
import { RecyclingReportModule } from './modules/recycling-report';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';
import { Web3Module } from './modules/web3/web3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    Web3Module,
    UploadModule,
    CalculatorModule,
    MailModule,
    RecyclingReportModule,
    AuditModule,
    UserModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
