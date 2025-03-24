-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `paymentId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `PaymentStatus_isPaid_fkey` ON `OrderItem`(`paymentId`);

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `PaymentStatus_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`paymentId`) ON DELETE CASCADE ON UPDATE CASCADE;
