import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderItemTableMigration1748445314687 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "order_items" (
            "id"          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            "order_id"    BIGINT NOT NULL REFERENCES "orders"(id) ON DELETE CASCADE,
            "product_id"  BIGINT NOT NULL REFERENCES "products"(id),
            "quantity"    smallint NOT NULL CHECK (quantity > 0),
            "price"       bigint, -- NULL while pending, set when confirmed
            "created_at"  TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at"  TIMESTAMP NOT NULL DEFAULT now()
        );
    `);

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "order_items";`);
  }

}
