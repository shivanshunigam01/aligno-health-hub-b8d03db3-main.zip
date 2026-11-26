import { ASSETS } from "./assets";
import { seedProducts } from "./seed";
import type { Product } from "./types";

const SEED_BY_SLUG = new Map(seedProducts.map((product) => [product.slug, product]));

const BODY_FALLBACK: Record<string, string> = {
  knee: ASSETS.body.knee,
  back: ASSETS.body.back,
  neck: ASSETS.body.neck,
  shoulder: ASSETS.body.shoulder,
  wrist: ASSETS.body.wrist,
  hand: ASSETS.body.hand,
  foot: ASSETS.body.foot,
  ankle: ASSETS.body.ankle,
  calf: ASSETS.body.calf,
  chest: ASSETS.body.chest,
  elbow: ASSETS.body.wrist,
};

/** Local packshots copied from the Aligno catalog (public/img/products/). */
const CATALOG_IMAGES: Record<string, string> = {
  "abdominal-support": "/img/products/abdominal-support.png",
  "ankle-support": "/img/products/ankle-support.png",
  "cervical-collar": "/img/products/cervical-collar.png",
  "contoured-ls-support-belt": "/img/products/contoured-ls-support-belt.png",
  "elbow-support": "/img/products/elbow-support.png",
  "functional-knee-support": "/img/products/functional-knee-support.png",
  "knee-support": "/img/products/knee-support.png",
  "ls-belt-eco": "/img/products/ls-belt-eco.png",
  "lumbar-sacral-support-belt": "/img/products/lumbar-sacral-support-belt.png",
  "pouch-arm-sling": "/img/products/pouch-arm-sling.png",
  "tennis-elbow-support": "/img/products/tennis-elbow-support.png",
  "wrist-wrap": "/img/products/wrist-wrap.png",
  "wrist-wrap-with-thumb": "/img/products/wrist-wrap-with-thumb.png",
};

const LIFESTYLE_BY_ACTIVITY: Record<string, string> = {
  athletics: ASSETS.lifestyle.running,
  badminton: ASSETS.lifestyle.active,
  basketball: ASSETS.lifestyle.running,
  cricket: ASSETS.lifestyle.active,
  yoga: ASSETS.lifestyle.yoga,
  gym: ASSETS.lifestyle.running,
  running: ASSETS.lifestyle.running,
  walking: ASSETS.lifestyle.walking,
  travel: ASSETS.lifestyle.travel,
  office: ASSETS.lifestyle.office,
};

function fallbackPrimary(product: Product): string {
  const catalog = CATALOG_IMAGES[product.slug];
  if (catalog) return catalog;

  const seed = SEED_BY_SLUG.get(product.slug);
  const seedImg = seed?.images.find(Boolean);
  if (seedImg) return seedImg;

  const body = product.bodyPart && BODY_FALLBACK[product.bodyPart];
  if (body) return body;

  const pain = product.painArea?.replace(/-pain$/, "");
  if (pain && BODY_FALLBACK[pain]) return BODY_FALLBACK[pain];

  return ASSETS.products.posture;
}

/** Ensure each product has up to three distinct gallery images for cards and PDP. */
function buildThreeImages(product: Product): string[] {
  const primary = CATALOG_IMAGES[product.slug];
  const body = product.bodyPart ? BODY_FALLBACK[product.bodyPart] : undefined;
  const painKey = product.painArea?.replace(/-pain$/, "");
  const pain = painKey ? BODY_FALLBACK[painKey] : undefined;
  const activityKey = product.activity?.[0];
  const lifestyle = activityKey ? LIFESTYLE_BY_ACTIVITY[activityKey] : ASSETS.lifestyle.active;

  const ordered = [
    primary,
    ...product.images.filter(Boolean),
    body,
    pain,
    lifestyle,
    ASSETS.products.posture,
    ASSETS.lifestyle.lumbo,
  ];

  const unique: string[] = [];
  for (const src of ordered) {
    if (src && !unique.includes(src)) unique.push(src);
    if (unique.length >= 3) break;
  }

  const base = unique.length ? unique[0] : fallbackPrimary(product);
  while (unique.length < 3) {
    const filler = unique[unique.length - 1] ?? base;
    unique.push(filler);
  }

  return unique.slice(0, 3);
}

export function enrichProduct(product: Product): Product {
  return {
    ...product,
    images: buildThreeImages(product),
  };
}

export function enrichProducts(products: Product[]): Product[] {
  return products.map(enrichProduct);
}
