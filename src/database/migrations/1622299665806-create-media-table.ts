import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMediaTable1622299665806 implements MigrationInterface {
  name = 'CreateMediaTable1622299665806';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(
      `CREATE TABLE "media" (
          "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          "uuid"             uuid       NOT NULL DEFAULT uuid_generate_v4(),
          "file_extension"   TEXT       NOT NULL CHECK (CHAR_LENGTH(file_extension) <= 15),
          "media_type"       INTEGER    NOT NULL,     -- e.g., 1 for IMAGE, 2 for VIDEO
          "file_size"        BIGINT     NOT NULL,
          "bucket_name"      TEXT       NOT NULL  CHECK (CHAR_LENGTH(bucket_name) <= 150),
          "created_at"       TIMESTAMP  WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at"       TIMESTAMP  WITH TIME ZONE NOT NULL DEFAULT now(),
          "deleted_at"       TIMESTAMP  WITH TIME ZONE DEFAULT null,
          CONSTRAINT "UQ_media_uuid" UNIQUE ("uuid")
        )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "media"');
  }
}
