import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ReviewEditor } from "@/components/admin/ReviewEditor";

export const Route = createFileRoute("/admin/reviews")({ component: Page });

function Page() {
  return (
    <AdminLayout title="Reviews">
      <p className="mb-4 text-sm text-muted-foreground">
        Add and approve customer reviews — approved reviews appear on the product page for shoppers.
      </p>
      <ReviewEditor />
    </AdminLayout>
  );
}
