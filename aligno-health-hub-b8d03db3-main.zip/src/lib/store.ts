import { useRef, useSyncExternalStore } from "react";
import * as seed from "./seed";
import type {
  Activity, Banner, Blog, BodyPart, CMSContent, Category,
  ContactInfo, Customer, FooterContent, Lead, Order, PainArea,
  PolicyPage, Poster, Product, Review, TrustStripItem,
} from "./types";
import { storeEmit, storeRead, storeWrite, storeSubscribe, getStoreVersion } from "./api/storeSync";

const isBrowser = typeof window !== "undefined";
let snapshotMode = false;

/** Bump when seed images/data change so browsers pick up new assets */
const SEED_VERSION = "17";
const SEED_KEYS = [
  "aligno_products", "aligno_categories", "aligno_body_parts", "aligno_pain_areas",
  "aligno_activities", "aligno_banners", "aligno_posters", "aligno_trust_strip",
  "aligno_blogs", "aligno_reviews", "aligno_policies", "aligno_cms", "aligno_footer", "aligno_contact",
];

if (isBrowser && localStorage.getItem("aligno_seed_version") !== SEED_VERSION) {
  SEED_KEYS.forEach((k) => localStorage.removeItem(k));
  localStorage.setItem("aligno_seed_version", SEED_VERSION);
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser || snapshotMode) {
    const data = storeRead<T[]>(key, fallback as unknown as T[]);
    return (Array.isArray(fallback) ? data : storeRead(key, fallback)) as T;
  }
  const val = storeRead(key, fallback);
  if (Array.isArray(fallback) && Array.isArray(val) && val.length === 0 && fallback.length > 0) {
    return fallback;
  }
  return val as T;
}

function write<T>(key: string, value: T) {
  storeWrite(key, value);
}

export function subscribe(cb: () => void) {
  return storeSubscribe(cb);
}

function makeList<T extends { id: string }>(key: string, seedData: T[]) {
  return {
    list: () => read<T[]>(key, seedData),
    set: (items: T[]) => write(key, items),
    add: (item: T) => {
      const items = [...read<T[]>(key, seedData)];
      items.unshift(item);
      write(key, items);
    },
    update: (id: string, patch: Partial<T>) => {
      const items = read<T[]>(key, seedData);
      const idx = items.findIndex((i) => i.id === id);
      if (idx >= 0) {
        write(key, items.map((item, i) => (i === idx ? { ...item, ...patch } : item)));
      }
    },
    remove: (id: string) => {
      write(key, read<T[]>(key, seedData).filter((i) => i.id !== id));
    },
    byId: (id: string) => read<T[]>(key, seedData).find((i) => i.id === id),
    reset: () => write(key, seedData),
  };
}

function makeSingle<T>(key: string, seedData: T) {
  return {
    get: () => read<T>(key, seedData),
    set: (v: T) => write(key, v),
  };
}

export const productService = makeList<Product>("aligno_products", seed.seedProducts);
export const categoryService = makeList<Category>("aligno_categories", seed.seedCategories);
export const bodyPartService = makeList<BodyPart>("aligno_body_parts", seed.seedBodyParts);
export const painAreaService = makeList<PainArea>("aligno_pain_areas", seed.seedPainAreas);
export const activityService = makeList<Activity>("aligno_activities", seed.seedActivities);
export const bannerService = makeList<Banner>("aligno_banners", seed.seedBanners);
export const posterService = makeList<Poster>("aligno_posters", seed.seedPosters);
export const trustStripService = makeList<TrustStripItem>("aligno_trust_strip", seed.seedTrustStrip);
export const blogService = makeList<Blog>("aligno_blogs", seed.seedBlogs);
export const reviewService = makeList<Review>("aligno_reviews", seed.seedReviews);
export const orderService = makeList<Order>("aligno_orders", seed.seedOrders);
export const customerService = makeList<Customer>("aligno_customers", seed.seedCustomers);
export const leadService = makeList<Lead>("aligno_leads", seed.seedLeads);

export const policyService = {
  list: () => read<PolicyPage[]>("aligno_policies", seed.seedPolicies),
  bySlug: (slug: string) => read<PolicyPage[]>("aligno_policies", seed.seedPolicies).find((p) => p.slug === slug),
  update: (slug: string, patch: Partial<PolicyPage>) => {
    const items = read<PolicyPage[]>("aligno_policies", seed.seedPolicies);
    const idx = items.findIndex((p) => p.slug === slug);
    if (idx >= 0) {
      write("aligno_policies", items.map((item, i) => (i === idx ? { ...item, ...patch } : item)));
    }
    import("./api/bootstrap").then((m) => m.apiPolicyUpdate(slug, patch)).catch(console.error);
  },
};

export const cmsService = (() => {
  const base = makeSingle<CMSContent>("aligno_cms", seed.seedCMS);
  return {
    get: base.get,
    set: (v: CMSContent) => {
      write("aligno_cms", v);
      import("./api/bootstrap").then((m) => m.apiCmsUpdate(v)).catch(console.error);
    },
  };
})();

export const footerService = (() => {
  const base = makeSingle<FooterContent>("aligno_footer", seed.seedFooter);
  return {
    get: base.get,
    set: (v: FooterContent) => {
      write("aligno_footer", v);
      import("./api/bootstrap").then((m) => m.apiFooterUpdate(v)).catch(console.error);
    },
  };
})();

export const contactService = (() => {
  const base = makeSingle<ContactInfo>("aligno_contact", seed.seedContact);
  return {
    get: base.get,
    set: (v: ContactInfo) => {
      write("aligno_contact", v);
      import("./api/bootstrap").then((m) => m.apiContactUpdate(v)).catch(console.error);
    },
  };
})();

// API-backed mutations for admin CRUD
const _productAdd = productService.add.bind(productService);
productService.add = (item: Product) => {
  _productAdd(item);
  import("./api/bootstrap").then((m) => m.apiProductAdd(item)).catch(console.error);
};
const _productUpdate = productService.update.bind(productService);
productService.update = (id: string, patch: Partial<Product>) => {
  _productUpdate(id, patch);
  import("./api/bootstrap").then((m) => m.apiProductUpdate(id, patch)).catch(console.error);
};
const _productRemove = productService.remove.bind(productService);
productService.remove = (id: string) => {
  _productRemove(id);
  import("./api/bootstrap").then((m) => m.apiProductRemove(id)).catch(console.error);
};

const _categoryAdd = categoryService.add.bind(categoryService);
categoryService.add = (item: Category) => {
  _categoryAdd(item);
  import("./api/bootstrap").then((m) => m.apiCategoryAdd(item)).catch(console.error);
};
const _categoryUpdate = categoryService.update.bind(categoryService);
categoryService.update = (id: string, patch: Partial<Category>) => {
  _categoryUpdate(id, patch);
  import("./api/bootstrap").then((m) => m.apiCategoryUpdate(id, patch)).catch(console.error);
};
const _categoryRemove = categoryService.remove.bind(categoryService);
categoryService.remove = (id: string) => {
  _categoryRemove(id);
  import("./api/bootstrap").then((m) => m.apiCategoryRemove(id)).catch(console.error);
};

const _orderUpdate = orderService.update.bind(orderService);
orderService.update = (id: string, patch: Partial<Order>) => {
  _orderUpdate(id, patch);
  if (patch.status) {
    const orders = storeRead<Order[]>("aligno_orders", []);
    const order = orders.find((o) => o.id === id);
    const mongoId = order?.mongoId || id;
    const statusMap: Record<string, string> = {
      Pending: "placed",
      Confirmed: "confirmed",
      Packed: "packed",
      Shipped: "shipped",
      Delivered: "delivered",
      Cancelled: "cancelled",
    };
    const apiStatus = statusMap[patch.status] || patch.status.toLowerCase();
    import("./api/bootstrap").then((m) => m.apiOrderStatusUpdate(mongoId, apiStatus)).catch(console.error);
  }
};

const _leadUpdate = leadService.update.bind(leadService);
leadService.update = (id: string, patch: Partial<Lead>) => {
  _leadUpdate(id, patch);
  import("./api/bootstrap").then((m) => m.apiLeadUpdate(id, patch)).catch(console.error);
};

const _leadAdd = leadService.add.bind(leadService);
leadService.add = (item: Lead) => {
  _leadAdd(item);
  import("./api/bootstrap").then((m) => m.apiLeadCreate(item)).catch(console.error);
};

export function useStore<T>(selector: () => T): T {
  const snapshot = useRef<{ version: number; value: T } | null>(null);
  const getSnapshot = () => {
    const version = getStoreVersion();
    if (!snapshot.current || snapshot.current.version !== version) {
      snapshot.current = { version, value: selector() };
    }
    return snapshot.current.value;
  };
  const getServerSnapshot = () => {
    snapshotMode = true;
    try {
      return selector();
    } finally {
      snapshotMode = false;
    }
  };
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export { storeWrite, storeRead, storeEmit };
