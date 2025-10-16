import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTrackingCodeToOrderMigration1760624710182
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "orders" ADD COLUMN "tracking_code" text check (char_length(tracking_code) <= 255);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "tracking_code";
        `);
  }
}
