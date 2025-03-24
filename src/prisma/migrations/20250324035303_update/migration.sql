/*
  Warnings:

  - You are about to drop the column `paymentId` on the `orderitem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `PaymentStatus_paymentId_fkey`;

-- DropIndex
DROP INDEX `PaymentStatus_isPaid_fkey` ON `orderitem`;

-- AlterTable
ALTER TABLE `orderitem` DROP COLUMN `paymentId`,
    ADD COLUMN `paymentPaymentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_paymentPaymentId_fkey` FOREIGN KEY (`paymentPaymentId`) REFERENCES `Payment`(`paymentId`) ON DELETE SET NULL ON UPDATE CASCADE;
