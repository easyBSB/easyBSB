import { MigrationInterface, QueryRunner } from "typeorm";

export class setup1650828104095 implements MigrationInterface {
    name = 'setup1650828104095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "easy_bsb_connection" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "ip" varchar NOT NULL, "port" integer NOT NULL, "hostId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "easy_bsb_device" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "deviceId" integer NOT NULL, "family" integer NOT NULL, "name" varchar NOT NULL, "variant" integer NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "easy_bsb_device"`);
        await queryRunner.query(`DROP TABLE "easy_bsb_connection"`);
    }

}
