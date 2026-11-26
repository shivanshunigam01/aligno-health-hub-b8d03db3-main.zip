import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { apiCategoryUpdate } from "@/lib/api/bootstrap";
import {
  AdminEditorShell,
  AdminFieldLabel,
  adminInputClassName,
  useAdminDraft,
} from "@/components/admin/admin-form";
import { AdminEmptyState } from "@/components/admin/admin-ui";
import { ASSETS } from "@/lib/assets";
import { categoryService, storeEmit, storeRead, storeWrite, uid, useStore } from "@/lib/store";
import type { Category } from "@/lib/types";
import { useState } from "react";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function emptyCategory(order: number): Category {
  return {
    id: uid(),
    name: "New Category",
    slug: `new-category-${uid()}`,
    subtitle: "",
    image: ASSETS.body.knee,
    order,
    enabled: false,
  };
}

export function CategoryEditor() {
  const categories = useStore(() => categoryService.list());
  const sorted = [...categories].sort((a, b) => a.order - b.order);
  const [editingId, setEditingId] = useState<string | null>(sorted[0]?.id ?? null);
  const editing = sorted.find((c) => c.id === editingId);
  const { draft, dirty, saving, status, patch, setDraft, confirmDiscard, runSave } = useAdminDraft(editing, editingId ?? "");

  const selectCategory = (id: string) => {
    if (!confirmDiscard()) return;
    setEditingId(id);
  };

  const handleSave = async () => {
    if (!draft || !editingId) return;
    await runSave(async () => {
      const items = storeRead<Category[]>("aligno_categories", []);
      storeWrite(
        "aligno_categories",
        items.map((c) => (c.id === editingId ? { ...c, ...draft } : c)),
      );
      storeEmit();
      await apiCategoryUpdate(editingId, draft);
      const saved = categoryService.byId(editingId);
      if (saved) setDraft({ ...saved });
    });
  };

  const addCategory = () => {
    const c = emptyCategory(sorted.length + 1);
    categoryService.add(c);
    setEditingId(c.id);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Only <strong>enabled</strong> categories and their products appear on the storefront.
      </p>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="rounded-2xl border border-border bg-white p-4">
          <button type="button" onClick={addCategory} className="mb-4 w-full rounded-full bg-gold py-2 text-sm font-bold text-ink">
            + Add Category
          </button>
          <div className="space-y-1">
            {sorted.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => selectCategory(c.id)}
                className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                  editingId === c.id ? "bg-gold/20 font-bold" : "hover:bg-secondary"
                }`}
              >
                {c.name}
                <span className={`ml-1 text-xs ${c.enabled ? "text-emerald-600" : "text-muted-foreground"}`}>
                  {c.enabled ? "• live" : "• hidden"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {draft ? (
          <AdminEditorShell
            title="Edit category"
            dirty={dirty}
            saving={saving}
            status={status}
            onSave={handleSave}
            saveLabel="Save Category"
            headerActions={
              <button
                type="button"
                onClick={() => {
                  categoryService.remove(draft.id);
                  setEditingId(sorted.find((c) => c.id !== draft.id)?.id ?? null);
                }}
                className="rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive"
              >
                Delete
              </button>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <AdminFieldLabel>
                Name
                <input
                  className={adminInputClassName()}
                  value={draft.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    patch({ name, slug: slugify(name) });
                  }}
                />
              </AdminFieldLabel>
              <AdminFieldLabel>
                Subtitle
                <input className={adminInputClassName()} value={draft.subtitle ?? ""} onChange={(e) => patch({ subtitle: e.target.value })} />
              </AdminFieldLabel>
              <AdminFieldLabel>
                Display order
                <input
                  type="number"
                  className={adminInputClassName()}
                  value={draft.order}
                  onChange={(e) => patch({ order: Number(e.target.value) })}
                />
              </AdminFieldLabel>
              <label className="flex items-center gap-2 self-end text-sm">
                <input type="checkbox" checked={draft.enabled} onChange={(e) => patch({ enabled: e.target.checked })} />
                <span className="font-semibold">Show on storefront</span>
              </label>
            </div>
            <ImageUploadField
              label="Category image"
              images={draft.image ? [draft.image] : []}
              onChange={(imgs) => patch({ image: imgs[0] ?? ASSETS.body.knee })}
              multiple={false}
            />
          </AdminEditorShell>
        ) : (
          <AdminEmptyState title="Select a category" description="Choose a category from the list or add a new one." />
        )}
      </div>
    </div>
  );
}
