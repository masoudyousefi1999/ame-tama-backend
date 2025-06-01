import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentTableMigration1748446830456 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

        await queryRunner.query(`
        CREATE TABLE "payments" (
            "id"          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            "uuid"        uuid NOT NULL DEFAULT uuid_generate_v4(),
            "order_id"    BIGINT NOT NULL REFERENCES "orders"(id) ON DELETE CASCADE,
            "amount"      BIGINT NOT NULL DEFAULT 0,
            "status"      TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
            "created_at"  TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at"  TIMESTAMP NOT NULL DEFAULT now()
        );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "payments";`);
    }

}
