import type { MigrationInterface, QueryRunner } from "typeorm";

export class ViewCountForBlogMigration1764618736992 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE blog
            ADD COLUMN view_count INT NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE blog
            DROP COLUMN view_count
        `);
    }

}
