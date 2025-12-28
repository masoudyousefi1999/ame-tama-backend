import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArtWorkReactionTableMigration1766938302473
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "artwork_reaction" (
                "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                "user_id" BIGINT NOT NULL,
                "artwork_id" BIGINT NOT NULL,
                "reaction" SMALLINT NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "fk_artwork_reaction_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "fk_artwork_reaction_artwork" FOREIGN KEY ("artwork_id") REFERENCES "art_work"("id") ON DELETE CASCADE,
                CONSTRAINT "unique_user_artwork" UNIQUE ("user_id", "artwork_id"),
                CONSTRAINT "check_reaction_value" CHECK ("reaction" IN (1, -1))
            );
        `);

    await queryRunner.query(`
            CREATE INDEX idx_artwork_reaction_artwork_id
            ON artwork_reaction(artwork_id);
        `);

    await queryRunner.query(`
            CREATE INDEX idx_artwork_reaction_user_id
            ON artwork_reaction(user_id);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS artwork_reaction`);
  }
}
