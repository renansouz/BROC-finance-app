-- CreateTable
CREATE TABLE "DescriptionRule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "originalText" TEXT NOT NULL,
    "cleanedText" TEXT NOT NULL,

    CONSTRAINT "DescriptionRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DescriptionRule_userId_originalText_key" ON "DescriptionRule"("userId", "originalText");

-- AddForeignKey
ALTER TABLE "DescriptionRule" ADD CONSTRAINT "DescriptionRule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
