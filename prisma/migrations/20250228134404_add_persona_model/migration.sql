/*
  Warnings:

  - You are about to drop the column `personaId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "personaId",
ADD COLUMN     "activePersonaId" TEXT;

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "initialAge" INTEGER NOT NULL,
    "currentAge" INTEGER NOT NULL,
    "currentIncome" DOUBLE PRECISION NOT NULL,
    "currentIncomeFromWealth" DOUBLE PRECISION NOT NULL,
    "savingsRate" DOUBLE PRECISION NOT NULL,
    "inheritanceAge" INTEGER,
    "inheritanceAmount" DOUBLE PRECISION NOT NULL,
    "inheritanceTaxClass" INTEGER NOT NULL,
    "vatRate" DOUBLE PRECISION NOT NULL,
    "vatApplicableRate" DOUBLE PRECISION NOT NULL,
    "yearlySpendingFromWealth" DOUBLE PRECISION NOT NULL,
    "currentWealth" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "yearlyOverridesJson" TEXT,
    "incomeGrowthType" TEXT NOT NULL DEFAULT 'default',

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
