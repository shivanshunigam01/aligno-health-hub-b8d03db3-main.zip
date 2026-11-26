import { reviewService, productService, categoryService } from "./store";
import { enrichProducts } from "./productImages";
import type { Product, Review } from "./types";

function visibleProducts(): Product[] {
  const slugs = new Set(categoryService.list().filter((c) => c.enabled).map((c) => c.slug));
  return enrichProducts(productService.list().filter((p) => p.enabled !== false && slugs.has(p.category)));
}

export function enrichReviews(reviews: Review[], products: Product[]): Review[] {
  const byId = new Map(products.map((product) => [product.id, product]));
  return reviews.map((review) => {
    const product = byId.get(review.productId);
    const image = review.image || product?.images[0];
    return image && image !== review.image ? { ...review, image } : review;
  });
}

/** Approved testimonials for the homepage — featured first. */
export function getDisplayReviews(limit = 3): Review[] {
  const reviews = enrichReviews(reviewService.list(), visibleProducts());
  const featured = reviews.filter((review) => review.approved && review.featured);
  const pool = featured.length > 0 ? featured : reviews.filter((review) => review.approved);
  return pool.slice(0, limit);
}
