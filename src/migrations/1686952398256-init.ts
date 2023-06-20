import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1686952398256 implements MigrationInterface {
    name = 'Init1686952398256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post" ("uri" varchar PRIMARY KEY NOT NULL, "cid" varchar NOT NULL, "author" varchar NOT NULL, "replyParent" varchar, "replyRoot" varchar, "indexedAt" timestamp NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "sub_state" ("service" varchar PRIMARY KEY NOT NULL, "cursor" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "subscriber" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "did" varchar NOT NULL, "indexedAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, "lastUpdated" timestamp NOT NULL DEFAULT (), "expiresAt" date)`);
        await queryRunner.query(`CREATE TABLE "session" ("id" varchar PRIMARY KEY NOT NULL, "expiresAt" integer NOT NULL, "data" varchar NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "subscriber"`);
        await queryRunner.query(`DROP TABLE "sub_state"`);
        await queryRunner.query(`DROP TABLE "post"`);
    }

}
