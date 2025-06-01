import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsTableMigration1748432794330 implements MigrationInterface {
    name = 'CreateProductsTableMigration1748432794330';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

        await queryRunner.query(`
            CREATE TABLE "products" (
                "id"            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                "uuid"          uuid NOT NULL DEFAULT uuid_generate_v4(),
                
                "category_id"   BIGINT NOT NULL REFERENCES "categories"(id) ON DELETE CASCADE,
                "name"          TEXT NOT NULL CHECK (CHAR_LENGTH(name) <= 255),
                "slug"          TEXT NOT NULL CHECK (CHAR_LENGTH(slug) <= 255),
                "price"         NUMERIC(10,2) NOT NULL,
                "quantity"      INTEGER NOT NULL DEFAULT 0,
                "rating"        NUMERIC(2,1),
                "in_stock"      BOOLEAN GENERATED ALWAYS AS (quantity > 0) STORED,
                "search_vector" tsvector GENERATED ALWAYS AS (
                    to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(slug, ''))
                ) STORED,
                "created_at"    TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at"    TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at"    TIMESTAMP WITH TIME ZONE DEFAULT null,

                CONSTRAINT "UQ_products_uuid" UNIQUE ("uuid"),
                CONSTRAINT "UQ_products_slug" UNIQUE("slug")
            );
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_products_search_vector" ON "products" USING GIN ("search_vector");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_products_search_vector";`);
        await queryRunner.query(`DROP TABLE "products";`);
    }
}
