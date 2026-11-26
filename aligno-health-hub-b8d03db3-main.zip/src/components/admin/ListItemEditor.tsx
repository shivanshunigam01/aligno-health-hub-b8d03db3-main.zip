import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  AdminEditorShell,
  AdminFieldLabel,
  adminInputClassName,
  useAdminDraft,
} from "@/components/admin/admin-form";
import { AdminEmptyState, AdminPanel, AdminPanelBody, AdminPanelHeader } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uid } from "@/lib/store";
import { Plus } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

type ListItem = {
  id: string;
  name?: string;
  title?: string;
  slug?: string;
  image?: string;
  enabled?: boolean;
  order?: number;
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function itemLabel(item: ListItem) {
  return item.name || item.title || item.slug || item.id;
}

export function ListItemEditor<T extends ListItem>({
  title,
  items,
  description,
  onAdd,
  onUpdate,
  onDelete,
  createItem,
  showImage = true,
  showOrder = false,
  renderExtraFields,
}: {
  title: string;
  items: T[];
  description?: string;
  onAdd: (item: T) => void;
  onUpdate: (id: string, patch: Partial<T>) => void;
  onDelete: (id: string) => void;
  createItem: (name: string) => T;
  showImage?: boolean;
  showOrder?: boolean;
  renderExtraFields?: (draft: T, patch: (partial: Partial<T>) => void) => ReactNode;
}) {
  const sorted = useMemo(
    () => [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || itemLabel(a).localeCompare(itemLabel(b))),
    [items],
  );
  const [editingId, setEditingId] = useState<string | null>(sorted[0]?.id ?? null);
  const [newName, setNewName] = useState("");
  const editing = sorted.find((item) => item.id === editingId);
  const { draft, dirty, saving, status, patch, confirmDiscard, runSave } = useAdminDraft(editing, editingId ?? "");

  const selectItem = (id: string) => {
    if (!confirmDiscard()) return;
    setEditingId(id);
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    const item = createItem(newName.trim());
    onAdd(item);
    setNewName("");
    setEditingId(item.id);
  };

  const handleSave = () => {
    if (!draft || !editingId) return;
    runSave(async () => {
      onUpdate(editingId, draft);
    });
  };

  const displayName = draft?.name ?? draft?.title ?? "";

  return (
    <div className="space-y-4">
      {description && <p className="text-sm text-muted-foreground">{description}</p>}

      <AdminPanel>
        <AdminPanelHeader title={`Add ${title}`} description={`Create a new ${title.toLowerCase()} entry.`} />
        <AdminPanelBody>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              className="h-10 flex-1 rounded-xl"
              placeholder={`${title} name`}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button onClick={handleAdd} className="shrink-0 gap-1.5 rounded-full bg-gold font-bold text-ink hover:bg-gold/90">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </AdminPanelBody>
      </AdminPanel>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <AdminPanel className="h-fit">
          <AdminPanelHeader title={`All ${title}`} description={`${sorted.length} item${sorted.length === 1 ? "" : "s"}`} />
          <AdminPanelBody className="max-h-[70vh] space-y-1 overflow-y-auto pt-0">
            {sorted.length === 0 ? (
              <AdminEmptyState title={`No ${title.toLowerCase()} yet`} description="Add your first item above." />
            ) : (
              sorted.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectItem(item.id)}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                    editingId === item.id ? "bg-gold/20 font-bold text-ink" : "hover:bg-secondary"
                  }`}
                >
                  {itemLabel(item)}
                  {item.enabled === false && <span className="ml-1 text-xs text-muted-foreground">(hidden)</span>}
                </button>
              ))
            )}
          </AdminPanelBody>
        </AdminPanel>

        {draft ? (
          <AdminEditorShell
            title={`Edit ${title}`}
            dirty={dirty}
            saving={saving}
            status={status}
            onSave={handleSave}
            saveLabel={`Save ${title}`}
            headerActions={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg text-xs text-destructive hover:text-destructive"
                onClick={() => {
                  if (!confirmDiscard("Discard unsaved changes and delete this item?")) return;
                  onDelete(draft.id);
                  setEditingId(sorted.find((item) => item.id !== draft.id)?.id ?? null);
                }}
              >
                Delete
              </Button>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <AdminFieldLabel>
                Name
                <input
                  className={adminInputClassName()}
                  value={displayName}
                  onChange={(e) => {
                    const value = e.target.value;
                    patch({ name: value, title: value, slug: slugify(value) } as Partial<T>);
                  }}
                />
              </AdminFieldLabel>
              <AdminFieldLabel hint="Used in URLs">
                Slug
                <input
                  className={adminInputClassName()}
                  value={draft.slug ?? ""}
                  onChange={(e) => patch({ slug: slugify(e.target.value) } as Partial<T>)}
                />
              </AdminFieldLabel>
              {showOrder && (
                <AdminFieldLabel>
                  Display order
                  <input
                    type="number"
                    className={adminInputClassName()}
                    value={draft.order ?? 0}
                    onChange={(e) => patch({ order: Number(e.target.value) } as Partial<T>)}
                  />
                </AdminFieldLabel>
              )}
              {"enabled" in draft && (
                <label className="flex items-center gap-2 self-end text-sm">
                  <input
                    type="checkbox"
                    checked={draft.enabled !== false}
                    onChange={(e) => patch({ enabled: e.target.checked } as Partial<T>)}
                  />
                  <span className="font-semibold">Visible on storefront</span>
                </label>
              )}
            </div>

            {showImage && (
              <ImageUploadField
                label="Image"
                images={draft.image ? [draft.image] : []}
                onChange={(images) => patch({ image: images[0] ?? "" } as Partial<T>)}
                multiple={false}
              />
            )}

            {renderExtraFields?.(draft, patch)}
          </AdminEditorShell>
        ) : (
          <AdminEmptyState title={`Select a ${title.toLowerCase()}`} description="Choose an item from the list or add a new one." />
        )}
      </div>
    </div>
  );
}

export function makeNamedItem(name: string, extra: Partial<ListItem> = {}): ListItem {
  return {
    id: uid(),
    name,
    title: name,
    slug: slugify(name),
    enabled: true,
    ...extra,
  };
}
