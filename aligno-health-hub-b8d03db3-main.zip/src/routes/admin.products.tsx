import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products")({ component: AdminProductsPage });

function AdminProductsPage() {
  return (
    <AdminLayout title="Products">
      <p className="mb-4 text-sm text-muted-foreground">
        Manage orthopedic support products — upload multiple photos, edit descriptions, and assign categories.
      </p>
      <ProductEditor />
    </AdminLayout>
  );
}
