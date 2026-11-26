import { catalogApi, adminApi } from "./services";
import { mapBannerToApi, mapCategoryToApi, mapProductToApi, mapReviewToApi } from "./mappers";
import { resolveHeroBanners } from "../heroBanners";
import { enrichProducts } from "../productImages";
import { enrichBodyParts, enrichPainAreas } from "../taxonomyImages";
import { enrichReviews } from "../reviews";
import { seedBodyParts, seedPainAreas } from "../seed";
import { storeEmit, storeRead, storeWrite } from "./storeSync";
import type { Banner, Category, CMSContent, ContactInfo, Customer, FooterContent, Lead, Order, PolicyPage, Product, Review } from "../types";

let bootstrapped = false;
let categoryIdMap = new Map<string, string>();

export function isStoreBootstrapped() {
  return bootstrapped;
}

export async function bootstrapStore() {
  if (typeof window === "undefined") return;
  try {
    const [
      products,
      categories,
      bodyParts,
      painAreas,
      activities,
      banners,
      posters,
      trustStrip,
      blogs,
      reviews,
      cms,
      footer,
      contact,
      policies,
    ] = await Promise.all([
      catalogApi.products({ limit: "200" }),
      catalogApi.categories(),
      catalogApi.bodyParts(),
      catalogApi.painAreas(),
      catalogApi.activities(),
      catalogApi.banners(),
      catalogApi.posters(),
      catalogApi.trustStrip(),
      catalogApi.blogs(),
      catalogApi.testimonials().catch(() => null),
      catalogApi.cms().catch(() => null),
      catalogApi.footer().catch(() => null),
      catalogApi.contact().catch(() => null),
      catalogApi.policies().catch(() => []),
    ]);

    categoryIdMap = new Map(categories.map((c) => [c.slug, c.id]));

    storeWrite("aligno_products", enrichProducts(products));
    storeWrite("aligno_categories", categories);
    storeWrite("aligno_body_parts", enrichBodyParts(bodyParts, seedBodyParts));
    storeWrite("aligno_pain_areas", enrichPainAreas(painAreas, enrichBodyParts(bodyParts, seedBodyParts), enrichProducts(products), seedPainAreas));
    storeWrite("aligno_activities", activities);
    storeWrite(
      "aligno_banners",
      resolveHeroBanners(banners, [
        ...trustStrip.map((item) => item.image).filter(Boolean) as string[],
        ...bodyParts.map((part) => part.image).filter(Boolean),
      ]),
    );
    storeWrite("aligno_posters", posters);
    storeWrite("aligno_trust_strip", trustStrip);
    storeWrite("aligno_blogs", blogs);
    if (reviews) {
      storeWrite("aligno_reviews", enrichReviews(reviews, enrichProducts(products)));
    }
    if (cms) storeWrite("aligno_cms", cms);
    if (footer) storeWrite("aligno_footer", footer);
    if (contact) storeWrite("aligno_contact", contact);
    storeWrite("aligno_policies", policies);

    bootstrapped = true;
    storeEmit();
  } catch (e) {
    console.warn("[Aligno API] bootstrap failed, using local seed fallback:", e);
  }
}

export async function refreshAdminData() {
  try {
    const [orders, leads, customers, testimonials, banners] = await Promise.all([
      adminApi.orders().catch(() => [] as Order[]),
      adminApi.leads().catch(() => [] as Lead[]),
      adminApi.customers().catch(() => [] as Customer[]),
      adminApi.testimonials().catch(() => null as Review[] | null),
      catalogApi.banners().catch(() => null as Banner[] | null),
    ]);
    storeWrite("aligno_orders", orders);
    storeWrite("aligno_leads", leads);
    storeWrite("aligno_customers", customers);
    if (testimonials) {
      const products = storeRead<Product[]>("aligno_products") || [];
      storeWrite("aligno_reviews", enrichReviews(testimonials, products));
    }
    if (banners) {
      const trustStrip = storeRead<{ image?: string }[]>("aligno_trust_strip") || [];
      const bodyParts = storeRead<{ image?: string }[]>("aligno_body_parts") || [];
      storeWrite(
        "aligno_banners",
        resolveHeroBanners(banners, [
          ...trustStrip.map((item) => item.image).filter(Boolean) as string[],
          ...bodyParts.map((part) => part.image).filter(Boolean),
        ]),
      );
    }
    storeEmit();
  } catch (e) {
    console.warn("[Aligno API] admin refresh failed:", e);
  }
}

function getCategoryId(slug: string) {
  return categoryIdMap.get(slug);
}

export async function apiProductAdd(item: Product) {
  const catId = getCategoryId(item.category);
  const created = await catalogApi.createProduct(mapProductToApi(item, catId));
  const list = (storeRead<Product[]>("aligno_products") || []).filter(
    (p) => p.slug !== item.slug && p.id !== item.id,
  );
  storeWrite("aligno_products", [created, ...list]);
  storeEmit();
  return created;
}

export async function apiProductUpdate(id: string, patch: Partial<Product>) {
  const existing = (storeRead<Product[]>("aligno_products") || []).find((p) => p.id === id);
  const merged: Partial<Product> = existing ? { ...existing, ...patch } : patch;
  const catId = merged.category ? getCategoryId(merged.category) : undefined;
  const updated = await catalogApi.updateProduct(id, mapProductToApi(merged, catId));
  const list = (storeRead<Product[]>("aligno_products") || []).map((p) =>
    p.id === id
      ? {
          ...p,
          ...merged,
          ...updated,
          images: updated.images?.length ? updated.images : merged.images || p.images,
        }
      : p,
  );
  storeWrite("aligno_products", list);
  storeEmit();
}

export async function apiProductRemove(id: string) {
  await catalogApi.deleteProduct(id);
  storeWrite(
    "aligno_products",
    (storeRead<Product[]>("aligno_products") || []).filter((p) => p.id !== id),
  );
  storeEmit();
}

export async function apiCategoryAdd(item: Category) {
  const created = await catalogApi.createCategory(mapCategoryToApi(item));
  categoryIdMap.set(created.slug, created.id);
  storeWrite("aligno_categories", [created, ...(storeRead<Category[]>("aligno_categories") || [])]);
  storeEmit();
}

export async function apiCategoryUpdate(id: string, patch: Partial<Category>) {
  const existing = (storeRead<Category[]>("aligno_categories") || []).find((c) => c.id === id);
  const merged: Partial<Category> = existing ? { ...existing, ...patch } : patch;
  const updated = await catalogApi.updateCategory(id, mapCategoryToApi(merged));
  if (updated.slug) categoryIdMap.set(updated.slug, updated.id);
  const list = (storeRead<Category[]>("aligno_categories") || []).map((c) =>
    c.id === id ? { ...c, ...merged, ...updated } : c,
  );
  storeWrite("aligno_categories", list);
  storeEmit();
}

export async function apiCategoryRemove(id: string) {
  await catalogApi.deleteCategory(id);
  storeWrite(
    "aligno_categories",
    (storeRead<Category[]>("aligno_categories") || []).filter((c) => c.id !== id),
  );
  storeEmit();
}

export async function apiGenericUpdate<T extends { id: string }>(
  key: string,
  id: string,
  patch: Partial<T>,
  endpoint: string,
) {
  const { apiFetch } = await import("./client");
  await apiFetch<unknown>(`${endpoint}/${id}`, { method: "PATCH", json: patch });
  const list = (storeRead<T[]>(key) || []).map((item) => (item.id === id ? { ...item, ...patch } : item));
  storeWrite(key, list);
  storeEmit();
}

export async function apiCmsUpdate(patch: Partial<CMSContent>) {
  const updated = await adminApi.updateCms(patch);
  storeWrite("aligno_cms", updated);
  storeEmit();
}

export async function apiFooterUpdate(patch: Partial<FooterContent>) {
  const updated = await adminApi.updateFooter(patch);
  storeWrite("aligno_footer", updated);
  storeEmit();
}

export async function apiContactUpdate(patch: Partial<ContactInfo>) {
  const updated = await adminApi.updateContact(patch);
  storeWrite("aligno_contact", updated);
  storeEmit();
}

export async function apiPolicyUpdate(slug: string, patch: Partial<PolicyPage>) {
  const updated = await adminApi.updatePolicy(slug, patch);
  const list = (storeRead<PolicyPage[]>("aligno_policies") || []).map((p) => (p.slug === slug ? { ...p, ...updated } : p));
  storeWrite("aligno_policies", list);
  storeEmit();
}

export async function apiLeadUpdate(id: string, patch: Partial<Lead>) {
  await adminApi.updateLead(id, patch);
  const list = (storeRead<Lead[]>("aligno_leads") || []).map((l) => (l.id === id ? { ...l, ...patch } : l));
  storeWrite("aligno_leads", list);
  storeEmit();
}

export async function apiOrderStatusUpdate(id: string, status: string) {
  await adminApi.updateOrderStatus(id, status);
  await refreshAdminData();
}

export async function apiLeadCreate(body: Partial<Lead>) {
  const { leadApi } = await import("./services");
  const created = await leadApi.create(body);
  storeWrite("aligno_leads", [created, ...(storeRead<Lead[]>("aligno_leads") || [])]);
  storeEmit();
}

function isMongoId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function apiReviewAdd(item: Review) {
  const created = await adminApi.createTestimonial(mapReviewToApi(item));
  const products = storeRead<Product[]>("aligno_products") || [];
  const list = (storeRead<Review[]>("aligno_reviews") || []).filter((review) => review.id !== item.id);
  storeWrite("aligno_reviews", enrichReviews([created, ...list], products));
  storeEmit();
  return created;
}

export async function apiReviewUpdate(id: string, patch: Partial<Review>) {
  const existing = (storeRead<Review[]>("aligno_reviews") || []).find((review) => review.id === id);
  const merged: Partial<Review> = existing ? { ...existing, ...patch } : patch;
  const updated = await adminApi.updateTestimonial(id, mapReviewToApi(merged));
  const products = storeRead<Product[]>("aligno_products") || [];
  const list = (storeRead<Review[]>("aligno_reviews") || []).map((review) =>
    review.id === id ? { ...review, ...merged, ...updated } : review,
  );
  storeWrite("aligno_reviews", enrichReviews(list, products));
  storeEmit();
  return updated;
}

export async function apiReviewRemove(id: string) {
  await adminApi.deleteTestimonial(id);
  storeWrite(
    "aligno_reviews",
    (storeRead<Review[]>("aligno_reviews") || []).filter((review) => review.id !== id),
  );
  storeEmit();
}

export async function apiReviewSave(item: Review) {
  if (isMongoId(item.id)) return apiReviewUpdate(item.id, item);
  return apiReviewAdd(item);
}

function resolveBannerStoreList(banners: Banner[]) {
  const trustStrip = storeRead<{ image?: string }[]>("aligno_trust_strip") || [];
  const bodyParts = storeRead<{ image?: string }[]>("aligno_body_parts") || [];
  return resolveHeroBanners(banners, [
    ...trustStrip.map((item) => item.image).filter(Boolean) as string[],
    ...bodyParts.map((part) => part.image).filter(Boolean),
  ]);
}

export async function apiBannerAdd(item: Banner) {
  const created = await catalogApi.createBanner(mapBannerToApi(item));
  const list = (storeRead<Banner[]>("aligno_banners") || []).filter((banner) => banner.id !== item.id);
  storeWrite("aligno_banners", resolveBannerStoreList([created, ...list]));
  storeEmit();
  return created;
}

export async function apiBannerUpdate(id: string, patch: Partial<Banner>) {
  const existing = (storeRead<Banner[]>("aligno_banners") || []).find((banner) => banner.id === id);
  const merged: Partial<Banner> = existing ? { ...existing, ...patch } : patch;
  const updated = await catalogApi.updateBanner(id, mapBannerToApi(merged));
  const list = (storeRead<Banner[]>("aligno_banners") || []).map((banner) =>
    banner.id === id ? { ...banner, ...merged, ...updated } : banner,
  );
  storeWrite("aligno_banners", resolveBannerStoreList(list));
  storeEmit();
  return updated;
}

export async function apiBannerRemove(id: string) {
  await catalogApi.deleteBanner(id);
  storeWrite(
    "aligno_banners",
    resolveBannerStoreList((storeRead<Banner[]>("aligno_banners") || []).filter((banner) => banner.id !== id)),
  );
  storeEmit();
}

export async function apiBannerSave(item: Banner) {
  if (isMongoId(item.id)) return apiBannerUpdate(item.id, item);
  return apiBannerAdd(item);
}
