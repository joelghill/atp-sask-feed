import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1687293679035 implements MigrationInterface {
    name = 'Init1687293679035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post" ("uri" character varying NOT NULL, "cid" character varying NOT NULL, "author" character varying NOT NULL, "replyParent" character varying, "replyRoot" character varying, "indexedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_1e22bc6df324d762462d27ee7dc" PRIMARY KEY ("uri"))`);
        await queryRunner.query(`CREATE TABLE "sub_state" ("service" character varying NOT NULL, "cursor" integer NOT NULL, CONSTRAINT "PK_6e5ac946dacfbf447ee3d3fdb89" PRIMARY KEY ("service"))`);
        await queryRunner.query(`CREATE TABLE "subscriber" ("id" SERIAL NOT NULL, "did" character varying NOT NULL, "indexedAt" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdated" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" date, CONSTRAINT "PK_1c52b7ddbaf79cd2650045b79c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session" ("id" character varying NOT NULL, "expiresAt" integer NOT NULL, "data" character varying NOT NULL, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "subscriber"`);
        await queryRunner.query(`DROP TABLE "sub_state"`);
        await queryRunner.query(`DROP TABLE "post"`);
    }

}
