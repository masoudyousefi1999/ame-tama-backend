import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UserWalletMigration1748446830458 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
        CREATE TABLE "wallets" (
	        "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            "user_id" BIGINT NOT NULL,
            "balance" bigint NOT NULL DEFAULT 0 CHECK (balance >= 0),
            "uuid" UUID NOT NULL DEFAULT uuid_generate_v4(),
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "UQ_wallets_uuid" UNIQUE ("uuid"),
            CONSTRAINT "FK_wallets_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "wallets";
        `);
  }
}
