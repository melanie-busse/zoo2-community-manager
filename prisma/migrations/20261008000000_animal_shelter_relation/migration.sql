-- Drop shelterLevel column from animal table (replaced by shelterId → BiomeShelter.level)
ALTER TABLE `animal` DROP COLUMN `shelterLevel`;

-- Add foreign key index for shelterId
ALTER TABLE `animal` ADD INDEX `animal_shelterId_fkey` (`shelterId`);

-- Add foreign key constraint
ALTER TABLE `animal` ADD CONSTRAINT `animal_shelterId_fkey` FOREIGN KEY (`shelterId`) REFERENCES `biomeshelter`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
