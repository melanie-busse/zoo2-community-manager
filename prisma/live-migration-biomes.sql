-- =============================================================================
-- Live-Server Migration: feature/biomes
-- Reihenfolge: 1-6 in einem Schritt ausführen
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. animal_shelter_relation
--    shelterId hinzufügen, shelterLevel entfernen
-- -----------------------------------------------------------------------------
ALTER TABLE `animal` ADD COLUMN IF NOT EXISTS `shelterId` INT NULL;
ALTER TABLE `animal` DROP COLUMN IF EXISTS `shelterLevel`;

-- Index und FK nur hinzufügen wenn noch nicht vorhanden
SET @exist_idx := (SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE table_schema = DATABASE() AND table_name = 'animal' AND index_name = 'animal_shelterId_fkey');
SET @sql := IF(@exist_idx = 0,
  'ALTER TABLE `animal` ADD INDEX `animal_shelterId_fkey` (`shelterId`)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exist_fk := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE table_schema = DATABASE() AND table_name = 'animal' AND constraint_name = 'animal_shelterId_fkey');
SET @sql := IF(@exist_fk = 0,
  'ALTER TABLE `animal` ADD CONSTRAINT `animal_shelterId_fkey` FOREIGN KEY (`shelterId`) REFERENCES `biomeshelter`(`id`) ON DELETE SET NULL ON UPDATE CASCADE',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- -----------------------------------------------------------------------------
-- 2. add_repairpricetype_to_biomegame
-- -----------------------------------------------------------------------------
ALTER TABLE `biomegame`
  ADD COLUMN IF NOT EXISTS `repairpricetype` INT NOT NULL DEFAULT 1;

-- -----------------------------------------------------------------------------
-- 3. remove_repair_from_biometrough
-- -----------------------------------------------------------------------------
ALTER TABLE `biometrough` DROP COLUMN IF EXISTS `repair`;

-- -----------------------------------------------------------------------------
-- 4. biomegame_many_to_many
--    Join-Tabelle anlegen, Daten migrieren, biomeId entfernen
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `_BiomeToGame` (
  `A` INT NOT NULL,
  `B` INT NOT NULL,
  PRIMARY KEY (`A`, `B`),
  KEY `_BiomeToGame_B_index` (`B`),
  CONSTRAINT `_BiomeToGame_A_fkey` FOREIGN KEY (`A`) REFERENCES `biome`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_BiomeToGame_B_fkey` FOREIGN KEY (`B`) REFERENCES `biomegame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT IGNORE INTO `_BiomeToGame` (`A`, `B`)
  SELECT `biomeId`, `id` FROM `biomegame` WHERE `biomeId` IS NOT NULL;

ALTER TABLE `biomegame` DROP FOREIGN KEY IF EXISTS `biomegame_biomeId_fkey`;
ALTER TABLE `biomegame` DROP INDEX IF EXISTS `biomegame_biomeId_idx`;
ALTER TABLE `biomegame` DROP COLUMN IF EXISTS `biomeId`;

-- -----------------------------------------------------------------------------
-- 5. add_repairpricetype_to_biomewaterhole
-- -----------------------------------------------------------------------------
ALTER TABLE `biomewaterhole`
  ADD COLUMN IF NOT EXISTS `repairpricetype` INT NOT NULL DEFAULT 1;

-- -----------------------------------------------------------------------------
-- 6. add_biomeidentifier_to_biomegame
-- -----------------------------------------------------------------------------
ALTER TABLE `biomegame`
  ADD COLUMN IF NOT EXISTS `biomeIdentifier` VARCHAR(255) NOT NULL DEFAULT '';

-- -----------------------------------------------------------------------------
-- 7. biomeIdentifier befüllen (aus Bild-Ordner-Struktur abgeleitet)
--    Spiele mit gleichem identifier werden nach ID-Reihenfolge dem Biom zugeordnet
-- -----------------------------------------------------------------------------
UPDATE `biomegame` g
JOIN `_BiomeToGame` j ON j.B = g.id
JOIN `biome` b ON b.id = j.A
SET g.`biomeIdentifier` = b.`identifier`
WHERE g.`biomeIdentifier` = '';
