/*
  Warnings:

  - You are about to drop the column `syncMethod` on the `UserSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."UserSettings" DROP COLUMN "syncMethod",
ADD COLUMN     "syncMethods" TEXT DEFAULT 'MANUAL',
ALTER COLUMN "activeBanks" SET DEFAULT '';
