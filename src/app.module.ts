import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './_database/database.module';
import { FormsModule } from './modules/forms';
import { GraphQLModule } from './_graphql/graphql.module';
import { CalculatorModule } from './modules/calculator/calculator.module';
import { DocumentsModule } from './modules/documents';
import { MailModule } from './shared/services/mail/mail.module';
import { UsersModule } from './modules/users/users.module';

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
