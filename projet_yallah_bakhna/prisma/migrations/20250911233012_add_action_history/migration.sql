-- CreateTable
CREATE TABLE `ActionHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tacheId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `action` ENUM('READ', 'MODIFY', 'DELETE') NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ActionHistory` ADD CONSTRAINT `ActionHistory_tacheId_fkey` FOREIGN KEY (`tacheId`) REFERENCES `Tache`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActionHistory` ADD CONSTRAINT `ActionHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
