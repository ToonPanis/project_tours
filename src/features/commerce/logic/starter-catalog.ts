/**
 * The catalogue a new database starts with: the walks that exist today, at the
 * provisional prices from the commercial brief, all per person (decision B3).
 * Every product starts INACTIVE and without a VAT rate: the admin activates it
 * once the accountant has decided the rate (B8) and the content is ready.
 *
 * Dark Antwerp and The Rubens Code are not here: they have no content yet.
 * Once created, products and prices are managed in /admin/products; this list
 * is only used for products that don't exist yet.
 */
export const STARTER_PRODUCTS = [
  { id: "classics-of-antwerp", walkSlug: "classics-of-antwerp", name: "Classics of Antwerp", priceCents: 795 },
  // Decision B2: "17 Gates" is the product name of the Poortjes van Antwerpen walk.
  { id: "poortjes-van-antwerpen", walkSlug: "poortjes-van-antwerpen", name: "17 Gates", priceCents: 995 },
  { id: "hidden-pubs", walkSlug: "hidden-pubs", name: "Hidden Pubs", priceCents: 1495 },
] as const;
