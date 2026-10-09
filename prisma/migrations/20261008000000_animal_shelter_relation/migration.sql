-- Add shelterId column (if not already present — was added directly on the dev DB)
ALTER TABLE `animal` ADD COLUMN IF NOT EXISTS `shelterId` INT NULL;

-- Drop shelterLevel column from animal table (replaced by shelterId → BiomeShelter.level)
ALTER TABLE `animal` DROP COLUMN IF EXISTS `shelterLevel`;

-- Add foreign key index for shelterId (ignore if already exists)
ALTER TABLE `animal` ADD INDEX IF NOT EXISTS `animal_shelterId_fkey` (`shelterId`);

-- Add foreign key constraint (ignore if already exists)
ALTER TABLE `animal` ADD CONSTRAINT IF NOT EXISTS `animal_shelterId_fkey` FOREIGN KEY (`shelterId`) REFERENCES `biomeshelter`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
