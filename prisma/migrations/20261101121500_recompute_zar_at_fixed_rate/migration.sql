-- Existing variants had priceZar backfilled at the old provisional 18.5
-- rate (see 20261027090000_split_variant_price_currency). The client has
-- now fixed the rate at $1 = R17, so recompute every stored priceZar from
-- its priceUsd to match.
UPDATE "ProductVariant" SET "priceZar" = ROUND("priceUsd" * 17, 2);
