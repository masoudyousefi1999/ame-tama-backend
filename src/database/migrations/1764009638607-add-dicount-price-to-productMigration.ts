import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDicountPriceToProductMigration1764009638607
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "products" ADD COLUMN "discount_price" NUMERIC(10,2);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "products" DROP COLUMN "discount_price";
    `);
  }
}
