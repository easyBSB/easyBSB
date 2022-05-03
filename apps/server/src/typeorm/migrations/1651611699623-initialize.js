const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class initialize1651611699623 {
    name = 'initialize1651611699623'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "easy_bsb_connection" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "ip" varchar NOT NULL, "port" integer NOT NULL, "hostId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "password" varchar NOT NULL, "userNeedPasswordChange" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_3fe76ecf0f0ef036ff981e9f67d" UNIQUE ("name"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "easy_bsb_connection"`);
    }
}
