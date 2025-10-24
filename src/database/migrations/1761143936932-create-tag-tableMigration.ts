import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTagTableMigration1761143936932
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create table "tag" (
            "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" TEXT NOT NULL CHECK (CHAR_LENGTH(name) <= 250),
            "slug" TEXT NOT NULL CHECK (CHAR_LENGTH(slug) <= 250),
            "description" TEXT,
            "image_id" BIGINT,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT null,
            CONSTRAINT "UQ_tags_uuid" UNIQUE ("uuid"),
            CONSTRAINT "FK_tags_image" FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE SET NULL
        )
        
        `);

    await queryRunner.query(`
             CREATE UNIQUE INDEX "Unique_Slug_where_deleted_at_is_null"
      ON "tag" ("slug")
      WHERE "deleted_at" IS NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "Unique_Slug_where_deleted_at_is_null";`,
    );
    await queryRunner.query(`DROP TABLE "tag"`);
  }
}
