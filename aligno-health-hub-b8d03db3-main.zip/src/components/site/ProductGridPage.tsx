import { ProductCard } from "@/components/site/ProductCard";
import { getVisibleProducts } from "@/lib/catalog";
import { productService, useStore } from "@/lib/store";
import { useMemo, useState } from "react";

interface ProductGridPageProps {
  title: string;
  subtitle?: string;
  filter: (product: ReturnType<typeof productService.list>[number]) => boolean;
}

export function ProductGridPage({ title, subtitle, filter }: ProductGridPageProps) {
  const products = useStore(() => getVisibleProducts());
  const all = useMemo(() => products, [products]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("popular");

  const items = useMemo(() => {
    let rows = all
      .filter(filter)
      .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.shortDescription.toLowerCase().includes(q.toLowerCase()));

    if (sort === "low") rows = [...rows].sort((a, b) => a.discountPrice - b.discountPrice);
    if (sort === "high") rows = [...rows].sort((a, b) => b.discountPrice - a.discountPrice);
    if (sort === "newest") rows = [...rows].sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
    return rows;
  }, [all, filter, q, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-black md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="h-11 w-full rounded-full border border-border bg-secondary px-5 text-sm outline-none focus:border-gold"
          />
        </label>
        <label>
          <span className="sr-only">Sort products</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
            className="h-11 w-full min-w-[10rem] rounded-full border border-border bg-white px-5 text-sm sm:w-auto"
          >
          <option value="popular">Sort: Popular</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
        </label>
      </div>
      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground">
          No products found for this selection.
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
