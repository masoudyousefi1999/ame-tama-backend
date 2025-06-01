import type { QueryRunner } from 'typeorm';

export class OtpMigration1727883177945 {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    
    await queryRunner.query(
      `CREATE TABLE "otps" (
	        "id"             BIGINT           GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            "uuid"                    uuid    NOT NULL DEFAULT uuid_generate_v4(),
            "phone"          text             NOT NULL CHECK (CHAR_LENGTH(phone) <= 12),
            "otp_code"       text             NOT NULL CHECK (CHAR_LENGTH(otp_code) <= 250),
            "created_at"     TIMESTAMP        WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at"              TIMESTAMP WITH TIME ZONE          NOT NULL DEFAULT now(),
            "deleted_at"              TIMESTAMP WITH TIME ZONE          DEFAULT null,
            CONSTRAINT       "UQ_otps_uuid" UNIQUE ("uuid"),
            CONSTRAINT       "UQ_otp_phone"   UNIQUE ("phone")
          )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "otps"`);
  }
}
