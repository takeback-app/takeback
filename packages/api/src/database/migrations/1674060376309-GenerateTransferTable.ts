import {MigrationInterface, QueryRunner} from "typeorm";

export class GenerateTransferTable1674060376309 implements MigrationInterface {
    name = 'GenerateTransferTable1674060376309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transfers" ("id" SERIAL NOT NULL, "value" numeric(10,4) DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "consumerSentId" uuid, "consumerReceivedId" uuid, CONSTRAINT "PK_f712e908b465e0085b4408cabc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_5851405b43ff491630a25ccede6" FOREIGN KEY ("consumerSentId") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_ae8fb79e0f4f1ce081e6dde6ed1" FOREIGN KEY ("consumerReceivedId") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_ae8fb79e0f4f1ce081e6dde6ed1"`);
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_5851405b43ff491630a25ccede6"`);
        await queryRunner.query(`DROP TABLE "transfers"`);
    }

}
