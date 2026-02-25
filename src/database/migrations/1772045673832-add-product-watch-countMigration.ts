import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductWatchCountMigration1772045673832
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // اضافه کردن فیلد view_count به جدول products
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD "view_count" INTEGER NOT NULL DEFAULT 0;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // حذف فیلد view_count از جدول products در صورت برگشت
    await queryRunner.query(`
            ALTER TABLE "products"
            DROP COLUMN "view_count";
        `);
  }
}
