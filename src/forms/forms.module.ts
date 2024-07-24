import { Module } from '@nestjs/common';

import { DocumentsModule } from '@/documents';
import { S3Module } from '@/s3';
import { UsersModule } from '@/users';

import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';

@Module({
  imports: [S3Module, UsersModule, DocumentsModule],
  controllers: [FormsController],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule {}
