-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL,
    "ctaLink" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WebhookLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "eventId" TEXT,
    "orderId" TEXT,
    "status" TEXT,
    "payload" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "signatureValid" BOOLEAN NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "items" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customPaymentId" TEXT,
    "subtotal" REAL,
    "deliveryCost" REAL,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "paidAmount" REAL,
    "paymentMethod" TEXT,
    "fromBank" TEXT,
    "bobpayUuid" TEXT,
    "bobpayShortRef" TEXT,
    "bobpayPaymentId" TEXT,
    "isTest" BOOLEAN NOT NULL DEFAULT false,
    "webhookPayload" TEXT,
    "webhookReceivedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Order" ("address", "amount", "createdAt", "customer", "date", "email", "id", "items", "phone", "status", "updatedAt") SELECT "address", "amount", "createdAt", "customer", "date", "email", "id", "items", "phone", "status", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_customPaymentId_key" ON "Order"("customPaymentId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
