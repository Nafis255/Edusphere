-- CreateTable
CREATE TABLE "MaterialProgress" (
    "id" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,

    CONSTRAINT "MaterialProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MaterialProgress_studentId_materialId_key" ON "MaterialProgress"("studentId", "materialId");

-- AddForeignKey
ALTER TABLE "MaterialProgress" ADD CONSTRAINT "MaterialProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialProgress" ADD CONSTRAINT "MaterialProgress_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
