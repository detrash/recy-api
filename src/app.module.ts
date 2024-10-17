import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenTelemetryModule } from 'nestjs-otel';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { FormsModule } from './forms';
import { GraphQLModule } from './graphql/graphql.module';
import { UsersModule } from './users/users.module';

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true,
    apiMetrics: {
      enable: true,
    },
  },
});

@Module({
  imports: [
    OpenTelemetryModuleConfig,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.forRoot(),
    GraphQLModule,
    UsersModule,
    FormsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
