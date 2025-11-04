import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRssTableMigration1762279054153
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "rss" (
                "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                "url" TEXT NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "rss";`);
  }
}
