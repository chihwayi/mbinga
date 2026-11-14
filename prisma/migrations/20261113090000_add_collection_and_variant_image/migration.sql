-- Splits the catalog into two collections (Prestige/Breeze) and lets each
-- size variant carry its own bottle photo, so the product page can swap the
-- image when the customer picks a different size. Existing products default
-- to "prestige" (the already-advertised range); existing variants keep
-- image NULL and fall back to the product's primary image.
ALTER TABLE "Product" ADD COLUMN "collection" TEXT NOT NULL DEFAULT 'prestige';
ALTER TABLE "ProductVariant" ADD COLUMN "image" TEXT;
