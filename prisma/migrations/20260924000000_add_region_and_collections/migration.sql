-- Create region table
CREATE TABLE `region` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `price` INTEGER NOT NULL,
    `terrainid` INTEGER NOT NULL,
    `releasedate` DATETIME(3) NOT NULL,
    `unlocklevel` INTEGER NOT NULL,
    `identifier` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create regiontext table
CREATE TABLE `regiontext` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `regionid` INTEGER NOT NULL,
    `languageCode` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `regionText_regionId_idx`(`regionid`),
    CONSTRAINT `regionText_regionId_fkey` FOREIGN KEY (`regionid`) REFERENCES `region`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create collection table
CREATE TABLE `collection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(255) NOT NULL,
    `stars` INTEGER NOT NULL,
    `area` ENUM('MAIN_ZOO', 'TERRARIUM', 'AQUARIUM', 'NOCTARIUM', 'AVIARY') NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `collection_identifier_key`(`identifier`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create collectiontext table
CREATE TABLE `collectiontext` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `collectionId` INTEGER NOT NULL,
    `languageCode` VARCHAR(5) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `collectionText_collectionId_languageCode_key`(`collectionId`, `languageCode`),
    CONSTRAINT `collectionText_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create collectionrequirement table
CREATE TABLE `collectionrequirement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `collectionId` INTEGER NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `type` ENUM('ANIMAL', 'DECORATION') NOT NULL,
    `requiredLevel` INTEGER NULL,
    `itemName` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `collectionRequirement_collectionId_idx`(`collectionId`),
    CONSTRAINT `collectionRequirement_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
