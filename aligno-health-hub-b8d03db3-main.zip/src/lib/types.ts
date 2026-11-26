export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string; // category slug
  bodyPart?: string;
  painArea?: string;
  activity?: string[];
  price: number;
  discountPrice: number;
  sku: string;
  stock: number;
  images: string[];
  rating: number;
  reviewCount: number;
  sizes?: string[];
  shortDescription: string;
  longDescription: string;
  benefits: string[];
  specifications: Record<string, string>;
  careInstructions?: string[];
  faqs?: { q: string; a: string }[];
  bestSeller?: boolean;
  featured?: boolean;
  newArrival?: boolean;
  enabled?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  image: string;
  order: number;
  enabled: boolean;
}

export interface BodyPart {
  id: string;
  name: string;
  slug: string;
  image: string;
  marker?: { x: number; y: number };
  enabled: boolean;
}

export interface PainArea {
  id: string;
  name: string;
  slug: string;
  image: string;
  marker?: { x: number; y: number };
  enabled: boolean;
}

export interface Activity {
  id: string;
  name: string;
  slug: string;
  image: string;
  enabled: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  offer?: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  order: number;
  enabled: boolean;
  /** "designed" = full promo creative with baked-in text; "overlay" = photo + site text overlay */
  layout?: "designed" | "overlay";
}

export interface Poster {
  id: string;
  title: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  enabled: boolean;
}

export interface TrustStripItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string; // lucide icon name (fallback when no image)
  image?: string; // optional pre-designed trust graphic
  order: number;
  enabled: boolean;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
}

export interface Review {
  id: string;
  customerName: string;
  productId: string;
  rating: number;
  text: string;
  image?: string;
  approved: boolean;
  featured: boolean;
  date: string;
}

export interface CartItem {
  productId: string;
  qty: number;
  size?: string;
}

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus = "Pending" | "Confirmed" | "Packed" | "Shipped" | "Delivered" | "Cancelled";

export interface Order {
  id: string;
  mongoId?: string;
  date: string;
  customer: Address;
  items: { productId: string; name: string; qty: number; price: number; size?: string; image: string }[];
  subtotal: number;
  gst: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  userId?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  address?: Address;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: "contact" | "newsletter" | "inquiry";
  status: "New" | "Contacted" | "Converted" | "Closed";
  notes?: string;
  createdAt: string;
}

export interface CMSContent {
  topBarText: string;
  heroVisible: boolean;
  trustStripVisible: boolean;
  categoriesVisible: boolean;
  painAreaVisible: boolean;
  bestSellersVisible: boolean;
  postersVisible: boolean;
  activityVisible: boolean;
  brandBannerVisible: boolean;
  brandRangeVisible: boolean;
  testimonialsVisible: boolean;
  blogsVisible: boolean;
  seoTitle: string;
  seoDescription: string;
}

export interface FooterContent {
  description: string;
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  newsletterText: string;
  copyright: string;
  social: { facebook: string; instagram: string; youtube: string; linkedin: string };
}

export interface ContactInfo {
  businessName: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  hours: string;
  mapLink: string;
}

export interface PolicyPage {
  slug: string;
  title: string;
  content: string;
}