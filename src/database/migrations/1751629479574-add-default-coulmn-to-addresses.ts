import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultCoulmnToAddresses1751629479574
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_addresses" ADD COLUMN "default" BOOLEAN DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      ` ALTER TABLE "user_addresses"
      DROP COLUMN "default`,
    );
  }
}
