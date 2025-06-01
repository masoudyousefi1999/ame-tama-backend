
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class WalletTransactionMigration1748446830459
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "wallet_transactions" (
	      "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          "wallet_id" BIGINT NOT NULL,
          "amount"    INTEGER NOT NULL CHECK (amount >= 0),
          "payment_id" BIGINT DEFAULT NULL,
          "transaction_direction" TEXT NOT NULL CHECK (transaction_direction IN ('deposit', 'withdrawal')),
          "transaction_initiator" TEXT NOT NULL CHECK (transaction_initiator IN ('system', 'user')),
          "description" TEXT,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

          CONSTRAINT "FK_wallet_transactions_payment_id" FOREIGN KEY ("payment_id") REFERENCES "payments" ("id"),
          CONSTRAINT "FK_wallet_transactions_wallet_id" FOREIGN KEY ("wallet_id") REFERENCES "wallets" ("id") ON DELETE CASCADE
    );
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "wallet_transactions";
        `);
  }
}
