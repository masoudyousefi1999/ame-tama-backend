import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBlogTableMigration1760704350838
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "blog" (
                "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" TEXT NOT NULL CHECK (CHAR_LENGTH(title) <= 250),
                "content" TEXT NOT NULL,
                "user_id" bigint NOT NULL,
                "topic_id" bigint NOT NULL,
                "is_published" BOOLEAN NOT NULL DEFAULT false,
                "published_at" TIMESTAMP WITH TIME ZONE,
                "image" BIGINT,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT null,
                CONSTRAINT "UQ_blog_uuid" UNIQUE ("uuid"),
                CONSTRAINT "FK_blog_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_blog_topic" FOREIGN KEY ("topic_id") REFERENCES "blog_topic"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_blog_image" FOREIGN KEY ("image") REFERENCES media(id) ON DELETE SET NULL
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "blog";`);
  }
}
