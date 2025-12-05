import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateShippingMethodTableMigration1764937338473
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "shipping_method" (
        "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        "name" TEXT NOT NULL CHECK (CHAR_LENGTH(name) <= 250),
        "price" bigint NOT NULL,
        "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "shipping_method";`);
  }
}
