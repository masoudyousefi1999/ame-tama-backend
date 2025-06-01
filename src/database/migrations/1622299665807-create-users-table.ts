import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1622299665807 implements MigrationInterface {
  name = 'CreateUsersTable1622299665807';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TYPE "users_role_enum" AS ENUM('USER', 'ADMIN')
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        "uuid"          uuid NOT NULL DEFAULT uuid_generate_v4(),

        "first_name"    TEXT CHECK (CHAR_LENGTH(first_name) <= 100),
        "last_name"     TEXT CHECK (CHAR_LENGTH(last_name) <= 100),
        "role"          "users_role_enum" NOT NULL DEFAULT 'USER',
        "email"         TEXT CHECK (CHAR_LENGTH(email) <= 150),
        "password"      TEXT CHECK (CHAR_LENGTH(password) <= 150),
        "phone"         TEXT CHECK (CHAR_LENGTH(phone) <= 30),
        "avatar"        BIGINT REFERENCES media(id),

        "created_at"    TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at"    TIMESTAMP WITH TIME ZONE DEFAULT null,

        CONSTRAINT "UQ_user_email_unique" UNIQUE ("email"),
        CONSTRAINT "UQ_user_uuid" UNIQUE ("uuid"),
        CONSTRAINT "UQ_user_phone_unique" UNIQUE ("phone")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TYPE "users_role_enum"');
  }
}
