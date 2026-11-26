import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/site/ProductCard";
import { getEnabledCategories, getVisibleProducts } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { useMemo, useState } from "react";

import { pageHead, PUBLIC_ROUTE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/_site/shop")({
  head: () => pageHead(PUBLIC_ROUTE_SEO["/shop"]),
  component: ShopPage,
});

function ShopPage() {
  const all = useStore(() => getVisibleProducts());
  const categories = useStore(() => getEnabledCategories());
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("popular");
  const [cat, setCat] = useState("all");
  const [stock, setStock] = useState("all");
  const items = useMemo(() => {
    let r = all.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    if (cat !== "all") r = r.filter((p) => p.category === cat);
    if (stock !== "all") r = r.filter((p) => (stock === "in" ? p.stock > 0 : p.stock <= 0));
    if (sort === "low") r = [...r].sort((a, b) => a.discountPrice - b.discountPrice);
    if (sort === "high") r = [...r].sort((a, b) => b.discountPrice - a.discountPrice);
    if (sort === "newest") r = [...r].sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
    return r;
  }, [all, q, sort, cat, stock]);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-black md:text-4xl">
        {categories.length === 1 ? categories[0].name : "All Products"}
      </h1>
      {categories.length === 1 && (
        <p className="mt-2 text-muted-foreground">{categories[0].subtitle ?? "Browse our orthopedic support range."}</p>
      )}
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." className="h-11 flex-1 rounded-full border border-border bg-secondary px-5 text-sm outline-none focus:border-gold md:col-span-2" />
        {categories.length > 1 && (
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-11 rounded-full border border-border bg-white px-5 text-sm">
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
        )}
        <select value={stock} onChange={(e) => setStock(e.target.value)} className="h-11 rounded-full border border-border bg-white px-5 text-sm">
          <option value="all">Availability</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-11 rounded-full border border-border bg-white px-5 text-sm">
          <option value="popular">Sort: Popular</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}