import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategoryTable1748184684234 implements MigrationInterface {
  name = 'CreateCategoryTable1748184684234';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id"            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        "uuid"          uuid NOT NULL DEFAULT uuid_generate_v4(),

        "parent_id"     BIGINT REFERENCES "categories"(id) ON DELETE SET NULL,
        "name"          TEXT NOT NULL CHECK (CHAR_LENGTH(name) <= 100),
        "slug"          TEXT NOT NULL CHECK (CHAR_LENGTH(slug) <= 100),
        "description"   TEXT,
        "image"         BIGINT REFERENCES media(id),

        "created_at"    TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"    TIMESTAMP WITH TIME ZONE DEFAULT null,

        CONSTRAINT "UQ_categories_uuid" UNIQUE ("uuid"),
        CONSTRAINT "UQ_categories_parent_slug" UNIQUE ("parent_id", "slug")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "categories"`);
  }
}
