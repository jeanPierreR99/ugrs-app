-- AlterTable
ALTER TABLE `vehicles` ADD COLUMN `activeRouteId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `vehicles_activeRouteId_idx` ON `vehicles`(`activeRouteId`);

-- AddForeignKey
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_activeRouteId_fkey` FOREIGN KEY (`activeRouteId`) REFERENCES `routes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
