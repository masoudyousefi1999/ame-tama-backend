import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductTagTableMigration1761147245983
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "product_tag" (
        "product_id" BIGINT NOT NULL REFERENCES "products"(id) ON DELETE CASCADE,
        "tag_id" BIGINT NOT NULL REFERENCES "tag"(id) ON DELETE CASCADE,
        PRIMARY KEY ("product_id", "tag_id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "product_tag";`);
  }
}
