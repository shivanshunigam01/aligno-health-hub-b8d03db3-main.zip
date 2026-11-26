import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CategoryEditor } from "@/components/admin/CategoryEditor";

export const Route = createFileRoute("/admin/categories")({ component: Page });

function Page() {
  return (
    <AdminLayout title="Categories">
      <CategoryEditor />
    </AdminLayout>
  );
}
