import type { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeMediaTypeMigration1764697134069 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Change type with USING cast
        await queryRunner.query(`
          ALTER TABLE "media"
          ALTER COLUMN "media_type" TYPE TEXT USING media_type::text
        `);
    
        // Add NOT NULL constraint
        await queryRunner.query(`
          ALTER TABLE "media"
          ALTER COLUMN "media_type" SET NOT NULL
        `);
    
        // Add CHECK constraint for length <= 50
        await queryRunner.query(`
          ALTER TABLE "media"
          ADD CONSTRAINT "CHK_media_type_length" CHECK (char_length(media_type) <= 50)
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the CHECK constraint first
        await queryRunner.query(`
          ALTER TABLE "media"
          DROP CONSTRAINT "CHK_media_type_length"
        `);
    
        // Remove NOT NULL constraint
        await queryRunner.query(`
          ALTER TABLE "media"
          ALTER COLUMN "media_type" DROP NOT NULL
        `);
    
        // Change back to integer with cast
        await queryRunner.query(`
          ALTER TABLE "media"
          ALTER COLUMN "media_type" TYPE INTEGER USING media_type::integer
        `);
      }

}
