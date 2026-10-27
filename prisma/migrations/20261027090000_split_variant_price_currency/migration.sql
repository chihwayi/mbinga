-- Split the single USD `price` into independently admin-set `priceUsd` and
-- `priceZar` fields, so SA (Rand) and Zimbabwe (USD) pricing no longer
-- depend on a live exchange-rate conversion.
ALTER TABLE "ProductVariant" RENAME COLUMN "price" TO "priceUsd";
ALTER TABLE "ProductVariant" ADD COLUMN "priceZar" REAL NOT NULL DEFAULT 0;
UPDATE "ProductVariant" SET "priceZar" = ROUND("priceUsd" * 18.5, 2);
