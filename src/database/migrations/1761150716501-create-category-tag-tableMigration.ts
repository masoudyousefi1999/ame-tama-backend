import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategoryTagTableMigration1761150716501
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "category_tag" (
            "category_id" BIGINT NOT NULL REFERENCES "categories"(id) ON DELETE CASCADE,
            "tag_id" BIGINT NOT NULL REFERENCES "tag"(id) ON DELETE CASCADE,
            PRIMARY KEY ("category_id", "tag_id")
      );            
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "category_tag";`);
  }
}
