import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalculatorModule } from './calculator/calculator.module';
import { DatabaseModule } from './database/database.module';
import { FormsModule } from './forms';
import { GraphQLModule } from './graphql/graphql.module';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents';

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
export class AppModule { }
