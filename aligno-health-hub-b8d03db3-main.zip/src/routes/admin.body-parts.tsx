import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ListItemEditor, makeNamedItem } from "@/components/admin/ListItemEditor";
import { ASSETS } from "@/lib/assets";
import { bodyPartService, useStore } from "@/lib/store";
import type { BodyPart } from "@/lib/types";

export const Route = createFileRoute("/admin/body-parts")({ component: Page });

function Page() {
  const items = useStore(() => bodyPartService.list());
  return (
    <AdminLayout title="Body Parts">
      <ListItemEditor<BodyPart>
        title="Body Part"
        description="Images and labels for the Shop by Body Part section on the homepage."
        items={items}
        onAdd={bodyPartService.add}
        onUpdate={bodyPartService.update}
        onDelete={bodyPartService.remove}
        createItem={(name) => ({ ...makeNamedItem(name), image: ASSETS.body.knee } as BodyPart)}
      />
    </AdminLayout>
  );
}
