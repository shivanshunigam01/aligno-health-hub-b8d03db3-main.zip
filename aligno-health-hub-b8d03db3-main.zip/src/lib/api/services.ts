import { apiFetch, apiUpload, clearTokens, setTokens } from "./client";
import {
  mapActivity,
  mapBanner,
  mapBannerToApi,
  mapBlog,
  mapBodyPart,
  mapCategory,
  mapCategoryToApi,
  mapCms,
  mapContact,
  mapCustomer,
  mapFooter,
  mapLead,
  mapOrder,
  mapPainArea,
  mapPolicy,
  mapPoster,
  mapProduct,
  mapProductToApi,
  mapReview,
  mapTrustStrip,
} from "./mappers";

type AuthRes = { accessToken: string; refreshToken: string; user: Record<string, unknown> };

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthRes>("/auth/login", { method: "POST", json: { email, password }, auth: false }).then((d) => {
      setTokens(d.accessToken, d.refreshToken);
      return d;
    }),
  register: (name: string, email: string, password: string) =>
    apiFetch<AuthRes>("/auth/register", { method: "POST", json: { name, email, password }, auth: false }).then((d) => {
      setTokens(d.accessToken, d.refreshToken);
      return d;
    }),
  logout: () => apiFetch<unknown>("/auth/logout", { method: "POST" }).finally(clearTokens),
  me: () => apiFetch<Record<string, unknown>>("/auth/me"),
};

export const catalogApi = {
  products: (params?: Record<string, string>) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch<Record<string, unknown>[]>(`/products${q ? `?${q}` : ""}`, { auth: false }).then((d) => d.map(mapProduct));
  },
  product: (slug: string) => apiFetch<Record<string, unknown>>(`/products/${slug}`, { auth: false }).then(mapProduct),
  createProduct: (body: unknown) => apiFetch<Record<string, unknown>>("/products", { method: "POST", json: body }).then(mapProduct),
  updateProduct: (id: string, body: unknown) =>
    apiFetch<Record<string, unknown>>(`/products/${id}`, { method: "PATCH", json: body }).then(mapProduct),
  deleteProduct: (id: string) => apiFetch<unknown>(`/products/${id}`, { method: "DELETE" }),

  categories: () => apiFetch<Record<string, unknown>[]>("/categories", { auth: false }).then((d) => d.map(mapCategory)),
  createCategory: (body: unknown) => apiFetch<Record<string, unknown>>("/categories", { method: "POST", json: body }).then(mapCategory),
  updateCategory: (id: string, body: unknown) =>
    apiFetch<Record<string, unknown>>(`/categories/${id}`, { method: "PATCH", json: body }).then(mapCategory),
  deleteCategory: (id: string) => apiFetch<unknown>(`/categories/${id}`, { method: "DELETE" }),

  bodyParts: () => apiFetch<Record<string, unknown>[]>("/body-parts", { auth: false }).then((d) => d.map(mapBodyPart)),
  painAreas: () => apiFetch<Record<string, unknown>[]>("/pain-areas", { auth: false }).then((d) => d.map(mapPainArea)),
  activities: () => apiFetch<Record<string, unknown>[]>("/activities", { auth: false }).then((d) => d.map(mapActivity)),
  banners: () => apiFetch<Record<string, unknown>[]>("/banners?limit=50", { auth: false }).then((d) => d.map(mapBanner)),
  createBanner: (body: unknown) => apiFetch<Record<string, unknown>>("/banners", { method: "POST", json: body }).then(mapBanner),
  updateBanner: (id: string, body: unknown) =>
    apiFetch<Record<string, unknown>>(`/banners/${id}`, { method: "PATCH", json: body }).then(mapBanner),
  deleteBanner: (id: string) => apiFetch<unknown>(`/banners/${id}`, { method: "DELETE" }),
  posters: () => apiFetch<Record<string, unknown>[]>("/posters", { auth: false }).then((d) => d.map(mapPoster)),
  trustStrip: () => apiFetch<Record<string, unknown>[]>("/trust-strip", { auth: false }).then((d) => d.map(mapTrustStrip)),
  blogs: () => apiFetch<Record<string, unknown>[]>("/blogs", { auth: false }).then((d) => d.map(mapBlog)),
  testimonials: (params?: Record<string, string>) => {
    const q = new URLSearchParams({ limit: "50", ...params }).toString();
    return apiFetch<Record<string, unknown>[]>(`/testimonials?${q}`, { auth: false }).then((d) => d.map(mapReview));
  },
  reviews: (productId?: string) => {
    if (!productId) return Promise.resolve([] as ReturnType<typeof mapReview>[]);
    return apiFetch<Record<string, unknown>[]>(`/reviews/product/${productId}`, { auth: false }).then((d) => d.map(mapReview));
  },
  cms: () => apiFetch<Record<string, unknown>>("/cms", { auth: false }).then(mapCms),
  footer: () => apiFetch<Record<string, unknown>>("/footer", { auth: false }).then(mapFooter),
  contact: () => apiFetch<Record<string, unknown>>("/contact-info", { auth: false }).then(mapContact),
  policies: () => apiFetch<Record<string, unknown>[]>("/policies", { auth: false }).then((d) => d.map(mapPolicy)),
  policy: (slug: string) => apiFetch<Record<string, unknown>>(`/policies/${slug}`, { auth: false }).then(mapPolicy),
};

export const adminApi = {
  uploadImages: (files: File[], folder = "aligno/products") => apiUpload("/admin/upload", files, folder),

  createBodyPart: (body: unknown) =>
    apiFetch<Record<string, unknown>>("/admin/body-parts", { method: "POST", json: body }).then(mapBodyPart),
  updateBodyPart: (id: string, body: unknown) =>
    apiFetch<Record<string, unknown>>(`/admin/body-parts/${id}`, { method: "PATCH", json: body }).then(mapBodyPart),
  deleteBodyPart: (id: string) => apiFetch<unknown>(`/admin/body-parts/${id}`, { method: "DELETE" }),

  createBlog: (body: unknown) => apiFetch<Record<string, unknown>>("/admin/blogs", { method: "POST", json: body }).then(mapBlog),
  updateBlog: (id: string, body: unknown) =>
    apiFetch<Record<string, unknown>>(`/admin/blogs/${id}`, { method: "PATCH", json: body }).then(mapBlog),
  deleteBlog: (id: string) => apiFetch<unknown>(`/admin/blogs/${id}`, { method: "DELETE" }),

  updateCms: (body: unknown) => apiFetch<Record<string, unknown>>("/admin/cms", { method: "PATCH", json: body }).then(mapCms),
  updateFooter: (body: unknown) => apiFetch<Record<string, unknown>>("/admin/footer", { method: "PATCH", json: body }).then(mapFooter),
  updateContact: (body: unknown) =>
    apiFetch<Record<string, unknown>>("/admin/contact-info", { method: "PATCH", json: body }).then(mapContact),
  updatePolicy: (slug: string, body: unknown) =>
    apiFetch<Record<string, unknown>>(`/admin/policies/${slug}`, { method: "PATCH", json: body }).then(mapPolicy),

  testimonials: () => apiFetch<Record<string, unknown>[]>("/admin/testimonials?limit=200").then((d) => d.map(mapReview)),
  createTestimonial: (body: unknown) =>
    apiFetch<Record<string, unknown>>("/admin/testimonials", { method: "POST", json: body }).then(mapReview),
  updateTestimonial: (id: string, body: unknown) =>
    apiFetch<Record<string, unknown>>(`/admin/testimonials/${id}`, { method: "PATCH", json: body }).then(mapReview),
  deleteTestimonial: (id: string) => apiFetch<unknown>(`/admin/testimonials/${id}`, { method: "DELETE" }),

  orders: () =>
    apiFetch<Record<string, unknown>[]>("/orders?limit=200").then((d) => (Array.isArray(d) ? d : []).map(mapOrder)),
  updateOrderStatus: (id: string, status: string) =>
    apiFetch<Record<string, unknown>>(`/orders/${id}/status`, { method: "PATCH", json: { status } }),

  leads: () => apiFetch<Record<string, unknown>[]>("/admin/leads").then((d) => d.map(mapLead)),
  updateLead: (id: string, body: unknown) =>
    apiFetch<Record<string, unknown>>(`/admin/leads/${id}`, { method: "PATCH", json: body }).then(mapLead),

  customers: () => apiFetch<Record<string, unknown>[]>("/users").then((d) => d.map(mapCustomer)),
  reports: () => apiFetch<Record<string, unknown>>("/admin/reports"),
  dashboard: () => apiFetch<Record<string, unknown>>("/admin/dashboard"),
};

export const orderApi = {
  guestCheckout: (body: unknown) => apiFetch<Record<string, unknown>>("/orders/guest", { method: "POST", json: body, auth: false }).then(mapOrder),
  track: (orderNo: string) => apiFetch<Record<string, unknown>>(`/orders/track/${orderNo}`, { auth: false }).then(mapOrder),
  myOrders: () => apiFetch<Record<string, unknown>[]>("/orders/my").then((d) => d.map(mapOrder)),
};

export const leadApi = {
  create: (body: unknown) => apiFetch<Record<string, unknown>>("/leads", { method: "POST", json: body, auth: false }).then(mapLead),
};

export { mapCategoryToApi, mapProductToApi };
