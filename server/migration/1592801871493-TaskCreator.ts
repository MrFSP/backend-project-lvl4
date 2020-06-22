import {MigrationInterface, QueryRunner} from "typeorm";

export class TaskCreator1592801871493 implements MigrationInterface {
    name = 'TaskCreator1592801871493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" RENAME COLUMN "creator" TO "creatorId"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "creatorId"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "creatorId" integer`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "UQ_94fe6b3a5aec5f85427df4f8cd7" UNIQUE ("creatorId")`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_94fe6b3a5aec5f85427df4f8cd7" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_94fe6b3a5aec5f85427df4f8cd7"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "UQ_94fe6b3a5aec5f85427df4f8cd7"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "creatorId"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "creatorId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" RENAME COLUMN "creatorId" TO "creator"`);
    }

}
