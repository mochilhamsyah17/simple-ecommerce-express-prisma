/*
  Warnings:

  - You are about to drop the column `paymentPaymentId` on the `orderitem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_paymentPaymentId_fkey`;

-- DropIndex
DROP INDEX `OrderItem_paymentPaymentId_fkey` ON `orderitem`;

-- AlterTable
ALTER TABLE `orderitem` DROP COLUMN `paymentPaymentId`;
