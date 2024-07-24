import { Module } from '@nestjs/common';

import { S3Module } from '@/s3';

import { DocumentsService } from './documents.service';

@Module({
  imports: [S3Module],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
