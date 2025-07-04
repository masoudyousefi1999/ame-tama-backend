import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAddressIdToOrder1751626206070 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "orders"
      ADD COLUMN "address_id" BIGINT
    `);

    await queryRunner.query(`
      ALTER TABLE "orders"
      ADD CONSTRAINT "FK_orders_address_id"
      FOREIGN KEY ("address_id")
      REFERENCES "user_addresses"("id")
      ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1) Drop FK
    await queryRunner.query(`
      ALTER TABLE "orders"
      DROP CONSTRAINT "FK_orders_address_id"
    `);

    // 2) Drop column
    await queryRunner.query(`
      ALTER TABLE "orders"
      DROP COLUMN "address_id"
    `);
  }
}
