import { AbstractEntity } from '../../common/abstract.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { SeoTypeEnum } from './seo-type.enum';
import { UseDto } from '../../decorators/use-dto.decorator';
import { SeoDto } from './dto/seo.dto';
import { MediaEntity } from '../media/media.entity';

@Entity({ name: 'seo_metadata' })
@UseDto(SeoDto)
export class SeoEntity extends AbstractEntity {
  @CreateDateColumn({
    type: 'timestamp',
  })
  declare createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  declare updatedAt: Date;

  @Column({ type: 'bigint' })
  entityId!: number;

  @Column({ type: 'smallint', enum: SeoTypeEnum })
  entityType!: SeoTypeEnum;

  @Column({ type: 'text', nullable: true })
  metaTitle!: string;

  @Column({ type: 'text', nullable: true })
  metaDescription!: string;

  @Column({ type: 'text', nullable: true })
  canonicalUrl!: string;

  @Column({ type: 'text', nullable: true })
  ogTitle!: string;

  @Column({ type: 'text', nullable: true })
  ogDescription!: string;

  @Column({ type: 'bigint', nullable: true })
  ogImage!: number;

  @Column({ type: 'text', nullable: true })
  twitterCard!: string;

  @ManyToOne(() => MediaEntity, { eager: true })
  @JoinColumn({ name: 'og_image', referencedColumnName: 'id' })
  ogImageMedia?: Relation<MediaEntity>;
}
