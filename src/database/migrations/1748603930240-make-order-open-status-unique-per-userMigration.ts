import type { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeOrderOpenStatusUniquePerUserMigration1748603930240
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE UNIQUE INDEX "unique_open_order_per_user" ON "orders" ("user_id") WHERE status = 'open';
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "unique_open_order_per_user";`);
  }
}
