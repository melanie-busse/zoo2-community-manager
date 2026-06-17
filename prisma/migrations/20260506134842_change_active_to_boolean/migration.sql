/*
  Warnings:

  - You are about to alter the column `active` on the `contest` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `contest` MODIFY `active` BOOLEAN NULL;
