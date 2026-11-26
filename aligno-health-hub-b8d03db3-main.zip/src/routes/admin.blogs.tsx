import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { BlogEditor } from "@/components/admin/BlogEditor";

export const Route = createFileRoute("/admin/blogs")({ component: Page });
function Page() {
  return (
    <AdminLayout title="Blogs">
      <BlogEditor />
    </AdminLayout>
  );
}
