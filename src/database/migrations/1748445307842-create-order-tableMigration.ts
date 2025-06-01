import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderTableMigration1748445307842 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "order_status_enum" AS ENUM (
        'open',
        'pending',
        'confirmed',
        'shipping',
        'shipped',
        'cancelled'
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        "uuid" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" BIGINT NOT NULL REFERENCES "users"(id),
        "total_price" bigint,
        "final_price" bigint,
        "status" order_status_enum NOT NULL DEFAULT 'open',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "orders";`);
    await queryRunner.query(`DROP TYPE "order_status_enum";`);
  }
}
