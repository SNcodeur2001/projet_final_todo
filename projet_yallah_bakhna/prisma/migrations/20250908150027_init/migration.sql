-- CreateTable
CREATE TABLE `Tache` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` ENUM('EN_ATTENTE', 'EN_COURS', 'TERMINE') NOT NULL DEFAULT 'EN_ATTENTE',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
