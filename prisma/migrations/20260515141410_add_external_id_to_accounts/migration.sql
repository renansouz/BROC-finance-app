/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `FinancialAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FinancialAccount" ADD COLUMN     "externalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "FinancialAccount_externalId_key" ON "FinancialAccount"("externalId");
