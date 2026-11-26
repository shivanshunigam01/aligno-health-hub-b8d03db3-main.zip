import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/site/ProductCard";
import { useCart } from "@/lib/cart";
import { productService, useStore } from "@/lib/store";
import { pageHead, PUBLIC_ROUTE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/_site/wishlist")({
  head: () => pageHead(PUBLIC_ROUTE_SEO["/wishlist"]),
  component: WishlistPage,
});

function WishlistPage() {
  const wishlist = useCart((s) => s.wishlist);
  const products = useStore(() => productService.list());
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-black">Wishlist</h1>
      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-white p-12 text-center text-sm text-muted-foreground">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
