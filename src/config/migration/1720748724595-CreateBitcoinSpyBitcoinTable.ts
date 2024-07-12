import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBitcoinSpyBitcoinTable1720748724595
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                CREATE TABLE bitcoin_price (
                    id SERIAL PRIMARY KEY,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    purchase_price FLOAT NOT NULL,
                    sell_price FLOAT NOT NULL
                );
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bitcoin_price"`);
  }
}
