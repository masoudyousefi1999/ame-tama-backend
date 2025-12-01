import type { MigrationInterface, QueryRunner } from 'typeorm';

export class SetPriceBigintMigration1764610152565
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "wallet_transactions" ALTER COLUMN "amount" TYPE BIGINT;
        `);
    await queryRunner.query(`
            ALTER TABLE "products" ALTER COLUMN "price" TYPE BIGINT;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "wallet_transactions" ALTER COLUMN "amount" TYPE INTEGER;
        `);
    await queryRunner.query(`
            ALTER TABLE "products" ALTER COLUMN "price" TYPE NUMERIC(10,2);
        `);
  }
}
