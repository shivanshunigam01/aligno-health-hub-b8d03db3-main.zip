import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  AdminEditorShell,
  AdminFieldLabel,
  adminInputClassName,
  useAdminDraft,
} from "@/components/admin/admin-form";
import { AdminEmptyState, AdminPanel, AdminPanelBody, AdminPanelHeader } from "@/components/admin/admin-ui";
import { apiBannerRemove, apiBannerSave } from "@/lib/api/bootstrap";
import { ASSETS } from "@/lib/assets";
import { bannerService, storeEmit, storeRead, storeWrite, uid, useStore } from "@/lib/store";
import type { Banner } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

function emptyBanner(order: number): Banner {
  return {
    id: uid(),
    title: "New Banner",
    subtitle: "",
    offer: "",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    image: ASSETS.hero.moveFreely,
    order,
    enabled: true,
    layout: "designed",
  };
}

export function BannerEditor() {
  const items = useStore(() => bannerService.list());
  const sorted = useMemo(() => [...items].sort((a, b) => a.order - b.order), [items]);
  const [editingId, setEditingId] = useState<string | null>(sorted[0]?.id ?? null);
  const editing = sorted.find((item) => item.id === editingId);
  const { draft, dirty, saving, status, patch, confirmDiscard, runSave } = useAdminDraft(editing, editingId ?? "");

  const selectItem = (id: string) => {
    if (!confirmDiscard()) return;
    setEditingId(id);
  };

  const handleSave = () => {
    if (!draft || !editingId) return;
    runSave(async () => {
      const items = storeRead<Banner[]>("aligno_banners", []);
      storeWrite(
        "aligno_banners",
        items.map((banner) => (banner.id === editingId ? { ...banner, ...draft } : banner)),
      );
      storeEmit();

      const saved = await apiBannerSave({ ...draft, id: editingId });
      if (saved.id !== editingId) {
        const next = (storeRead<Banner[]>("aligno_banners") || []).map((banner) =>
          banner.id === editingId ? saved : banner,
        );
        storeWrite("aligno_banners", next);
        storeEmit();
        setEditingId(saved.id);
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <AdminPanel className="h-fit">
        <AdminPanelHeader
          title="Hero banners"
          description="Slides on the homepage hero carousel. Images upload to Cloudinary."
          action={
            <Button
              size="sm"
              className="gap-1 rounded-full bg-gold font-bold text-ink"
              onClick={() => {
                const banner = emptyBanner(sorted.length + 1);
                bannerService.add(banner);
                setEditingId(banner.id);
              }}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          }
        />
        <AdminPanelBody className="max-h-[70vh] space-y-1 overflow-y-auto pt-0">
          {sorted.map((banner) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => selectItem(banner.id)}
              className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                editingId === banner.id ? "bg-gold/20 font-bold" : "hover:bg-secondary"
              }`}
            >
              {banner.title}
              {banner.enabled === false && <span className="ml-1 text-xs text-muted-foreground">(off)</span>}
            </button>
          ))}
        </AdminPanelBody>
      </AdminPanel>

      {draft ? (
        <AdminEditorShell
          title="Edit banner"
          dirty={dirty}
          saving={saving}
          status={status}
          onSave={handleSave}
          saveLabel="Save Banner"
          headerActions={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg text-xs text-destructive"
              onClick={() => {
                if (!confirmDiscard("Discard changes and delete this banner?")) return;
                const bannerId = draft.id;
                const removeLocal = () => {
                  bannerService.remove(bannerId);
                  setEditingId(sorted.find((item) => item.id !== bannerId)?.id ?? null);
                };
                if (/^[0-9a-fA-F]{24}$/.test(bannerId)) {
                  void apiBannerRemove(bannerId)
                    .then(removeLocal)
                    .catch((err) => console.error(err));
                } else {
                  removeLocal();
                }
              }}
            >
              Delete
            </Button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AdminFieldLabel>
              Title
              <input className={adminInputClassName()} value={draft.title} onChange={(e) => patch({ title: e.target.value })} />
            </AdminFieldLabel>
            <AdminFieldLabel>
              Subtitle
              <input className={adminInputClassName()} value={draft.subtitle ?? ""} onChange={(e) => patch({ subtitle: e.target.value })} />
            </AdminFieldLabel>
            <AdminFieldLabel>
              Offer badge
              <input className={adminInputClassName()} value={draft.offer ?? ""} onChange={(e) => patch({ offer: e.target.value })} />
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
            <AdminFieldLabel>
              CTA text
              <input className={adminInputClassName()} value={draft.ctaText} onChange={(e) => patch({ ctaText: e.target.value })} />
            </AdminFieldLabel>
            <AdminFieldLabel>
              CTA link
              <input className={adminInputClassName()} value={draft.ctaLink} onChange={(e) => patch({ ctaLink: e.target.value })} />
            </AdminFieldLabel>
            <AdminFieldLabel>
              Layout
              <select
                className={adminInputClassName()}
                value={draft.layout ?? "designed"}
                onChange={(e) => patch({ layout: e.target.value as Banner["layout"] })}
              >
                <option value="designed">Designed (text in image)</option>
                <option value="overlay">Overlay (text on photo)</option>
              </select>
            </AdminFieldLabel>
            <label className="flex items-center gap-2 self-end text-sm">
              <input type="checkbox" checked={draft.enabled !== false} onChange={(e) => patch({ enabled: e.target.checked })} />
              <span className="font-semibold">Visible on homepage</span>
            </label>
          </div>
          <ImageUploadField
            label="Banner image (recommended: 2560×900 px or wider)"
            uploadFolder="aligno/banners"
            images={draft.image ? [draft.image] : []}
            onChange={(images) => patch({ image: images[0] ?? ASSETS.hero.moveFreely })}
            multiple={false}
          />
        </AdminEditorShell>
      ) : (
        <AdminEmptyState title="Select a banner" description="Add or choose a hero slide to edit." />
      )}
    </div>
  );
}
