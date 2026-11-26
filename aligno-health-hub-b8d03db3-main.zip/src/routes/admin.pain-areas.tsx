import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ListItemEditor, makeNamedItem } from "@/components/admin/ListItemEditor";
import { ASSETS } from "@/lib/assets";
import { painAreaService, useStore } from "@/lib/store";
import type { PainArea } from "@/lib/types";

export const Route = createFileRoute("/admin/pain-areas")({ component: Page });

function Page() {
  const items = useStore(() => painAreaService.list());
  return (
    <AdminLayout title="Pain Areas">
      <ListItemEditor<PainArea>
        title="Pain Area"
        description="Cards in the Locate Your Pain Area section on the homepage."
        items={items}
        onAdd={painAreaService.add}
        onUpdate={painAreaService.update}
        onDelete={painAreaService.remove}
        createItem={(name) => ({ ...makeNamedItem(name), image: ASSETS.body.back } as PainArea)}
      />
    </AdminLayout>
  );
}
