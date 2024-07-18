import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { GraphQLModule } from './graphql/graphql.module';

@Module({
  imports: [DatabaseModule, GraphQLModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
