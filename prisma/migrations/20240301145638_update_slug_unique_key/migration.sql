/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Establishment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Establishment_slug_key" ON "Establishment"("slug");
