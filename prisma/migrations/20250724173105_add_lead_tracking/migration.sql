-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isLead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leadSource" TEXT;
