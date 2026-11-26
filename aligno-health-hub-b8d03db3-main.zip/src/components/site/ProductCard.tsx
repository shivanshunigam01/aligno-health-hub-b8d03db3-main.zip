import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { useCart, formatINR } from "@/lib/cart";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const toggleWish = useCart((s) => s.toggleWish);
  const wished = useCart((s) => s.wishlist.includes(product.id));
  const off = product.price > 0 ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const hasPrice = product.discountPrice > 0;
  const gallery = product.images.filter(Boolean).slice(0, 3);
  const [activeImg, setActiveImg] = useState(0);
  const safeIndex = Math.min(activeImg, Math.max(0, gallery.length - 1));
  const currentSrc = gallery[safeIndex] ?? gallery[0];
  const isPackshot = currentSrc?.endsWith(".png");

  const showPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImg((i) => (i - 1 + gallery.length) % gallery.length);
  };

  const showNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImg((i) => (i + 1) % gallery.length);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition hover:shadow-xl">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className={`relative block aspect-square overflow-hidden ${isPackshot ? "bg-ink" : "bg-secondary"}`}
      >
        <img
          src={currentSrc}
          alt={product.name}
          loading="lazy"
          decoding="async"
          width={400}
          height={400}
          className={`h-full w-full transition duration-500 group-hover:scale-105 ${isPackshot ? "object-contain p-3" : "object-cover"}`}
        />
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous product image"
              className="absolute left-2 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow transition group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next product image"
              className="absolute right-2 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow transition group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImg(i);
                  }}
                  aria-label={`Show image ${i + 1} of ${gallery.length}`}
                  aria-current={i === safeIndex}
                  className={`h-1.5 rounded-full transition-all ${i === safeIndex ? "w-4 bg-gold" : "w-1.5 bg-white/80"}`}
                />
              ))}
            </div>
          </>
        )}
        {off > 0 && <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-extrabold text-ink">{off}% OFF</span>}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); toggleWish(product.id); }}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wished}
          className={`absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full backdrop-blur ${wished ? "bg-gold text-ink" : "bg-white/90 text-ink hover:bg-gold"}`}
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
        </button>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-gold text-gold" aria-hidden /> {product.rating.toFixed(1)} ({product.reviewCount})
        </div>
        <Link to="/product/$slug" params={{ slug: product.slug }} className="line-clamp-2 text-sm font-semibold leading-snug hover:text-gold">{product.name}</Link>
        <div className="mt-2 flex items-baseline gap-2">
          {hasPrice ? (
            <>
              <span className="text-base font-bold text-ink">{formatINR(product.discountPrice)}</span>
              {product.price > product.discountPrice && <span className="text-xs text-muted-foreground line-through">{formatINR(product.price)}</span>}
            </>
          ) : (
            <span className="text-sm font-semibold text-muted-foreground">Price on request</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => add(product.id, 1)}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-ink py-2 text-xs font-bold text-ink transition hover:bg-ink hover:text-white"
        >
          <ShoppingBag className="h-3.5 w-3.5" aria-hidden /> Add to Cart
        </button>
      </div>
    </div>
  );
}