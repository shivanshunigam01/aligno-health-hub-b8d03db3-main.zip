import { uid } from "@/lib/store";
import { useState } from "react";
import { AdminEmptyState, AdminPanel, AdminPanelBody, AdminPanelHeader } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

type BaseItem = { id: string; name?: string; title?: string; slug?: string; enabled?: boolean };

export function SimpleCrud<T extends BaseItem>({
  title,
  items,
  onAdd,
  onUpdate,
  onDelete,
}: {
  title: string;
  items: T[];
  onAdd: (item: T) => void;
  onUpdate: (id: string, patch: Partial<T>) => void;
  onDelete: (id: string) => void;
}) {
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({ id: uid(), name, title: name, slug: name.toLowerCase().replace(/\s+/g, "-"), enabled: true } as T);
    setName("");
  };

  return (
    <div className="space-y-4">
      <AdminPanel>
        <AdminPanelHeader title={`Add ${title}`} description={`Create a new ${title.toLowerCase()} item for the storefront.`} />
        <AdminPanelBody>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              className="h-10 flex-1 rounded-xl"
              placeholder={`Enter ${title.toLowerCase()} name`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button onClick={handleAdd} className="shrink-0 gap-1.5 rounded-full bg-gold font-bold text-ink hover:bg-gold/90">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </AdminPanelBody>
      </AdminPanel>

      <AdminPanel>
        <AdminPanelHeader title={`All ${title}`} description={`${items.length} item${items.length === 1 ? "" : "s"}`} />
        <AdminPanelBody className="pt-0">
          {items.length === 0 ? (
            <AdminEmptyState title={`No ${title.toLowerCase()} yet`} description="Add your first item above." />
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border border-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="min-w-0 font-medium">{item.name || item.title || item.slug || item.id}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {"enabled" in item && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdate(item.id, { enabled: !item.enabled } as Partial<T>)}
                        className="rounded-lg text-xs"
                      >
                        {item.enabled ? "Disable" : "Enable"}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(item.id)}
                      className="gap-1 rounded-lg text-xs text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminPanelBody>
      </AdminPanel>
    </div>
  );
}
