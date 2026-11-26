import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminFieldLabel, adminInputClassName } from "@/components/admin/admin-form";
import { ListItemEditor, makeNamedItem } from "@/components/admin/ListItemEditor";
import { ASSETS } from "@/lib/assets";
import { posterService, useStore } from "@/lib/store";
import type { Poster } from "@/lib/types";

export const Route = createFileRoute("/admin/posters")({ component: Page });

function Page() {
  const items = useStore(() => posterService.list());
  return (
    <AdminLayout title="Posters">
      <ListItemEditor<Poster>
        title="Poster"
        description="Large promotional cards on the homepage."
        items={items}
        onAdd={posterService.add}
        onUpdate={posterService.update}
        onDelete={posterService.remove}
        createItem={(name) =>
          ({
            ...makeNamedItem(name),
            ctaText: "Shop Now",
            ctaLink: "/shop",
            image: ASSETS.posters.stayCool,
          }) as Poster
        }
        renderExtraFields={(draft, patch) => (
          <div className="grid gap-4 md:grid-cols-2">
            <AdminFieldLabel>
              CTA text
              <input
                className={adminInputClassName()}
                value={draft.ctaText}
                onChange={(e) => patch({ ctaText: e.target.value })}
              />
            </AdminFieldLabel>
            <AdminFieldLabel>
              CTA link
              <input
                className={adminInputClassName()}
                value={draft.ctaLink}
                onChange={(e) => patch({ ctaLink: e.target.value })}
              />
            </AdminFieldLabel>
          </div>
        )}
      />
    </AdminLayout>
  );
}
