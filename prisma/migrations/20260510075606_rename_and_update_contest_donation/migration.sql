/*
  Warnings:

  - You are about to drop the column `puzzlePiece` on the `contestdonation` table. All the data in the column will be lost.
  - Added the required column `count` to the `contestdonation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdat` to the `contestdonation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `contestdonation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contestdonation` DROP COLUMN `puzzlePiece`,
    ADD COLUMN `count` INTEGER NOT NULL,
    ADD COLUMN `createdat` DATETIME(3) NOT NULL,
    ADD COLUMN `level` INTEGER NOT NULL;
