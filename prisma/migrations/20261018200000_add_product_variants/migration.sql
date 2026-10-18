-- Create ProductVariant table
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "sizeMl" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Backfill one 100ml variant per existing product using its current price/stock
INSERT INTO "ProductVariant" ("id", "productId", "sizeMl", "price", "stock", "createdAt")
SELECT lower(hex(randomblob(16))), "id", 100, "price", "stock", CURRENT_TIMESTAMP
FROM "Product";

-- Drop the now-superseded single price/stock columns from Product
ALTER TABLE "Product" DROP COLUMN "price";
ALTER TABLE "Product" DROP COLUMN "stock";
