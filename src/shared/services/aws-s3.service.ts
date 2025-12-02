import { CopyObjectCommand, DeleteObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import type { IFile } from './../../interfaces/IFile.ts';
import { ApiConfigService } from './api-config.service.ts';
import { GeneratorService } from './generator.service.ts';
import { MediaType } from '../../constants/media-type.ts';
import sharp from 'sharp';

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
      const fileName = this.generatorService.fileName('webp');

      const isDevelop = process.env.NODE_ENV === 'development';

      const key = `${isDevelop ? 'test' : type}/${fileName}`;
      const bucketName = this.configService.awsS3Config.bucketName;

      const webpBuffer = await sharp(file.buffer)
        .webp({ quality: 80 }) // adjust quality between 1-100
        .toBuffer();

      await this.s3.putObject({
        Bucket: bucketName,
        Body: webpBuffer,
        ACL: 'public-read',
        Key: key,
        ContentType: 'image/webp',
      });

      return { fileName, type, bucketName };
    } catch (error) {
      return { error };
    }
  }

  async moveImage(key: string, mediaType: MediaType): Promise<boolean> {
    try {
      const newKey = `${mediaType}/${key}.webp`;

      // Copy to new location
      await this.s3.send(
        new CopyObjectCommand({
          Bucket: 'ame-tama',
          CopySource: `ame-tama/1/${key}.webp`,
          Key: newKey,
        }),
      );

      // Delete old object
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: 'ame-tama',
          Key: key,
        }),
      );

      console.log(`Moved ${key} to ${newKey}`);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
