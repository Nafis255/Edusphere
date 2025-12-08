-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "allowRegistration" BOOLEAN NOT NULL DEFAULT true,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);
