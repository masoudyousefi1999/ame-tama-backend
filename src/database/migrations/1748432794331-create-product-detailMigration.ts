import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductDetailsTableMigration1748432794331 implements MigrationInterface {
    name = 'CreateProductDetailsTableMigration1748432794331';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "product_details" (
                "product_id"    BIGINT PRIMARY KEY REFERENCES "products"(id) ON DELETE CASCADE,
                "series"        TEXT,
                "character"     TEXT,
                "description"   TEXT,
                "specifications" JSONB DEFAULT '{}'::JSONB,
                "search_vector" tsvector GENERATED ALWAYS AS (
                    setweight(to_tsvector('english', coalesce(series, '')), 'A') ||
                    setweight(to_tsvector('english', coalesce(character, '')), 'B') ||
                    setweight(to_tsvector('english', coalesce(description, '')), 'C') ||
                    setweight(to_tsvector('english', coalesce(specifications::text, '')), 'D')
                ) STORED
            );
        `);

        // Optional: create GIN index on search_vector for fast full-text search
        await queryRunner.query(`
            CREATE INDEX product_details_search_vector_idx ON product_details USING GIN (search_vector);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product_details";`);
    }
}
