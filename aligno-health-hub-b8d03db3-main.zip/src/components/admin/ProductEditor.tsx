import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ASSETS } from "@/lib/assets";
import { apiProductUpdate } from "@/lib/api/bootstrap";
import { getCatalogProducts, getEnabledCategories } from "@/lib/catalog";
import { categoryService, productService, storeEmit, storeRead, storeWrite, uid, useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

const PLACEHOLDER = ASSETS.products.posture;

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function emptyProduct(categorySlug: string): Product {
  return {
    id: uid(),
    name: "New Product",
    slug: `new-product-${uid()}`,
    category: categorySlug,
    price: 1999,
    discountPrice: 1499,
    sku: `AL-${Math.floor(1000 + Math.random() * 8999)}`,
    stock: 25,
    images: [PLACEHOLDER],
    rating: 4.5,
    reviewCount: 0,
    sizes: ["S", "M", "L", "XL"],
    shortDescription: "",
    longDescription: "",
    benefits: ["Medical-grade premium materials", "Breathable, skin-friendly fabric"],
    specifications: { Material: "Neoprene / Spandex blend", Sizes: "S, M, L, XL" },
    careInstructions: ["Hand wash in cold water", "Air dry only"],
    enabled: true,
  };
}

export function ProductEditor() {
  const products = useStore(() => getCatalogProducts());
  const categories = useStore(() => categoryService.list());
  const enabledCategories = useMemo(() => getEnabledCategories(), [categories]);
  const [editingId, setEditingId] = useState<string | null>(products[0]?.id ?? null);
  const [draft, setDraft] = useState<Product | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [listFilter, setListFilter] = useState<"all" | "bestSeller" | "featured" | "newArrival">("all");

  const editing = products.find((p) => p.id === editingId);
  const form = draft ?? editing;
  const visibleProducts = useMemo(() => {
    if (listFilter === "all") return products;
    return products.filter((product) => product[listFilter]);
  }, [products, listFilter]);

  useEffect(() => {
    if (!editing) {
      setDraft(null);
      setDirty(false);
      setStatus(null);
      return;
    }
    setDraft({ ...editing });
    setDirty(false);
    setStatus(null);
  }, [editingId]);

  const patchDraft = (patch: Partial<Product>) => {
    setDraft((current) => (current ? { ...current, ...patch } : current));
    setDirty(true);
    setStatus(null);
  };

  const selectProduct = (id: string) => {
    if (dirty && !window.confirm("You have unsaved changes. Discard them and switch product?")) return;
    setEditingId(id);
  };

  const handleSave = async () => {
    if (!draft || !editingId) return;
    setSaving(true);
    setStatus(null);
    try {
      const items = storeRead<Product[]>("aligno_products", []);
      storeWrite(
        "aligno_products",
        items.map((p) => (p.id === editingId ? { ...p, ...draft } : p)),
      );
      storeEmit();

      await apiProductUpdate(editingId, draft);

      const saved = productService.byId(editingId);
      if (saved) setDraft({ ...saved });
      setDirty(false);
      setStatus({ type: "ok", text: "Product saved successfully." });
    } catch (err) {
      setStatus({
        type: "err",
        text: err instanceof Error ? err.message : "Could not save product. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const addProduct = () => {
    const defaultCat = enabledCategories[0]?.slug ?? categories.find((c) => c.enabled)?.slug ?? "orthopedic-supports";
    const p = emptyProduct(defaultCat);
    productService.add(p);
    setEditingId(p.id);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {enabledCategories.length > 0 && (
        <p className="lg:col-span-2 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-ink">
          <strong>Live catalog:</strong>{" "}
          {enabledCategories.map((c) => c.name).join(", ")} — only products in enabled categories appear on the shop.
          Add more categories under <strong>Categories</strong> when you are ready to expand.
        </p>
      )}
      <div className="rounded-2xl border border-border bg-white p-4">
        <button type="button" onClick={addProduct} className="mb-4 w-full rounded-full bg-gold py-2 text-sm font-bold text-ink">
          + Add Product
        </button>
        <div className="mb-3 flex flex-wrap gap-1">
          {([
            ["all", "All"],
            ["bestSeller", "Best Sellers"],
            ["featured", "Featured"],
            ["newArrival", "New"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setListFilter(key)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                listFilter === key ? "bg-ink text-white" : "bg-secondary text-ink hover:bg-gold/20"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="max-h-[70vh] space-y-1 overflow-y-auto">
          {visibleProducts.length === 0 ? (
            <p className="rounded-xl bg-secondary px-3 py-6 text-center text-xs text-muted-foreground">
              No products match this filter yet.
            </p>
          ) : (
            visibleProducts.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => selectProduct(p.id)}
                className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                  editingId === p.id ? "bg-gold/20 font-bold text-ink" : "hover:bg-secondary"
                }`}
              >
                <span className="line-clamp-1">{p.name}</span>
                <span className="mt-0.5 flex flex-wrap gap-1">
                  {p.bestSeller && <span className="rounded bg-gold/20 px-1.5 py-0.5 text-[10px] font-bold text-ink">Best</span>}
                  {p.featured && <span className="rounded bg-ink/10 px-1.5 py-0.5 text-[10px] font-bold text-ink">Featured</span>}
                  {p.newArrival && <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">New</span>}
                  {p.enabled === false && <span className="text-[10px] text-muted-foreground">(off)</span>}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {form ? (
        <div className="space-y-5 rounded-2xl border border-border bg-white p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black">Edit Product</h3>
              {dirty && <p className="text-xs font-semibold text-gold">Unsaved changes</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={!dirty || saving}
                className="rounded-lg bg-gold px-4 py-1.5 text-xs font-bold text-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  const enabled = form.enabled === false;
                  patchDraft({ enabled });
                  productService.update(form.id, { enabled });
                }}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold"
              >
                {form.enabled === false ? "Enable" : "Disable"}
              </button>
              <button
                type="button"
                onClick={() => {
                  productService.remove(form.id);
                  setEditingId(products.find((p) => p.id !== form.id)?.id ?? null);
                }}
                className="rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive"
              >
                Delete
              </button>
            </div>
          </div>

          {status && (
            <p
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                status.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
              }`}
            >
              {status.text}
            </p>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="font-bold">Product Name</span>
              <input
                className="mt-1 h-10 w-full rounded-xl border border-border px-3"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  patchDraft({ name, slug: slugify(name) });
                }}
              />
            </label>
            <label className="block text-sm">
              <span className="font-bold">Category</span>
              <select
                className="mt-1 h-10 w-full rounded-xl border border-border px-3"
                value={form.category}
                onChange={(e) => patchDraft({ category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}{c.enabled ? "" : " (hidden)"}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-bold">MRP (₹)</span>
              <input
                type="number"
                min={0}
                placeholder="Add MRP"
                className="mt-1 h-10 w-full rounded-xl border border-border px-3"
                value={form.price || ""}
                onChange={(e) => patchDraft({ price: e.target.value === "" ? 0 : Number(e.target.value) })}
              />
            </label>
            <label className="block text-sm">
              <span className="font-bold">Sale Price (₹)</span>
              <input
                type="number"
                min={0}
                placeholder="Add sale price"
                className="mt-1 h-10 w-full rounded-xl border border-border px-3"
                value={form.discountPrice || ""}
                onChange={(e) => patchDraft({ discountPrice: e.target.value === "" ? 0 : Number(e.target.value) })}
              />
            </label>
            <label className="block text-sm">
              <span className="font-bold">SKU</span>
              <input
                className="mt-1 h-10 w-full rounded-xl border border-border px-3"
                value={form.sku}
                onChange={(e) => patchDraft({ sku: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="font-bold">Stock</span>
              <input
                type="number"
                className="mt-1 h-10 w-full rounded-xl border border-border px-3"
                value={form.stock}
                onChange={(e) => patchDraft({ stock: Number(e.target.value) })}
              />
            </label>
          </div>

          <ImageUploadField
            label="Product Photos (multiple)"
            images={form.images}
            onChange={(images) => patchDraft({ images: images.length ? images : [PLACEHOLDER] })}
          />

          <label className="block text-sm">
            <span className="font-bold">Short Description</span>
            <textarea
              className="mt-1 min-h-20 w-full rounded-xl border border-border px-3 py-2"
              value={form.shortDescription}
              onChange={(e) => patchDraft({ shortDescription: e.target.value })}
            />
          </label>

          <label className="block text-sm">
            <span className="font-bold">Full Description</span>
            <textarea
              className="mt-1 min-h-32 w-full rounded-xl border border-border px-3 py-2"
              value={form.longDescription}
              onChange={(e) => patchDraft({ longDescription: e.target.value })}
            />
          </label>

          <div className="rounded-2xl border border-gold/30 bg-gold/5 p-4">
            <p className="text-sm font-black text-ink">Homepage visibility</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose where this product appears on the homepage. Save after toggling badges.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {([
                ["bestSeller", "Best Sellers", "Shown in the Best Sellers tab on the homepage."],
                ["featured", "Featured", "Shown in the Featured tab on the homepage."],
                ["newArrival", "New Arrivals", "Shown in the New Arrivals tab on the homepage."],
              ] as const).map(([field, label, help]) => (
                <button
                  key={field}
                  type="button"
                  onClick={() => patchDraft({ [field]: !form[field] })}
                  className={`rounded-xl border px-3 py-3 text-left transition ${
                    form[field] ? "border-gold bg-gold/15" : "border-border bg-white hover:border-gold/50"
                  }`}
                >
                  <span className="text-sm font-bold text-ink">{label}</span>
                  <span className="mt-1 block text-[11px] leading-snug text-muted-foreground">{help}</span>
                  <span className={`mt-2 inline-block text-xs font-bold ${form[field] ? "text-gold" : "text-muted-foreground"}`}>
                    {form[field] ? "Enabled" : "Off"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty || saving}
              className="rounded-full bg-gold px-8 py-2.5 text-sm font-bold text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Product"}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground">
          Select a product or add a new one.
        </div>
      )}
    </div>
  );
}
