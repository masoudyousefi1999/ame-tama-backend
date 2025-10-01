import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCommentTableMigration1759334346428
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "comment" (
              "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
              "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
              "text" TEXT NOT NULL,
              "user_id" BIGINT NOT NULL,
              "product_id" BIGINT NOT NULL,
              "is_published" BOOLEAN NOT NULL DEFAULT false,
              "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
              "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
              
              CONSTRAINT "UQ_comment_uuid" UNIQUE ("uuid"),
              CONSTRAINT "FK_comment_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
              CONSTRAINT "FK_comment_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
            );
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "comment";
      `);
  }
}
