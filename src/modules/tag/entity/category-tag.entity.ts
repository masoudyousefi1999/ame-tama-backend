import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'category_tag' })
export class CategoryTagEntity {
  @PrimaryColumn({ type: 'bigint' })
  categoryId!: number;

  @PrimaryColumn({ type: 'bigint' })
  tagId!: number;
}
