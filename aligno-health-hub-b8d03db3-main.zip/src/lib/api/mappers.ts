import type {
  Activity,
  Banner,
  Blog,
  BodyPart,
  CMSContent,
  Category,
  ContactInfo,
  Customer,
  FooterContent,
  Lead,
  Order,
  OrderStatus,
  PainArea,
  PolicyPage,
  Poster,
  Product,
  Review,
  TrustStripItem,
} from "../types";

type MongoDoc = { _id: string; id?: string; createdAt?: string; updatedAt?: string };

function idOf(d: MongoDoc) {
  return d._id || d.id || "";
}

function imgUrl(v: unknown): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v !== null && "secure_url" in v) return (v as { secure_url: string }).secure_url;
  return "";
}

export function mapProduct(p: Record<string, unknown>): Product {
  const cat = p.category as Record<string, unknown> | string | undefined;
  const categorySlug =
    (p.categorySlug as string) ||
    (typeof cat === "object" && cat ? (cat.slug as string) : "") ||
    (typeof cat === "string" ? cat : "");

  const images = Array.isArray(p.images)
    ? (p.images as unknown[]).map((i) => (typeof i === "string" ? i : imgUrl(i))).filter(Boolean)
    : [];

  const specs = p.specifications;
  let specifications: Record<string, string> = {};
  if (Array.isArray(specs)) {
    specifications = Object.fromEntries(
      (specs as { name: string; value: string }[]).map((s) => [s.name, s.value]),
    );
  } else if (specs && typeof specs === "object") {
    specifications = specs as Record<string, string>;
  }

  return {
    id: idOf(p as MongoDoc),
    name: (p.name as string) || "",
    slug: (p.slug as string) || "",
    category: categorySlug,
    bodyPart: p.bodyPart as string | undefined,
    painArea: p.painArea as string | undefined,
    activity: (p.activity as string[]) || [],
    price: Number(p.mrp ?? p.price ?? 0),
    discountPrice: Number(p.sellingPrice ?? p.discountPrice ?? 0),
    sku: (p.sku as string) || "",
    stock: Number(p.stock ?? 0),
    images,
    rating: Number(p.ratingAverage ?? p.rating ?? 0),
    reviewCount: Number(p.ratingCount ?? p.reviewCount ?? 0),
    sizes: (p.sizes as string[]) || [],
    shortDescription: (p.shortDescription as string) || "",
    longDescription: (p.description as string) || (p.longDescription as string) || "",
    benefits: (p.benefits as string[]) || [],
    specifications,
    careInstructions: (p.careInstructions as string[]) || [],
    faqs: (p.faqs as { q: string; a: string }[]) || [],
    bestSeller: Boolean(p.isBestSeller ?? p.bestSeller),
    featured: Boolean(p.isFeatured ?? p.featured),
    newArrival: Boolean(p.isNewArrival ?? p.newArrival),
    enabled: p.enabled !== false && p.visibility !== "private" && p.visibility !== "draft",
  };
}

export function mapProductToApi(p: Partial<Product>, categoryId?: string) {
  const specifications = p.specifications
    ? Object.entries(p.specifications).map(([name, value]) => ({ name, value }))
    : [];
  return {
    name: p.name,
    slug: p.slug,
    category: categoryId,
    categorySlug: p.category,
    bodyPart: p.bodyPart,
    painArea: p.painArea,
    activity: p.activity,
    mrp: p.price,
    sellingPrice: p.discountPrice,
    sku: p.sku,
    stock: p.stock,
    images: (p.images || []).map((url, i) => ({ secure_url: url, order: i, isPrimary: i === 0 })),
    shortDescription: p.shortDescription,
    description: p.longDescription,
    benefits: p.benefits,
    specifications,
    careInstructions: p.careInstructions,
    faqs: p.faqs,
    sizes: p.sizes,
    isBestSeller: p.bestSeller,
    isFeatured: p.featured,
    isNewArrival: p.newArrival,
    enabled: p.enabled !== false,
    visibility: p.enabled === false ? "draft" : "public",
  };
}

export function mapCategory(c: Record<string, unknown>): Category {
  return {
    id: idOf(c as MongoDoc),
    name: (c.name as string) || "",
    slug: (c.slug as string) || "",
    subtitle: c.description as string | undefined,
    image: imgUrl(c.image),
    order: Number(c.sortOrder ?? c.order ?? 0),
    enabled: c.isActive !== false && c.enabled !== false,
  };
}

export function mapCategoryToApi(c: Partial<Category>) {
  return {
    name: c.name,
    slug: c.slug,
    description: c.subtitle,
    sortOrder: c.order,
    isActive: c.enabled !== false,
    image: c.image ? { secure_url: c.image } : undefined,
  };
}

function mapTaxonomy(c: Record<string, unknown>): BodyPart {
  return {
    id: idOf(c as MongoDoc),
    name: (c.name as string) || "",
    slug: (c.slug as string) || "",
    image: imgUrl(c.image),
    marker: c.marker as { x: number; y: number } | undefined,
    enabled: c.enabled !== false,
  };
}

export const mapBodyPart = mapTaxonomy;
export const mapPainArea = mapTaxonomy as (c: Record<string, unknown>) => PainArea;
export const mapActivity = (c: Record<string, unknown>): Activity => ({
  id: idOf(c as MongoDoc),
  name: (c.name as string) || "",
  slug: (c.slug as string) || "",
  image: imgUrl(c.image),
  enabled: c.enabled !== false,
});

export function mapBanner(b: Record<string, unknown>): Banner {
  return {
    id: idOf(b as MongoDoc),
    title: (b.title as string) || "",
    subtitle: b.subtitle as string | undefined,
    offer: b.offer as string | undefined,
    ctaText: (b.ctaText as string) || "Shop Now",
    ctaLink: (b.redirectUrl as string) || (b.ctaLink as string) || "/shop",
    image: imgUrl(b.image),
    order: Number(b.priority ?? b.order ?? 0),
    enabled: b.isActive !== false && b.enabled !== false,
    layout: (b.layout as Banner["layout"]) || "designed",
  };
}

export function mapBannerToApi(b: Partial<Banner>) {
  return {
    title: b.title,
    subtitle: b.subtitle,
    offer: b.offer,
    ctaText: b.ctaText,
    layout: b.layout || "designed",
    image: b.image ? { secure_url: b.image } : undefined,
    redirectUrl: b.ctaLink || "/shop",
    priority: b.order ?? 0,
    placement: "home",
    isActive: b.enabled !== false,
  };
}

export function mapPoster(p: Record<string, unknown>): Poster {
  return {
    id: idOf(p as MongoDoc),
    title: (p.title as string) || "",
    ctaText: (p.ctaText as string) || "",
    ctaLink: (p.ctaLink as string) || "/shop",
    image: imgUrl(p.image),
    enabled: p.enabled !== false,
  };
}

export function mapTrustStrip(t: Record<string, unknown>): TrustStripItem {
  return {
    id: idOf(t as MongoDoc),
    title: (t.title as string) || "",
    subtitle: (t.subtitle as string) || "",
    icon: (t.icon as string) || "ShieldCheck",
    image: imgUrl(t.image) || undefined,
    order: Number(t.order ?? 0),
    enabled: t.enabled !== false,
  };
}

export function mapBlog(b: Record<string, unknown>): Blog {
  return {
    id: idOf(b as MongoDoc),
    title: (b.title as string) || "",
    slug: (b.slug as string) || "",
    excerpt: (b.excerpt as string) || "",
    content: (b.content as string) || "",
    image: imgUrl(b.image),
    author: (b.author as string) || "Aligno",
    date: b.date ? new Date(b.date as string).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    seoTitle: b.seoTitle as string | undefined,
    seoDescription: b.seoDescription as string | undefined,
    published: Boolean(b.published),
  };
}

export function mapReview(r: Record<string, unknown>): Review {
  const product = r.product as Record<string, unknown> | string | undefined;
  const productId =
    (r.productId as string) ||
    (typeof product === "object" && product ? idOf(product as MongoDoc) : "") ||
    (typeof product === "string" ? product : "");

  const images = r.images as unknown[] | undefined;
  const imageFromArray = images?.length ? imgUrl(images[0]) : "";

  return {
    id: idOf(r as MongoDoc),
    customerName:
      (r.customerName as string) ||
      (typeof r.user === "object" && r.user ? ((r.user as Record<string, unknown>).name as string) : "") ||
      "",
    productId,
    rating: Number(r.rating ?? 0),
    text: (r.text as string) || (r.comment as string) || "",
    image: imgUrl(r.image) || imageFromArray || undefined,
    approved: Boolean(r.approved ?? r.isApproved ?? true),
    featured: Boolean(r.featured ?? r.isFeatured),
    date: r.date
      ? new Date(r.date as string).toISOString().slice(0, 10)
      : r.createdAt
        ? new Date(r.createdAt as string).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
  };
}

export function mapReviewToApi(r: Partial<Review>) {
  return {
    customerName: r.customerName,
    product: r.productId,
    rating: r.rating,
    text: r.text,
    image: r.image ? { secure_url: r.image } : undefined,
    approved: r.approved !== false,
    featured: Boolean(r.featured),
    date: r.date,
    order: 0,
  };
}

export function mapOrder(o: Record<string, unknown>): Order {
  const statusMap: Record<string, OrderStatus> = {
    placed: "Pending",
    confirmed: "Confirmed",
    packed: "Packed",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  const ship = o.shippingAddress as Record<string, string> | undefined;
  return {
    id: (o.orderNo as string) || idOf(o as MongoDoc),
    mongoId: idOf(o as MongoDoc),
    date: o.createdAt ? new Date(o.createdAt as string).toISOString() : new Date().toISOString(),
    customer: {
      fullName: ship?.name || "",
      email: (o.customerEmail as string) || "",
      phone: ship?.phone || "",
      address: ship?.line1 || "",
      city: ship?.city || "",
      state: ship?.state || "",
      pincode: ship?.pincode || "",
    },
    items: ((o.items as Record<string, unknown>[]) || []).map((i) => ({
      productId: typeof i.product === "object" ? idOf(i.product as MongoDoc) : String(i.product || i.productId || ""),
      name: (i.name as string) || "",
      qty: Number(i.quantity ?? i.qty ?? 1),
      price: Number(i.price ?? 0),
      size: i.size as string | undefined,
      image: (i.image as string) || "",
    })),
    subtotal: Number(o.subtotal ?? 0),
    gst: Number(o.tax ?? o.gst ?? 0),
    shipping: Number(o.shippingCharge ?? o.shipping ?? 0),
    discount: Number(o.discount ?? 0),
    total: Number(o.total ?? 0),
    paymentMethod: (o.paymentMethod as string) || "COD",
    status: statusMap[(o.orderStatus as string) || "placed"] || "Pending",
    userId: o.user ? (typeof o.user === "object" ? idOf(o.user as MongoDoc) : String(o.user)) : undefined,
  };
}

export function mapLead(l: Record<string, unknown>): Lead {
  return {
    id: idOf(l as MongoDoc),
    name: (l.name as string) || "",
    email: (l.email as string) || "",
    phone: l.phone as string | undefined,
    message: (l.message as string) || "",
    source: (l.source as Lead["source"]) || "contact",
    status: (l.status as Lead["status"]) || "New",
    notes: l.notes as string | undefined,
    createdAt: l.createdAt ? new Date(l.createdAt as string).toISOString() : new Date().toISOString(),
  };
}

export function mapCustomer(u: Record<string, unknown>): Customer {
  return {
    id: idOf(u as MongoDoc),
    name: (u.name as string) || "",
    email: (u.email as string) || "",
    phone: u.phone as string | undefined,
    password: "",
    createdAt: u.createdAt ? new Date(u.createdAt as string).toISOString() : new Date().toISOString(),
  };
}

export function mapCms(c: Record<string, unknown>): CMSContent {
  return {
    topBarText: (c.topBarText as string) || "",
    heroVisible: c.heroVisible !== false,
    trustStripVisible: c.trustStripVisible !== false,
    categoriesVisible: c.categoriesVisible !== false,
    painAreaVisible: c.painAreaVisible !== false,
    bestSellersVisible: c.bestSellersVisible !== false,
    postersVisible: c.postersVisible !== false,
    activityVisible: c.activityVisible !== false,
    brandBannerVisible: c.brandBannerVisible !== false,
    brandRangeVisible: c.brandRangeVisible !== false,
    testimonialsVisible: c.testimonialsVisible !== false,
    blogsVisible: c.blogsVisible !== false,
    seoTitle: (c.seoTitle as string) || "",
    seoDescription: (c.seoDescription as string) || "",
  };
}

export function mapFooter(f: Record<string, unknown>): FooterContent {
  const social = (f.social as Record<string, string>) || {};
  return {
    description: (f.description as string) || "",
    address: (f.address as string) || "",
    email: (f.email as string) || "",
    phone: (f.phone as string) || "",
    whatsapp: (f.whatsapp as string) || "",
    newsletterText: (f.newsletterText as string) || "",
    copyright: (f.copyright as string) || "",
    social: {
      facebook: social.facebook || "",
      instagram: social.instagram || "",
      youtube: social.youtube || "",
      linkedin: social.linkedin || "",
    },
  };
}

export function mapContact(c: Record<string, unknown>): ContactInfo {
  return {
    businessName: (c.businessName as string) || "",
    address: (c.address as string) || "",
    phone: (c.phone as string) || "",
    email: (c.email as string) || "",
    whatsapp: (c.whatsapp as string) || "",
    hours: (c.hours as string) || "",
    mapLink: (c.mapLink as string) || "",
  };
}

export function mapPolicy(p: Record<string, unknown>): PolicyPage {
  return {
    slug: (p.slug as string) || "",
    title: (p.title as string) || "",
    content: (p.content as string) || "",
  };
}
