import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductMediaTableMigration1748432794332
  implements MigrationInterface
{
  name = 'CreateProductMediaTableMigration1748432794332';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "product_media" (
                "product_id"    BIGINT      NOT NULL REFERENCES "products"(id) ON DELETE CASCADE,
                "media_id"      BIGINT      NOT NULL REFERENCES "media"(id) ON DELETE CASCADE,
                "order"         INTEGER     NOT NULL DEFAULT 0,
                "is_default"    BOOLEAN     NOT NULL DEFAULT FALSE,
                PRIMARY KEY ("product_id", "media_id")
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "product_media";`);
  }
}
