/*
  Warnings:

  - A unique constraint covering the columns `[login]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `TachePermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tacheId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `permission` ENUM('READ_ONLY', 'MODIFY_ONLY', 'FULL_ACCESS') NOT NULL,

    UNIQUE INDEX `TachePermission_tacheId_userId_key`(`tacheId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TacheAttachment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tacheId` INTEGER NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `mimetype` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_login_key` ON `User`(`login`);

-- AddForeignKey
ALTER TABLE `TachePermission` ADD CONSTRAINT `TachePermission_tacheId_fkey` FOREIGN KEY (`tacheId`) REFERENCES `Tache`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TachePermission` ADD CONSTRAINT `TachePermission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TacheAttachment` ADD CONSTRAINT `TacheAttachment_tacheId_fkey` FOREIGN KEY (`tacheId`) REFERENCES `Tache`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
