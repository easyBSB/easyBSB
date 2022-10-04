const { hashSync } = require("bcryptjs");
const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class init1664908605366 {
    name = 'init1664908605366'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "easy_bsb_connection" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "ip" varchar NOT NULL, "port" integer NOT NULL, "hostId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "device" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bus_id" integer NOT NULL, "address" numeric NOT NULL, "vendor" integer NOT NULL, "vendor_device" numeric)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "needPasswordChange" boolean NOT NULL, "password" varchar NOT NULL, "role" varchar CHECK( "role" IN ('require_password_change','read','write','admin') ) NOT NULL DEFAULT ('read'), CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "bus" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "address" numeric NOT NULL, "ip_serial" varchar NOT NULL, "name" varchar NOT NULL, "type" varchar NOT NULL, "port" numeric)`);

        const name = "easybsb";
        const password = hashSync("easybsb", 10);
        const role = "admin";
        await queryRunner.query(
          `INSERT INTO user (name, password, needPasswordChange, role) VALUES("${name}", "${password}", true, "${role}")`
        );
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "bus"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "device"`);
        await queryRunner.query(`DROP TABLE "easy_bsb_connection"`);
    }
}
