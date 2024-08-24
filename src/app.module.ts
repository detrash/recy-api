import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { DocumentsModule } from './documents';
import { FormsModule } from './forms';
import { GraphQLModule } from './graphql/graphql.module';
import { CalculatorModule } from './modules/calculator/calculator.module';
import { MailModule } from './shared/mail/mail.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.forRoot(),
    GraphQLModule,
    DocumentsModule,
    UsersModule,
    FormsModule,
    CalculatorModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
