const { MigrationInterface, QueryRunner } = require("typeorm");
const { hashSync } = require("bcryptjs");

module.exports = class initializeEasyBsb1652577410739 {
  name = "initializeEasyBsb1652577410739";

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "easy_bsb_connection" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "ip" varchar NOT NULL, "port" integer NOT NULL, "hostId" integer NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "needPasswordChange" boolean NOT NULL, "password" varchar NOT NULL, "role" varchar CHECK( "role" IN ('require_password_change','read','write','admin') ) NOT NULL DEFAULT ('read'), CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"))`
    );

    const name = "easybsb";
    const password = hashSync("easybsb", 10);
    const role = "admin";
    await queryRunner.query(
      `INSERT INTO user (name, password, needPasswordChange, role) VALUES("${name}", "${password}", true, "${role}")`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "easy_bsb_connection"`);
  }
};
