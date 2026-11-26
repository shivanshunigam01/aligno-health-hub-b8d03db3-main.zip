import { ASSETS } from "./assets";

export const SITE_NAME = "Aligno Health Hub";
export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") || "https://aligno.in";
export const DEFAULT_DESCRIPTION =
  "Shop medical-grade orthopedic supports, braces, belts, and daily comfort products engineered for recovery and movement.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}${ASSETS.hero.moveFreely}`;

export function slugToTitle(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

type PageHeadOptions = {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
  robots?: string;
  noindex?: boolean;
};

/** TanStack Router head() helper — unique title, description, canonical, OG, Twitter */
export function pageHead({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  ogImage = DEFAULT_OG_IMAGE,
  robots,
  noindex = false,
}: PageHeadOptions) {
  const fullTitle = title.includes("Aligno") ? title : `${title} — Aligno`;
  const canonical = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const robotsContent = robots ?? (noindex ? "noindex, nofollow" : "index, follow");

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { name: "robots", content: robotsContent },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { property: "og:image", content: ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}` },
      { property: "og:site_name", content: SITE_NAME },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}` },
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}

export const PUBLIC_ROUTE_SEO: Record<string, PageHeadOptions> = {
  "/": {
    title: "Aligno — Premium Orthopedic Supports & Daily Comfort",
    description: DEFAULT_DESCRIPTION,
    path: "/",
    ogImage: ASSETS.hero.moveFreely,
  },
  "/shop": {
    title: "Shop All Products",
    description: "Browse all Aligno orthopedic supports, braces, belts, and daily comfort products.",
    path: "/shop",
  },
  "/about": {
    title: "About Us",
    description: "Learn about Aligno — premium orthopedic and daily-support products for recovery, movement, and comfort.",
    path: "/about",
  },
  "/contact": {
    title: "Contact Us",
    description: "Get in touch with Aligno customer support for orders, sizing help, and product questions.",
    path: "/contact",
  },
  "/faq": {
    title: "FAQ",
    description: "Frequently asked questions about Aligno orders, shipping, returns, sizing, and product care.",
    path: "/faq",
  },
  "/blogs": {
    title: "Blog",
    description: "Orthopedic wellness tips, recovery guides, and product advice from Aligno.",
    path: "/blogs",
  },
  "/cart": {
    title: "Shopping Cart",
    description: "Review items in your Aligno cart before checkout.",
    path: "/cart",
    noindex: true,
  },
  "/checkout": {
    title: "Checkout",
    description: "Complete your Aligno order securely.",
    path: "/checkout",
    noindex: true,
  },
  "/wishlist": {
    title: "Wishlist",
    description: "Your saved Aligno products.",
    path: "/wishlist",
    noindex: true,
  },
  "/login": {
    title: "Login",
    description: "Sign in to your Aligno account.",
    path: "/login",
    noindex: true,
  },
  "/register": {
    title: "Create Account",
    description: "Register for an Aligno account to track orders and checkout faster.",
    path: "/register",
    noindex: true,
  },
  "/account": {
    title: "My Account",
    description: "Manage your Aligno account settings.",
    path: "/account",
    noindex: true,
  },
  "/orders": {
    title: "My Orders",
    description: "View your Aligno order history.",
    path: "/orders",
    noindex: true,
  },
  "/my-orders": {
    title: "My Orders",
    description: "View your Aligno order history.",
    path: "/my-orders",
    noindex: true,
  },
  "/track-order": {
    title: "Track Order",
    description: "Track your Aligno order status with your order ID.",
    path: "/track-order",
  },
  "/order-success": {
    title: "Order Confirmed",
    description: "Your Aligno order has been placed successfully.",
    path: "/order-success",
    noindex: true,
  },
  "/daily-support": {
    title: "Daily Support Products",
    description: "Shop Aligno daily support products for office, travel, and everyday comfort.",
    path: "/daily-support",
  },
};

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${ASSETS.logo}`,
    email: "hello@aligno.in",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-98000-11122",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function productSchema(product: {
  name: string;
  slug: string;
  shortDescription: string;
  images: string[];
  discountPrice: number;
  price: number;
  sku: string;
  rating: number;
  reviewCount: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.filter(Boolean),
    sku: product.sku,
    url: `${SITE_URL}/product/${product.slug}`,
    brand: { "@type": "Brand", name: "Aligno" },
    ...(product.discountPrice > 0
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: product.discountPrice,
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/product/${product.slug}`,
          },
        }
      : {}),
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };
}

export function faqSchema(items: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
