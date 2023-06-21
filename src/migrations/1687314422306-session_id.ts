import { MigrationInterface, QueryRunner } from "typeorm";

export class SessionId1687314422306 implements MigrationInterface {
    name = 'SessionId1687314422306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id")`);
    }

}
