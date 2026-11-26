import { ASSETS } from "./assets";
import { HERO_CLOUDINARY_URLS } from "./heroCloudinary.generated";
import { seedBanners } from "./seed";
import type { Banner } from "./types";

const HERO_DEFAULT_IMAGES = Object.values(ASSETS.hero);

function applyCloudinaryHeroImages(banners: Banner[]): Banner[] {
  if (HERO_CLOUDINARY_URLS.length === 0) return banners;

  const seedTemplates = seedBanners.filter((b) => b.enabled !== false).sort((a, b) => a.order - b.order);
  const apiTemplates = banners.filter((b) => b.enabled !== false).sort((a, b) => a.order - b.order);

  return HERO_CLOUDINARY_URLS.map((url, i) => {
    const template = seedTemplates[i] ?? apiTemplates[i] ?? seedTemplates[i % seedTemplates.length] ?? seedBanners[0];
    return {
      ...template,
      id: `hero-cdn-${i}`,
      order: i + 1,
      image: url,
      layout: "designed" as const,
      enabled: true,
    };
  });
}

/** Enabled hero slides with a usable image — falls back to seed banners when API data is empty. */
export function resolveHeroBanners(allBanners: Banner[], fallbackImages: string[] = []): Banner[] {
  const heroDefaults = [...HERO_DEFAULT_IMAGES, ...fallbackImages.filter(Boolean)];

  const fromStore = allBanners
    .filter((b) => b.enabled !== false)
    .sort((a, b) => a.order - b.order)
    .map((b, i) => {
      const image = b.image || heroDefaults[i % heroDefaults.length];
      const designedAsset = HERO_DEFAULT_IMAGES.includes(image);
      return {
        ...b,
        image,
        layout: b.layout || (designedAsset ? "designed" : "overlay"),
      };
    })
    .filter((b) => Boolean(b.image));

  const base = fromStore.length > 0 ? fromStore : seedBanners.map((b, i) => ({
    ...b,
    image: b.image || heroDefaults[i % heroDefaults.length],
  })).filter((b) => Boolean(b.image));

  return applyCloudinaryHeroImages(base);
}
