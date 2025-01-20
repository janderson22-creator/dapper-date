/*
  Warnings:

  - You are about to drop the column `serviceDuration` on the `Establishment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Establishment" DROP COLUMN "serviceDuration",
ADD COLUMN     "averageTimeService" INTEGER NOT NULL DEFAULT 30;
