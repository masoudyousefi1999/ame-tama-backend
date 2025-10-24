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
        "image_id"      BIGINT,
        "created_at"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at"    TIMESTAMP WITH TIME ZONE DEFAULT null,
        CONSTRAINT "UQ_blog_topic_uuid" UNIQUE ("uuid"),
        CONSTRAINT "FK_blog_topic_image" FOREIGN KEY ("image_id") REFERENCES "media"(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
     CREATE UNIQUE INDEX "UQ_blog_topic_slug_not_deleted"
      ON "blog_topic" ("slug")
      WHERE "deleted_at" IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "UQ_blog_topic_slug_not_deleted";`);
    await queryRunner.query(`DROP TABLE "blog_topic";`);
  }
}
