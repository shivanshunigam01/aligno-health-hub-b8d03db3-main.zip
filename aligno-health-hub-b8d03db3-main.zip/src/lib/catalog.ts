import { categoryService, painAreaService, productService, bodyPartService } from "./store";
import { enrichBodyParts, enrichPainAreas } from "./taxonomyImages";
import { enrichProducts } from "./productImages";
import type { BodyPart, Category, PainArea, Product } from "./types";

type HighlightKind = "bestSeller" | "featured" | "newArrival";

function varietyKey(product: Product) {
  return product.painArea?.replace(/-pain$/, "") || product.bodyPart || product.slug;
}

/** Pick homepage highlights with one product per pain/body area and unique images when possible. */
export function pickHighlightedProducts(products: Product[], kind: HighlightKind, limit = 8): Product[] {
  const pool = products.filter((product) => product[kind]);
  const picked: Product[] = [];
  const usedKeys = new Set<string>();
  const usedImages = new Set<string>();

  const add = (product: Product, strict: boolean) => {
    if (picked.some((item) => item.id === product.id)) return false;
    const key = varietyKey(product);
    const image = product.images[0] || "";
    if (strict) {
      if (key && usedKeys.has(key)) return false;
      if (image && usedImages.has(image)) return false;
    }
    picked.push(product);
    if (key) usedKeys.add(key);
    if (image) usedImages.add(image);
    return true;
  };

  for (const product of pool) {
    add(product, true);
    if (picked.length >= limit) return picked;
  }
  for (const product of pool) {
    add(product, false);
    if (picked.length >= limit) return picked;
  }

  return picked.slice(0, limit);
}

export function getEnabledCategories(): Category[] {
  return categoryService.list().filter((c) => c.enabled).sort((a, b) => a.order - b.order);
}

export function getEnabledCategorySlugs(): Set<string> {
  return new Set(getEnabledCategories().map((c) => c.slug));
}

/** Products in enabled categories that are not disabled — shown on the storefront. */
export function getVisibleProducts(): Product[] {
  const slugs = getEnabledCategorySlugs();
  return enrichProducts(productService.list().filter((p) => p.enabled !== false && slugs.has(p.category)));
}

/** All products in enabled categories — used in admin (includes disabled products). */
export function getCatalogProducts(): Product[] {
  const slugs = getEnabledCategorySlugs();
  return productService.list().filter((p) => slugs.has(p.category));
}

export function getBodyParts(): BodyPart[] {
  return enrichBodyParts(bodyPartService.list());
}

export function getPainAreas(): PainArea[] {
  return enrichPainAreas(painAreaService.list(), getBodyParts(), getVisibleProducts());
}
