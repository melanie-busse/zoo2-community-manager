CREATE TABLE `zooinventorycollection` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` INT NOT NULL,
    `collectionRequirementId` INT NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `userid_collectionRequirementId`(`userId`, `collectionRequirementId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
