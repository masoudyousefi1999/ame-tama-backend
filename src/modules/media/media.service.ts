import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import type { IFile } from 'interfaces/IFile';
import type { CreateMediaDto } from './dtos/create-media.dto';
import { MediaRepository } from './media.repository';
import type { FindOptionsWhere } from 'typeorm';
import type { MediaEntity } from './media.entity';

@Injectable()
export class MediaService {
  constructor(
    @Inject(forwardRef(() => AwsS3Service)) private awsService: AwsS3Service,
    private mediaRepo: MediaRepository,
  ) {}

  async uploadFile(file: IFile, createMediaDto: CreateMediaDto) {
    const { type: fileType } = createMediaDto;

    const uploadedFile = await this.awsService.uploadImage(file, fileType || 1);

    if ('error' in uploadedFile) {
      console.error(uploadedFile.error);
      throw new InternalServerErrorException('upload failed please try again.');
    }

    const { bucketName, fileName, type } = uploadedFile;

    const splittedFileName = fileName.split('.');

    const uuid = splittedFileName[0];
    const fileExtension = 'webp';

    const media = await this.mediaRepo.create({
      uuid,
      bucketName,
      mediaType: type as any,
      fileExtension,
      fileSize: file.size,
    });

    return media;
  }

  async getMedia(filter: FindOptionsWhere<MediaEntity>) {
    return await this.mediaRepo.findOne({ filter });
  }

  async getMedias(filter: FindOptionsWhere<MediaEntity>[]) {
    return await this.mediaRepo.find({ filter });
  }
}
