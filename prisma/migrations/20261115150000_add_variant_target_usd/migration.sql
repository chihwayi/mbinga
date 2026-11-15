-- Separates the admin's raw/target USD price from the final protected
-- prices shown to customers, so repeated recalculation (after the live rate
-- or margin changes) always derives from a stable anchor instead of
-- compounding the markup on top of a previously-marked-up value.
ALTER TABLE "ProductVariant" ADD COLUMN "targetUsd" REAL NOT NULL DEFAULT 0;
UPDATE "ProductVariant" SET "targetUsd" = "priceUsd";
