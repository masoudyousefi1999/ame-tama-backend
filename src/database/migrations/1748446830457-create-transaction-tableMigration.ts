import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransactionsTableMigration1748446830457 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

        await queryRunner.query(`
        CREATE TABLE "transactions" (
            "id"              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            "uuid"            uuid NOT NULL DEFAULT uuid_generate_v4(),

            "payment_id"      BIGINT NOT NULL REFERENCES "payments"(id) ON DELETE CASCADE,
            "method"          TEXT NOT NULL,
            "reference_id"    TEXT NOT NULL,
            "tracking_code"   TEXT,
            "amount"          bigint,

            "response_data"   jsonb DEFAULT '{}'::JSONB,
            "paid_at"         TIMESTAMP WITH TIME ZONE,
            "created_at"      TIMESTAMP NOT NULL DEFAULT now()
        );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transactions";`);
    }

}
