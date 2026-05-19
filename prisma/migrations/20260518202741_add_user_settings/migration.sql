-- CreateTable
CREATE TABLE "public"."UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hasVehicles" BOOLEAN NOT NULL DEFAULT false,
    "hasRealEstate" BOOLEAN NOT NULL DEFAULT false,
    "hasFGTS" BOOLEAN NOT NULL DEFAULT false,
    "hasInvestments" BOOLEAN NOT NULL DEFAULT false,
    "financialGoal" TEXT,
    "isOnboardingComplete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "public"."UserSettings"("userId");

-- AddForeignKey
ALTER TABLE "public"."UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
