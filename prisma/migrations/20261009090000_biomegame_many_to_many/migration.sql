-- Create join table for Biome <-> BiomeGame many-to-many (Prisma implicit M2M naming)
CREATE TABLE IF NOT EXISTS `_BiomeToGame` (
  `A` INT NOT NULL,
  `B` INT NOT NULL,
  PRIMARY KEY (`A`, `B`),
  KEY `_BiomeToGame_B_index` (`B`),
  CONSTRAINT `_BiomeToGame_A_fkey` FOREIGN KEY (`A`) REFERENCES `biome`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_BiomeToGame_B_fkey` FOREIGN KEY (`B`) REFERENCES `biomegame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Migrate existing biomeId associations into the join table
INSERT IGNORE INTO `_BiomeToGame` (`A`, `B`)
SELECT `biomeId`, `id` FROM `biomegame` WHERE `biomeId` IS NOT NULL;

-- Drop biomeId foreign key, index and column from biomegame
ALTER TABLE `biomegame` DROP FOREIGN KEY `biomegame_biomeId_fkey`;
ALTER TABLE `biomegame` DROP INDEX `biomegame_biomeId_idx`;
ALTER TABLE `biomegame` DROP COLUMN `biomeId`;
