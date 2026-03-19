import { Injectable, Logger } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private minioClient: Minio.Client;
  private readonly logger = new Logger(StorageService.name);
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName =
      this.configService.get<string>('MINIO_BUCKET_NAME') || 'fds-documents';

    const endPoint =
      this.configService.get<string>('MINIO_ENDPOINT') || 'localhost';
    const port = parseInt(
      this.configService.get<string>('MINIO_PORT') || '9000',
      10,
    );
    const useSSL = this.configService.get<string>('MINIO_USE_SSL') === 'true';
    const accessKey =
      this.configService.get<string>('MINIO_ACCESS_KEY') || 'minioadmin';
    const secretKey =
      this.configService.get<string>('MINIO_SECRET_KEY') || 'minioadmin';

    this.minioClient = new Minio.Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });

    void this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`Created MinIO bucket: ${this.bucketName}`);
      }
    } catch (e) {
      this.logger.error('Could not verify/create MinIO bucket', e);
    }
  }

  async getPresignedUrlUpload(
    objectName: string,
    expiry: number = 3600,
  ): Promise<string> {
    return this.minioClient.presignedPutObject(
      this.bucketName,
      objectName,
      expiry,
    );
  }

  async getPresignedUrlDownload(
    objectName: string,
    expiry: number = 3600,
  ): Promise<string> {
    return this.minioClient.presignedGetObject(
      this.bucketName,
      objectName,
      expiry,
    );
  }

  // Option A (buffer)
  async uploadFile(
    objectName: string,
    buffer: Buffer,
    size: number,
    metaData?: Minio.ItemBucketMetadata,
  ): Promise<void> {
    await this.minioClient.putObject(
      this.bucketName,
      objectName,
      buffer,
      size,
      metaData,
    );
  }
}
