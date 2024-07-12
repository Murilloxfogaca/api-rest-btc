import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWalletTable1720660135000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "walletbrl" (
            "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            "amount" NUMERIC(10, 2) NOT NULL,
            "status" character varying NOT NULL,
            "user_id" UUID,
            "createdat" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            "updatedat" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "walletbrl"`);
  }
}
