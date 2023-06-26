import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFlatlander1687817713564 implements MigrationInterface {
    name = 'AddFlatlander1687817713564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "flatlander" ("id" SERIAL NOT NULL, "did" character varying NOT NULL, "indexedAt" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdated" TIMESTAMP NOT NULL DEFAULT now(), "score" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_b8eb34d0093d0e4eece1a742bc4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id")`);
        await queryRunner.query(`DROP TABLE "flatlander"`);
    }

}
