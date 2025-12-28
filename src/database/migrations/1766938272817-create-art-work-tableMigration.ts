import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArtWorkTableMigration1766938272817
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "art_work" (
                "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                "uuid"   uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" TEXT NOT NULL CHECK (CHAR_LENGTH(title) <= 255),
                "description" TEXT,
                "image_id" BIGINT NOT NULL,
                "user_id" BIGINT NOT NULL,
                "tag_id" BIGINT NOT NULL,
                "like_count" BIGINT NOT NULL DEFAULT 0,
                "dislike_count" BIGINT NOT NULL DEFAULT 0,
                "view_count" BIGINT NOT NULL DEFAULT 0,
                "is_published" BOOLEAN NOT NULL DEFAULT false,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT null,
                CONSTRAINT "UQ_artworks_uuid" UNIQUE ("uuid"),

                CONSTRAINT "fk_artworks_user" FOREIGN KEY ("user_id") REFERENCES "users"(id) ON DELETE CASCADE,
                CONSTRAINT "fk_artworks_image" FOREIGN KEY ("image_id") REFERENCES "media"(id) ON DELETE CASCADE,
                CONSTRAINT "fk_artworks_tag" FOREIGN KEY ("tag_id") REFERENCES "tag"(id) ON DELETE CASCADE
            );
        `);

    await queryRunner.query(`
            CREATE INDEX idx_artworks_user_id
            ON "art_work"(user_id);
        `);

    await queryRunner.query(`
            CREATE INDEX idx_artworks_tag_id
            ON "art_work"(tag_id);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "art_work"`);
  }
}
