import { ASSETS } from "./assets";
import { seedBodyParts, seedPainAreas } from "./seed";
import type { BodyPart, PainArea, Product } from "./types";

const BODY_IMAGE_BY_SLUG: Record<string, string> = {
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
  face: ASSETS.body.face,
  elbow: ASSETS.body.hand,
};

function productImageByPainSlug(products: Product[]) {
  const map = new Map<string, string>();
  for (const product of products) {
    const slug = product.painArea?.replace(/-pain$/, "");
    if (!slug || !product.images[0] || map.has(slug)) continue;
    map.set(slug, product.images[0]);
  }
  return map;
}

function resolveImage(
  slug: string,
  image: string | undefined,
  bodyBySlug: Map<string, string>,
  productBySlug: Map<string, string>,
  seedImage?: string,
) {
  return image || bodyBySlug.get(slug) || productBySlug.get(slug) || seedImage || BODY_IMAGE_BY_SLUG[slug] || "";
}

export function enrichBodyParts(bodyParts: BodyPart[], seed: BodyPart[] = seedBodyParts): BodyPart[] {
  const seedBySlug = new Map(seed.map((item) => [item.slug, item]));
  const source = bodyParts.length > 0 ? bodyParts : seed;

  return source.map((part) => {
    const fallback = seedBySlug.get(part.slug);
    return {
      ...part,
      name: part.name || fallback?.name || part.slug,
      image: resolveImage(part.slug, part.image, new Map(), new Map(), fallback?.image),
      marker: part.marker || fallback?.marker,
    };
  });
}

export function enrichPainAreas(
  painAreas: PainArea[],
  bodyParts: BodyPart[],
  products: Product[],
  seed: PainArea[] = seedPainAreas,
): PainArea[] {
  const seedBySlug = new Map(seed.map((item) => [item.slug, item]));
  const bodyBySlug = new Map(bodyParts.filter((part) => part.image).map((part) => [part.slug, part.image]));
  const productBySlug = productImageByPainSlug(products);
  const source = painAreas.length > 0 ? painAreas : seed;

  return source.map((area) => {
    const fallback = seedBySlug.get(area.slug);
    return {
      ...area,
      name: area.name || fallback?.name || area.slug,
      image: resolveImage(area.slug, area.image, bodyBySlug, productBySlug, fallback?.image),
      marker: area.marker || fallback?.marker,
    };
  });
}
