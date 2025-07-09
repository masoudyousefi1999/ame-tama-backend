import type { MigrationInterface, QueryRunner } from 'typeorm';

export class FinanceMigration1751804600442 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await queryRunner.query(`
      CREATE TYPE "finance_type_enum" AS ENUM ('income', 'expense');
    `);
    await queryRunner.query(`
      CREATE TYPE "finance_currency_enum" AS ENUM ('toman', 'rial');
    `);

    // create table
    await queryRunner.query(`
      CREATE TABLE "finance" (
        "id"          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "type" "finance_type_enum" NOT NULL,
        "currency" "finance_currency_enum" NOT NULL DEFAULT 'toman',
        "note" text NOT NULL DEFAULT '',
        "amount" bigint NOT NULL,
        "user_id" bigint NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop table
    await queryRunner.query(`
      DROP TABLE "finance";
    `);

    // drop enums
    await queryRunner.query(`
      DROP TYPE "finance_currency_enum";
    `);
    await queryRunner.query(`
      DROP TYPE "finance_type_enum";
    `);
  }
}
