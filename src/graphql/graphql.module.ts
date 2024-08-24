import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule as NestJsGraphQLModule } from '@nestjs/graphql';
import { resolve } from 'path';

import { S3Service } from '@/modules/s3/s3.service';
import { DocumentsService } from '@/modules/documents/documents.service';
import { FormsService } from '@/modules/forms/forms.service';
import { UsersService } from '@/modules/users/users.service';

import { DatabaseModule } from '../modules/database/database.module';
import { AuthorizationGuard } from './authorization.guard';
import { DocumentsResolver } from './resolvers/documents.resolver';
import { FormsResolver } from './resolvers/forms.resolver';
import { MeResolver } from './resolvers/me.resolver';
import { UsersResolver } from './resolvers/users.resolver';

@Module({
  imports: [
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
