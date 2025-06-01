import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateWalletBalanceTrigger1748446830460
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the update_wallet_balance function with row-level locking
    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION update_wallet_balance() RETURNS TRIGGER AS $$
        DECLARE
            current_balance INTEGER;
        BEGIN
            -- Lock the wallet row to prevent concurrent updates
            SELECT balance INTO current_balance FROM wallets WHERE id = NEW.wallet_id FOR UPDATE;

            -- Update balance based on transaction type
            IF NEW.transaction_direction = 'deposit' THEN
                current_balance := current_balance + NEW.amount;
            ELSIF NEW.transaction_direction = 'withdrawal' THEN
                -- Ensure there are sufficient funds
                IF current_balance < NEW.amount THEN
                    RAISE EXCEPTION 'Insufficient funds in wallet';
                END IF;
                current_balance := current_balance - NEW.amount;
            END IF;

            -- Update the balance in user_wallets
            UPDATE wallets SET balance = current_balance WHERE id = NEW.wallet_id;

            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    // Create the trigger to call the function before each transaction insert
    await queryRunner.query(`
        CREATE TRIGGER trigger_update_wallet_balance
        BEFORE INSERT ON wallet_transactions
        FOR EACH ROW EXECUTE FUNCTION update_wallet_balance();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the trigger and function during rollback
    await queryRunner.query(`
        DROP TRIGGER IF EXISTS trigger_update_wallet_balance ON wallet_transactions;
    `);

    await queryRunner.query(`
        DROP FUNCTION IF EXISTS update_wallet_balance;
    `);
  }
}
