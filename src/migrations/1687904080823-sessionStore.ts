import { MigrationInterface, QueryRunner } from "typeorm";

export class SessionStore1687904080823 implements MigrationInterface {
    name = 'SessionStore1687904080823'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "data"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "expiredAt" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD "json" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD "destroyedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "id" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id")`);
        await queryRunner.query(`CREATE INDEX "IDX_28c5d1d16da7908c97c9bc2f74" ON "session" ("expiredAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_28c5d1d16da7908c97c9bc2f74"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "destroyedAt"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "json"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "expiredAt"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "data" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD "expiresAt" integer NOT NULL`);
    }

}
