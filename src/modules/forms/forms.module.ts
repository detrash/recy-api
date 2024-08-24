import { Module } from '@nestjs/common';

import { S3Module } from '@/_s3';
import { DocumentsModule } from '@/modules/documents';
import { UsersModule } from '@/modules/users';

import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';

@Module({
  imports: [S3Module, UsersModule, DocumentsModule],
  controllers: [FormsController],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule {}
