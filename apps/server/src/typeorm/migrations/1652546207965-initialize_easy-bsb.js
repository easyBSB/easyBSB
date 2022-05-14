const { MigrationInterface, QueryRunner } = require("typeorm");
const { hashSync } = require("bcryptjs")

module.exports = class initializeEasyBsb1652546207965 {
    name = 'initializeEasyBsb1652546207965'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "easy_bsb_connection" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "ip" varchar NOT NULL, "port" integer NOT NULL, "hostId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "userNeedPasswordChange" boolean NOT NULL, "password" boolean NOT NULL DEFAULT (0), "userrole" varchar CHECK( "userrole" IN ('require_password_change','read','write','admin') ) NOT NULL DEFAULT ('read'), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`);

        const name = 'easybsb'
        const password = hashSync('easybsb', 10)
        const role = 'admin'
        await queryRunner.query(`INSERT INTO user (username, password, userNeedPasswordChange, userrole) VALUES("${name}", "${password}", true, "${role}")`)
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "easy_bsb_connection"`);
    }
}
