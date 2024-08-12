import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SumsubService } from './sumsub.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: 'https://api.sumsub.com/',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Token': configService.get('SUMSUB_ACCESS_TOKEN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SumsubService],
})
export class SumsubModule {}
