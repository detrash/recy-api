export class UploadFileDto {
  fileName: string;
  file: Buffer;
  bucketName?: string;
}
