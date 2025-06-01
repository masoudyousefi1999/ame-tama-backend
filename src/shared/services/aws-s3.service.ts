import { S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import mime from 'mime-types';
import type { IFile } from './../../interfaces/IFile.ts';
import { ApiConfigService } from './api-config.service.ts';
import { GeneratorService } from './generator.service.ts';
import type { MediaType } from '../../constants/media-type.ts';

@Injectable()
export class AwsS3Service {
  private readonly s3: S3;

  constructor(
    public configService: ApiConfigService,
    public generatorService: GeneratorService,
  ) {
    const config = configService.awsS3Config;
    this.s3 = new S3({
      region: config.bucketRegion,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      endpoint: config.endpoint,
    });
  }

  async uploadImage(
    file: IFile,
    type: MediaType,
  ): Promise<
    | {
        fileName: string;
        type: MediaType;
        bucketName: string;
      }
    | {
        error: any;
      }
  > {
    try {
      const fileName = this.generatorService.fileName(
        mime.extension(file.mimetype) as string,
      );

      const key = `${type}/${fileName}`;
      const bucketName = this.configService.awsS3Config.bucketName;

      await this.s3.putObject({
        Bucket: bucketName,
        Body: file.buffer,
        ACL: 'public-read',
        Key: key,
      });

      return { fileName, type, bucketName };
    } catch (error) {
      return { error };
    }
  }
}
