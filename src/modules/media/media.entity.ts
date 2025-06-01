import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity.ts';
import { UseDto } from '../../decorators/use-dto.decorator.ts';
import { MediaDto } from './dtos/media.dto.ts';
import type { MediaType } from '../../constants/media-type.ts';
import { getFileUrl } from '../../common/utils.ts';

@Entity({ name: 'media' })
@UseDto(MediaDto)
export class MediaEntity extends AbstractEntity<MediaDto> {
  @Column({ type: 'uuid',  default: () => 'uuid_generate_v4()'})
  declare uuid: Uuid;

  @CreateDateColumn({
    type: 'timestamp',
  })
  declare createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  declare updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
  })
  declare deletedAt: Date | null;

  @Column({ type: 'text' })
  fileExtension!: string;

  @Column({ type: 'int' })
  mediaType!: MediaType;

  @Column({ type: 'bigint' })
  fileSize!: number;

  @Column({ type: 'text' })
  bucketName!: string;

  get url() {
    return getFileUrl(
      this.uuid,
      this.mediaType as any,
      this.bucketName,
      this.fileExtension,
    );
  }
}
