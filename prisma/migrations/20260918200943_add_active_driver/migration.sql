-- AlterTable
ALTER TABLE `vehicles` ADD COLUMN `activeDriverId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `vehicles_activeDriverId_idx` ON `vehicles`(`activeDriverId`);

-- AddForeignKey
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_activeDriverId_fkey` FOREIGN KEY (`activeDriverId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
