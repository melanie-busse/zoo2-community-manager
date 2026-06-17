/*
  Warnings:

  - Made the column `originId` on table `animalorigin` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `animalorigin` DROP FOREIGN KEY `animalOrigin_originId_fkey`;

-- AlterTable
ALTER TABLE `animalorigin` MODIFY `originId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `contest` MODIFY `active` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `animalorigin` ADD CONSTRAINT `animalOrigin_originId_fkey` FOREIGN KEY (`originId`) REFERENCES `origin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
