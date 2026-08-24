/*
  Warnings:

  - You are about to drop the column `driverId` on the `vehicles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `vehicles` DROP FOREIGN KEY `vehicles_driverId_fkey`;

-- DropIndex
DROP INDEX `vehicles_driverId_idx` ON `vehicles`;

-- AlterTable
ALTER TABLE `vehicles` DROP COLUMN `driverId`;

-- CreateTable
CREATE TABLE `vehicle_drivers` (
    `id` VARCHAR(191) NOT NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `driverId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `vehicle_drivers_vehicleId_idx`(`vehicleId`),
    INDEX `vehicle_drivers_driverId_idx`(`driverId`),
    UNIQUE INDEX `vehicle_drivers_vehicleId_driverId_key`(`vehicleId`, `driverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `vehicle_drivers` ADD CONSTRAINT `vehicle_drivers_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicle_drivers` ADD CONSTRAINT `vehicle_drivers_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
