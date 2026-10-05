-- CreateTable
CREATE TABLE `zooinventoryregion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userid` INTEGER NOT NULL,
    `regionId` INTEGER NOT NULL,
    `owned` BOOLEAN NOT NULL DEFAULT false,
    `breedingCenterSlots` INTEGER NULL,
    `admissionsBoothLevel` INTEGER NULL,
    `adminBuilding` BOOLEAN NOT NULL DEFAULT false,
    `visitorCenter` BOOLEAN NOT NULL DEFAULT false,
    `transportStation` BOOLEAN NOT NULL DEFAULT false,
    `guestLounge` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `zooinventoryregion_userid_regionId_key`(`userid`, `regionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
