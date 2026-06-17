/*
  Warnings:

  - You are about to drop the column `createdat` on the `contestdonation` table. All the data in the column will be lost.
  - Added the required column `createdAt` to the `contestdonation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contestdonation` DROP COLUMN `createdat`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL;
