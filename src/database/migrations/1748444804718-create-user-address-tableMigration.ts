import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserAddressTableMigration1748444804718 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TABLE "user_addresses" (
        "id"           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        "uuid"         uuid NOT NULL DEFAULT uuid_generate_v4(),

        "user_id"      BIGINT NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,

        "province"     TEXT NOT NULL,
        "city"         TEXT NOT NULL,
        "address"      TEXT NOT NULL,
        "postal_code"  TEXT,
        "house_number" TEXT,
        "floor_number" TEXT,

        "created_at"   TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"   TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"   TIMESTAMP WITH TIME ZONE DEFAULT null
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_addresses";`);
  }

}
