-- CreateTable
CREATE TABLE `categorys` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `sort` VARCHAR(100) NOT NULL,
    `category_update` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `customer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NULL,
    `address` VARCHAR(255) NULL,
    `phone` VARCHAR(20) NULL,
    `customer_update` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`customer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orderdetail` (
    `order_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `date_detail` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`order_id`, `product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `order_id` INTEGER NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `order_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `order_status` ENUM('processing', 'completed', 'cancelled') NULL,
    `total_amount` DECIMAL(10, 2) NOT NULL,

    INDEX `customer_id`(`customer_id`),
    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `payment_method` VARCHAR(50) NULL,
    `payment_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `amount` DECIMAL(10, 2) NOT NULL,
    `remark` VARCHAR(255) NULL,
    `payment_status` ENUM('pending', 'completed', 'failed') NULL,

    INDEX `order_id`(`order_id`),
    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `product_id` INTEGER NOT NULL,
    `product_name` VARCHAR(100) NOT NULL,
    `product_status` ENUM('sell', 'not sell', 'coming soon') NULL,
    `descriptions` TEXT NULL,
    `num` DECIMAL(10, 2) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `image_url` VARCHAR(255) NULL,
    `category_id` INTEGER NOT NULL,
    `product_update` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `category_id`(`category_id`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `UserName` VARCHAR(100) NOT NULL,
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `Password` VARCHAR(100) NOT NULL,
    `Email` VARCHAR(100) NULL,
    `Status` VARCHAR(100) NULL,
    `Role` VARCHAR(100) NULL,

    UNIQUE INDEX `Users_UNIQUE`(`UserName`),
    UNIQUE INDEX `Email`(`Email`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
