import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminFieldLabel, adminInputClassName } from "@/components/admin/admin-form";
import { ListItemEditor, makeNamedItem } from "@/components/admin/ListItemEditor";
import { ASSETS } from "@/lib/assets";
import { trustStripService, useStore } from "@/lib/store";
import type { TrustStripItem } from "@/lib/types";

export const Route = createFileRoute("/admin/trust-strip")({ component: Page });

function Page() {
  const items = useStore(() => trustStripService.list());
  return (
    <AdminLayout title="Trust Strip">
      <ListItemEditor<TrustStripItem>
        title="Trust Item"
        description="Scrolling trust badges below the hero on the homepage."
        items={items}
        showOrder
        onAdd={trustStripService.add}
        onUpdate={trustStripService.update}
        onDelete={trustStripService.remove}
        createItem={(name) =>
          ({
            ...makeNamedItem(name),
            subtitle: "",
            icon: "Sparkles",
            image: ASSETS.trust.shipping,
            order: items.length + 1,
          }) as TrustStripItem
        }
        renderExtraFields={(draft, patch) => (
          <div className="grid gap-4 md:grid-cols-2">
            <AdminFieldLabel>
              Subtitle
              <input
                className={adminInputClassName()}
                value={draft.subtitle}
                onChange={(e) => patch({ subtitle: e.target.value })}
              />
            </AdminFieldLabel>
            <AdminFieldLabel hint="Lucide icon name, e.g. Truck, ShieldCheck">
              Icon
              <input
                className={adminInputClassName()}
                value={draft.icon}
                onChange={(e) => patch({ icon: e.target.value })}
              />
            </AdminFieldLabel>
          </div>
        )}
      />
    </AdminLayout>
  );
}
