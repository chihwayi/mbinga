// Turns a product name (or a manually-typed slug) into a clean, URL-safe
// slug — lowercase, hyphenated, no stray whitespace or punctuation. Applied
// both live in the admin form and again server-side on save, so a product
// can never end up with a slug like "Velvet Empire" (literal name, spaces
// and capitals) that breaks its own product page link.
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip combining accents (é -> e)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
