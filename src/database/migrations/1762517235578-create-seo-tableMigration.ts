import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSeoTableMigration1762517235578
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "seo_metadata" (
                "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                "entity_type" smallint NOT NULL,
                "entity_id" bigint NOT NULL,
                "meta_title" text DEFAULT NULL,
                "meta_description" text DEFAULT NULL,
                "canonical_url" text DEFAULT NULL,
                "og_title" text DEFAULT NULL,
                "og_description" text DEFAULT NULL,
                "og_image" bigint REFERENCES "media"(id) ON DELETE SET NULL,
                "twitter_card" text DEFAULT NULL,
                "created_at" timestamp with time zone NOT NULL DEFAULT now(),
                "updated_at" timestamp with time zone NOT NULL DEFAULT now()
            );
        `);

    await queryRunner.query(`
            CREATE UNIQUE INDEX "uniq_entity" ON "seo_metadata"("entity_type", "entity_id");
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "uniq_entity";`);
    await queryRunner.query(`DROP TABLE "seo_metadata";`);
  }
}
