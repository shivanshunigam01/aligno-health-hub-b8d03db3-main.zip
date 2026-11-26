import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ListItemEditor, makeNamedItem } from "@/components/admin/ListItemEditor";
import { ASSETS } from "@/lib/assets";
import { activityService, useStore } from "@/lib/store";
import type { Activity } from "@/lib/types";

export const Route = createFileRoute("/admin/activities")({ component: Page });

function Page() {
  const items = useStore(() => activityService.list());
  return (
    <AdminLayout title="Activities">
      <ListItemEditor<Activity>
        title="Activity"
        description="Shop by Activity tiles shown on the storefront."
        items={items}
        onAdd={activityService.add}
        onUpdate={activityService.update}
        onDelete={activityService.remove}
        createItem={(name) => ({ ...makeNamedItem(name), image: ASSETS.lifestyle.running } as Activity)}
      />
    </AdminLayout>
  );
}
