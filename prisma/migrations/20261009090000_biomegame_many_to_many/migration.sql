-- Create join table for Biome <-> BiomeGame many-to-many
CREATE TABLE IF NOT EXISTS `_BiomeToGame` (
  `biomeId` INT NOT NULL,
  `gameId`  INT NOT NULL,
  PRIMARY KEY (`biomeId`, `gameId`),
  CONSTRAINT `fk_btg_biome` FOREIGN KEY (`biomeId`) REFERENCES `biome`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_btg_game`  FOREIGN KEY (`gameId`)  REFERENCES `biomegame`(`id`) ON DELETE CASCADE
);

-- Migrate existing biomeId data to join table
INSERT IGNORE INTO `_BiomeToGame` (`biomeId`, `gameId`)
SELECT `biomeId`, `id` FROM `biomegame` WHERE `biomeId` IS NOT NULL;

-- Drop biomeId from biomegame
ALTER TABLE `biomegame` DROP FOREIGN KEY `biomegame_biomeId_fkey`;
ALTER TABLE `biomegame` DROP INDEX `biomegame_biomeId_idx`;
ALTER TABLE `biomegame` DROP COLUMN `biomeId`;
