import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  AdminEditorShell,
  AdminFieldLabel,
  adminInputClassName,
  adminTextareaClassName,
  useAdminDraft,
} from "@/components/admin/admin-form";
import { AdminEmptyState } from "@/components/admin/admin-ui";
import { apiReviewRemove, apiReviewSave } from "@/lib/api/bootstrap";
import { getVisibleProducts } from "@/lib/catalog";
import { productService, reviewService, storeEmit, storeRead, storeWrite, uid, useStore } from "@/lib/store";
import type { Review } from "@/lib/types";
import { useState } from "react";

function emptyReview(productId: string): Review {
  return {
    id: uid(),
    customerName: "",
    productId,
    rating: 5,
    text: "",
    approved: false,
    featured: false,
    date: new Date().toISOString().slice(0, 10),
  };
}

export function ReviewEditor() {
  const reviews = useStore(() => reviewService.list());
  const products = useStore(() => getVisibleProducts());
  const [editingId, setEditingId] = useState<string | null>(reviews[0]?.id ?? null);
  const editing = reviews.find((r) => r.id === editingId);
  const { draft, dirty, saving, status, patch, confirmDiscard, runSave } = useAdminDraft(editing, editingId ?? "");

  const syncProductRating = (productId: string) => {
    const approved = reviewService.list().filter((r) => r.productId === productId && r.approved);
    if (approved.length === 0) {
      productService.update(productId, { rating: 0, reviewCount: 0 });
      return;
    }
    const avg = approved.reduce((s, r) => s + r.rating, 0) / approved.length;
    productService.update(productId, { rating: Math.round(avg * 10) / 10, reviewCount: approved.length });
  };

  const selectReview = (id: string) => {
    if (!confirmDiscard()) return;
    setEditingId(id);
  };

  const handleSave = () => {
    if (!draft || !editingId) return;
    runSave(async () => {
      const items = storeRead<Review[]>("aligno_reviews", []);
      storeWrite(
        "aligno_reviews",
        items.map((review) => (review.id === editingId ? { ...review, ...draft } : review)),
      );
      storeEmit();

      const saved = await apiReviewSave({ ...draft, id: editingId });
      if (saved.id !== editingId) {
        const next = (storeRead<Review[]>("aligno_reviews") || []).map((review) =>
          review.id === editingId ? saved : review,
        );
        storeWrite("aligno_reviews", next);
        storeEmit();
        setEditingId(saved.id);
      }
      syncProductRating(saved.productId);
    });
  };

  const addReview = () => {
    const productId = products[0]?.id;
    if (!productId) return;
    const r = emptyReview(productId);
    reviewService.add(r);
    setEditingId(r.id);
  };

  const productName = (id: string) => products.find((p) => p.id === id)?.name ?? id;

  if (products.length === 0) {
    return (
      <AdminEmptyState
        title="No products available"
        description="Add products in an enabled category first, then you can attach reviews."
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="rounded-2xl border border-border bg-white p-4">
        <button type="button" onClick={addReview} className="mb-4 w-full rounded-full bg-gold py-2 text-sm font-bold text-ink">
          + Add Review
        </button>
        <div className="max-h-[70vh] space-y-1 overflow-y-auto">
          {reviews.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => selectReview(r.id)}
              className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                editingId === r.id ? "bg-gold/20 font-bold" : "hover:bg-secondary"
              }`}
            >
              {r.customerName || "Unnamed"} — {productName(r.productId)}
              {!r.approved && <span className="text-xs text-muted-foreground"> (pending)</span>}
            </button>
          ))}
        </div>
      </div>

      {draft ? (
        <AdminEditorShell
          title="Edit review"
          dirty={dirty}
          saving={saving}
          status={status}
          onSave={handleSave}
          saveLabel="Save Review"
          headerActions={
            <button
              type="button"
              onClick={() => {
                if (!confirmDiscard("Discard changes and delete this review?")) return;
                const pid = draft.productId;
                const reviewId = draft.id;
                const removeLocal = () => {
                  reviewService.remove(reviewId);
                  syncProductRating(pid);
                  setEditingId(reviews.find((review) => review.id !== reviewId)?.id ?? null);
                };
                if (/^[0-9a-fA-F]{24}$/.test(reviewId)) {
                  void apiReviewRemove(reviewId)
                    .then(removeLocal)
                    .catch((err) => console.error(err));
                } else {
                  removeLocal();
                }
              }}
              className="rounded-lg border border-destructive/40 px-3 py-1.5 text-xs text-destructive"
            >
              Delete
            </button>
          }
        >
          <AdminFieldLabel>
            Product
            <select
              className={adminInputClassName()}
              value={draft.productId}
              onChange={(e) => patch({ productId: e.target.value })}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </AdminFieldLabel>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminFieldLabel>
              Customer name
              <input className={adminInputClassName()} value={draft.customerName} onChange={(e) => patch({ customerName: e.target.value })} />
            </AdminFieldLabel>
            <AdminFieldLabel>
              Rating
              <select className={adminInputClassName()} value={draft.rating} onChange={(e) => patch({ rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} stars
                  </option>
                ))}
              </select>
            </AdminFieldLabel>
          </div>

          <AdminFieldLabel>
            Review text
            <textarea className={adminTextareaClassName()} value={draft.text} onChange={(e) => patch({ text: e.target.value })} />
          </AdminFieldLabel>

          <AdminFieldLabel>
            Date
            <input type="date" className={adminInputClassName()} value={draft.date} onChange={(e) => patch({ date: e.target.value })} />
          </AdminFieldLabel>

          <ImageUploadField
            label="Customer photo (optional)"
            images={draft.image ? [draft.image] : []}
            onChange={(imgs) => patch({ image: imgs[0] })}
            multiple={false}
          />

          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={draft.approved} onChange={(e) => patch({ approved: e.target.checked })} />
              Approved (visible on product page)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={draft.featured} onChange={(e) => patch({ featured: e.target.checked })} />
              Featured on homepage
            </label>
          </div>
        </AdminEditorShell>
      ) : (
        <AdminEmptyState title="Select a review" description="Choose a review from the list or add a new one." />
      )}
    </div>
  );
}
