import { AbstractRepository } from '../../common/abstract.repository';
import { CategoryEntity } from './entity/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MediaEntity } from '../../modules/media/media.entity';

@Injectable()
export class CategoryRepository extends AbstractRepository<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    protected categoryRepo: Repository<CategoryEntity>,
  ) {
    super(categoryRepo);
  }

  async findAll() {
    const rawCategories = await this.categoryRepo.query(`
  WITH RECURSIVE category_tree AS (
    SELECT 
      c.id,
      c.uuid,
      c.name,
      c.slug,
      c.description,
      c.image,
      c.parent_id,
      c.created_at,
      c.updated_at,
      c.deleted_at,
      0 AS depth
    FROM categories c
    WHERE c.deleted_at IS NULL

    UNION ALL

    SELECT 
      child.id,
      child.uuid,
      child.name,
      child.slug,
      child.description,
      child.image,
      child.parent_id,
      child.created_at,
      child.updated_at,
      child.deleted_at,
      ct.depth + 1
    FROM categories child
    INNER JOIN category_tree ct ON child.parent_id = ct.id
    WHERE child.deleted_at IS NULL
  )
  SELECT 
    ct.id,
    ct.uuid,
    ct.name,
    ct.slug,
    ct.description,
    ct.image,
    ct.parent_id AS "parentId",
    ct.created_at AS "createdAt",
    ct.updated_at AS "updatedAt",
    ct.deleted_at AS "deletedAt",
    m.id AS "mediaId",
    m.uuid AS "mediaUuid",
    m.file_extension AS "mediaFileExtension",
    m.media_type AS "mediaType",
    m.bucket_name AS "mediaBucketName"
  FROM category_tree ct
  LEFT JOIN media m ON ct.image = m.id
  ORDER BY ct.depth, ct.id;
`);


    const categoryMap = new Map<number, CategoryEntity>();

    for (const row of rawCategories) {
      const category = new CategoryEntity();
      category.id = row.id;
      category.uuid = row.uuid;
      category.name = row.name;
      category.slug = row.slug;
      category.description = row.description;
      category.image = row.image;
      category.parentId = row.parentId;
      category.createdAt = row.createdAt;
      category.updatedAt = row.updatedAt;
      category.deletedAt = row.deletedAt;
      category.children = [];

      if (row.mediaId) {
        const media = new MediaEntity();
        media.id = row.mediaId;
        media.uuid = row.mediaUuid;
        media.fileExtension = row.mediaFileExtension;
        media.mediaType = row.mediaType;
        media.bucketName = row.mediaBucketName;

        category.media = media;
      }

      categoryMap.set(category.id, category);
    }

    const tree: CategoryEntity[] = [];

    for (const category of categoryMap.values()) {
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children?.push(category);
        //   category.parent = parent;
        }
      } else {
        tree.push(category);
      }
    }

    return tree;
  }
}
