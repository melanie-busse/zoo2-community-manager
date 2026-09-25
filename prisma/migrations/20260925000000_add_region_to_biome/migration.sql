-- Add regionId column to biome table
ALTER TABLE `biome` ADD COLUMN `regionId` INTEGER NULL;
ALTER TABLE `biome` ADD INDEX `biome_regionId_fkey` (`regionId`);

-- Map biomes to regions by identifier
UPDATE `biome` SET `regionId` = (SELECT `id` FROM `region` WHERE `identifier` = 'MainZoo'       LIMIT 1) WHERE `identifier` = 'grassland';
UPDATE `biome` SET `regionId` = (SELECT `id` FROM `region` WHERE `identifier` = 'FirGrove'      LIMIT 1) WHERE `identifier` = 'forest';
UPDATE `biome` SET `regionId` = (SELECT `id` FROM `region` WHERE `identifier` = 'KujaliPark'    LIMIT 1) WHERE `identifier` = 'plains';
UPDATE `biome` SET `regionId` = (SELECT `id` FROM `region` WHERE `identifier` = 'KujaliPark'    LIMIT 1) WHERE `identifier` = 'savanna';
UPDATE `biome` SET `regionId` = (SELECT `id` FROM `region` WHERE `identifier` = 'RainforestPark' LIMIT 1) WHERE `identifier` = 'jungle';
UPDATE `biome` SET `regionId` = (SELECT `id` FROM `region` WHERE `identifier` = 'PolarPark'     LIMIT 1) WHERE `identifier` = 'ice';
UPDATE `biome` SET `regionId` = (SELECT `id` FROM `region` WHERE `identifier` = 'OceansideZoo'  LIMIT 1) WHERE `identifier` = 'water';
UPDATE `biome` SET `regionId` = (SELECT `id` FROM `region` WHERE `identifier` = 'Terrarium'     LIMIT 1) WHERE `identifier` = 'leafy_thicket';
UPDATE `biome` SET `regionId` = (SELECT `id` FROM `region` WHERE `identifier` = 'Terrarium'     LIMIT 1) WHERE `identifier` = 'rocky_desert';
UPDATE `biome` SET `regionId` = (SELECT `id` FROM `region` WHERE `identifier` = 'Aquarium'      LIMIT 1) WHERE `identifier` = 'freshwater';
UPDATE `biome` SET `regionId` = (SELECT `id` FROM `region` WHERE `identifier` = 'Aquarium'      LIMIT 1) WHERE `identifier` = 'saltwater';
UPDATE `biome` SET `regionId` = (SELECT `id` FROM `region` WHERE `identifier` = 'NocturnalHouse' LIMIT 1) WHERE `identifier` = 'nocturnal';
UPDATE `biome` SET `regionId` = (SELECT `id` FROM `region` WHERE `identifier` = 'Aviary'        LIMIT 1) WHERE `identifier` = 'aviary';
-- mountain bleibt NULL (keine Region)

-- Add foreign key constraint
ALTER TABLE `biome` ADD CONSTRAINT `biome_regionId_fkey`
  FOREIGN KEY (`regionId`) REFERENCES `region`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;