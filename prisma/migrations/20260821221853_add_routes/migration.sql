/*
  Warnings:

  - You are about to drop the column `route` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `routePath` on the `vehicles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `vehicles` DROP FOREIGN KEY `vehicles_driverId_fkey`;

-- AlterTable
ALTER TABLE `vehicles` DROP COLUMN `route`,
    DROP COLUMN `routePath`,
    MODIFY `driverId` VARCHAR(191) NULL,
    MODIFY `position` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `routes` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `routePath` JSON NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicle_routes` (
    `id` VARCHAR(191) NOT NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `routeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `vehicle_routes_vehicleId_idx`(`vehicleId`),
    INDEX `vehicle_routes_routeId_idx`(`routeId`),
    UNIQUE INDEX `vehicle_routes_vehicleId_routeId_key`(`vehicleId`, `routeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicle_routes` ADD CONSTRAINT `vehicle_routes_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicle_routes` ADD CONSTRAINT `vehicle_routes_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `routes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
