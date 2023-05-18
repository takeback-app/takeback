import { MigrationInterface, QueryRunner } from "typeorm";

export class AddZipCodeTableAndRelation1651067929676
  implements MigrationInterface
{
  name = "AddZipCodeTableAndRelation1651067929676";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."city" RENAME COLUMN "zipCode" TO "ibgeCode"`
    );
    await queryRunner.query(
      `CREATE TABLE "zip_codes" ("id" SERIAL NOT NULL, "zipCode" character varying NOT NULL, "citiesId" integer, CONSTRAINT "PK_cbf74d68cd9045c650ed5f9f224" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "zip_codes" ADD CONSTRAINT "FK_bf8ea20ab6fa9761aa69759c349" FOREIGN KEY ("citiesId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "zip_codes" DROP CONSTRAINT "FK_bf8ea20ab6fa9761aa69759c349"`
    );
    await queryRunner.query(`DROP TABLE "zip_codes"`);
    await queryRunner.query(
      `ALTER TABLE "public"."city" RENAME COLUMN "ibgeCode" TO "zipCode"`
    );
  }
}
