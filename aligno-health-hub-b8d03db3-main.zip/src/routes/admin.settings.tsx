import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/settings")({ component: Page });
function Page() {
  return (
    <AdminLayout title="Settings">
      <div className="rounded-2xl border border-border bg-white p-6">
        <p className="font-bold">Admin Credentials</p>
        <p className="mt-2 text-sm text-muted-foreground">Demo login: admin@example.com / admin123</p>
        <p className="mt-6 font-bold">System</p>
        <p className="mt-2 text-sm text-muted-foreground">All data in this demo is stored in browser localStorage for easy backend migration later.</p>
      </div>
    </AdminLayout>
  );
}
