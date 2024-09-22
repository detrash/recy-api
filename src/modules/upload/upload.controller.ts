import {
  Controller,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import multer from 'multer';

import { UploadService } from './upload.service';

@ApiTags('upload')
@Controller({ path: 'upload', version: '1' })
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          // new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: multer.File,
    @Query('bucket') bucketName: string,
  ) {
    const options = {
      fileName: file.originalname,
      file: file.buffer,
      bucketName: bucketName || process.env.AWS_S3_BUCKET_NAME,
    };

    await this.uploadService.upload(options);
  }
}
