import { S3 } from '@aws-sdk/client-s3';
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

      const quality = type === MediaType.BLOG ? 65 : 75;

      const watermarkSvg = `
      <svg width="1200" height="300" viewBox="0 0 1200 300">
        <style>
          .text {
            fill: rgb(23, 6, 96); /* navy */
            font-size: 120px;
            font-family: Arial, sans-serif;
            letter-spacing: 1px;
          }
        </style>
        <text x="50" y="200" class="text">© AME-TAMA</text>
      </svg>
      `;
      

const thumbnailWatermarkSvg = `
<svg width="300" height="80">
  <style>
    .text {
      fill: rgba(255,255,255,0.4);
      font-size: 22px;
      font-family: Arial, sans-serif;
    }
  </style>
  <text x="0" y="30" class="text">©ame-tama</text>
</svg>
`;

      const webpBuffer = await sharp(file.buffer).composite([
        {
          input: Buffer.from(watermarkSvg),
          gravity: 'southwest',
        },
      ])
        .webp({ quality })
        .toBuffer();

      // for now because we don't have a good server we must do this for icons

      const thumbnailBuffer = await sharp(file.buffer).composite([
        {
          input: Buffer.from(thumbnailWatermarkSvg),
          gravity: 'southwest',
        },
      ])
        .webp({ quality: 40, preset: 'icon' })
        .toBuffer();

      await this.s3.putObject({
        Bucket: bucketName,
        Body: thumbnailBuffer,
        ACL: 'public-read',
        Key: `thumbnail/${key}`,
        ContentType: 'image/webp',
      });

      await this.s3.putObject({
        Bucket: bucketName,
        Body: webpBuffer,
        ACL: 'public-read',
        Key: key,
        ContentType: 'image/webp',
      });

      return { fileName, type, bucketName };
    } catch (error) {
        console.log(error);
      return { error };
    }
  }
}
