import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBlogTopicTableMigration1760704340889
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "blog_topic" (
        "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name"          TEXT NOT NULL CHECK (CHAR_LENGTH(name) <= 250),
        "slug"          TEXT NOT NULL CHECK (CHAR_LENGTH(slug) <= 250),
        "description"   TEXT NOT NULL,
        "image"         BIGINT,
        "created_at"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at"    TIMESTAMP WITH TIME ZONE DEFAULT null,
        CONSTRAINT "UQ_blog_topic_uuid" UNIQUE ("uuid"),
        CONSTRAINT "UQ_blog_topic_slug" UNIQUE ("slug"),
        CONSTRAINT "FK_blog_topic_image" FOREIGN KEY ("image") REFERENCES "media"(id) ON DELETE SET NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "blog_topic";`);
  }
}
