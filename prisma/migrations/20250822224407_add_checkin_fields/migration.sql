/*
  Warnings:

  - A unique constraint covering the columns `[checkInId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "checkInId" INTEGER;

-- AlterTable
ALTER TABLE "PlayerRegistration" ADD COLUMN     "checkedInAt" TIMESTAMP(3),
ADD COLUMN     "checkedOutAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Player_checkInId_key" ON "Player"("checkInId");
