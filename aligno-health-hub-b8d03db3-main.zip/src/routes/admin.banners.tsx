import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { BannerEditor } from "@/components/admin/BannerEditor";

export const Route = createFileRoute("/admin/banners")({ component: Page });
function Page() {
  return (
    <AdminLayout title="Hero Banners">
      <BannerEditor />
    </AdminLayout>
  );
}
