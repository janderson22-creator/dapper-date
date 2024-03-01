/*
  Warnings:

  - Added the required column `slug` to the `Establishment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Establishment" ADD COLUMN     "slug" TEXT NOT NULL;
