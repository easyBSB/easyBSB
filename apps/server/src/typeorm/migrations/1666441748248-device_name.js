const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class deviceName1666441748248 {
    name = 'deviceName1666441748248'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "temporary_device" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bus_id" integer NOT NULL, "address" numeric NOT NULL, "vendor" integer NOT NULL, "vendor_device" numeric, "name")`);
        await queryRunner.query(`INSERT INTO "temporary_device"("id", "bus_id", "address", "vendor", "vendor_device") SELECT "id", "bus_id", "address", "vendor", "vendor_device" FROM "device"`);
        await queryRunner.query(`DROP TABLE "device"`);
        await queryRunner.query(`ALTER TABLE "temporary_device" RENAME TO "device"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "device" RENAME TO "temporary_device"`);
        await queryRunner.query(`CREATE TABLE "device" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bus_id" integer NOT NULL, "address" numeric NOT NULL, "vendor" integer NOT NULL, "vendor_device" numeric)`);
        await queryRunner.query(`INSERT INTO "device"("id", "bus_id", "address", "vendor", "vendor_device") SELECT "id", "bus_id", "address", "vendor", "vendor_device" FROM "temporary_device"`);
        await queryRunner.query(`DROP TABLE "temporary_device"`);
    }
}
