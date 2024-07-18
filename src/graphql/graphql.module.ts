import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule as NestJsGraphQLModule } from '@nestjs/graphql';
import { resolve } from 'path';

import { DocumentsService } from '@/documents/documents.service';
import { FormsService } from '@/forms/forms.service';
import { S3Service } from '@/s3/s3.service';
import { UsersService } from '@/users/users.service';

import { AuthorizationGuard } from '../auth/authorization.guard';
import { DatabaseModule } from '../database/database.module';
import { DocumentsResolver } from './resolvers/documents.resolver';
import { FormsResolver } from './resolvers/forms.resolver';
import { MeResolver } from './resolvers/me.resolver';
import { UsersResolver } from './resolvers/users.resolver';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    NestJsGraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: resolve(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
      playground: true,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },

    // Resolvers
    DocumentsResolver,
    UsersResolver,
    FormsResolver,
    MeResolver,

    // Services
    DocumentsService,
    UsersService,
    FormsService,
    S3Service,
  ],
})
export class GraphQLModule {}
