/*
  Warnings:

  - You are about to drop the column `customer_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `order_date` on the `orders` table. All the data in the column will be lost.
  - You are about to alter the column `order_status` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(0))`.
  - You are about to drop the column `payment_date` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `remark` on the `payments` table. All the data in the column will be lost.
  - You are about to alter the column `payment_status` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(2))`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `Password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `Role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `Status` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `UserID` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `UserName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `categorys` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orderdetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `payment_method` on table `payments` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `login_method` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `customer_id` ON `orders`;

-- DropIndex
DROP INDEX `Email` ON `users`;

-- DropIndex
DROP INDEX `Users_UNIQUE` ON `users`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `customer_id`,
    DROP COLUMN `order_date`,
    ADD COLUMN `address_id` INTEGER NULL,
    ADD COLUMN `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `shipping_cost` DECIMAL(10, 2) NULL DEFAULT 0.00,
    ADD COLUMN `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `user_id` INTEGER NULL,
    MODIFY `order_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `order_status` ENUM('Pending', 'Processing', 'Completed', 'Cancelled') NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE `payments` DROP COLUMN `payment_date`,
    DROP COLUMN `remark`,
    ADD COLUMN `transaction_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `order_id` INTEGER NULL,
    MODIFY `payment_method` ENUM('QR Code', 'E-Banking', 'Credit Card', 'Cash on Delivery') NOT NULL,
    MODIFY `payment_status` ENUM('Pending', 'Completed', 'Failed') NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    DROP COLUMN `Email`,
    DROP COLUMN `Password`,
    DROP COLUMN `Role`,
    DROP COLUMN `Status`,
    DROP COLUMN `UserID`,
    DROP COLUMN `UserName`,
    ADD COLUMN `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `email` VARCHAR(100) NULL,
    ADD COLUMN `first_name` VARCHAR(50) NOT NULL,
    ADD COLUMN `last_name` VARCHAR(50) NOT NULL,
    ADD COLUMN `login_method` ENUM('email', 'phone') NOT NULL,
    ADD COLUMN `password_hash` VARCHAR(255) NOT NULL,
    ADD COLUMN `phone` VARCHAR(15) NULL,
    ADD COLUMN `role` VARCHAR(50) NOT NULL,
    ADD COLUMN `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`user_id`);

-- DropTable
DROP TABLE `categorys`;

-- DropTable
DROP TABLE `customers`;

-- DropTable
DROP TABLE `orderdetail`;

-- DropTable
DROP TABLE `product`;

-- CreateTable
CREATE TABLE `addresses` (
    `address_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `label` VARCHAR(50) NULL,
    `address_line1` VARCHAR(255) NOT NULL,
    `address_line2` VARCHAR(255) NULL,
    `city` VARCHAR(100) NOT NULL,
    `postal_code` VARCHAR(10) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(15) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`address_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carts` (
    `cart_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`cart_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `order_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NULL,
    `product_id` INTEGER NULL,
    `vendor_id` INTEGER NULL,
    `quantity` INTEGER NOT NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `total_price` DECIMAL(10, 2) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `order_id`(`order_id`),
    INDEX `product_id`(`product_id`),
    INDEX `vendor_id`(`vendor_id`),
    PRIMARY KEY (`order_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_images` (
    `image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `is_main` BOOLEAN NULL DEFAULT false,

    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NULL,
    `vendor_id` INTEGER NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `weight` VARCHAR(50) NULL,
    `stock_status` VARCHAR(50) NULL DEFAULT 'Available',
    `rating` DECIMAL(3, 2) NULL DEFAULT 5.00,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `category_id`(`category_id`),
    INDEX `vendor_id`(`vendor_id`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `review_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `rating` INTEGER NULL,
    `review_text` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `session_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `token` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expires_at` TIMESTAMP(0) NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vendors` (
    `vendor_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `location` VARCHAR(100) NULL,
    `contact_info` VARCHAR(100) NULL,

    PRIMARY KEY (`vendor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `address_id` ON `orders`(`address_id`);

-- CreateIndex
CREATE INDEX `user_id` ON `orders`(`user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `email` ON `users`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `phone` ON `users`(`phone`);

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`address_id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`vendor_id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`vendor_id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
