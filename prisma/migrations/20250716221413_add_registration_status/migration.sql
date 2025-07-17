-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING_PAYMENT', 'COMPLETED', 'ABANDONED');

-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING_PAYMENT';
