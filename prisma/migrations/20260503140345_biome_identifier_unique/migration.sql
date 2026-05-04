/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `biome` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `biome` ALTER COLUMN `identifier` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `biome_identifier_key` ON `biome`(`identifier`);
