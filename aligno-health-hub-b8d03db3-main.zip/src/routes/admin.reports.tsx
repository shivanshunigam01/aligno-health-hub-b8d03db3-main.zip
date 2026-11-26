import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminStatCard } from "@/components/admin/admin-ui";
import { activityService, categoryService, leadService, orderService, productService } from "@/lib/store";
import { Activity, BarChart3, FolderTree, Package, ShoppingCart, Users, UserPlus, Warehouse } from "lucide-react";

export const Route = createFileRoute("/admin/reports")({ component: Page });

function Page() {
  const orders = orderService.list();
  const products = productService.list();

  return (
    <AdminLayout title="Reports">
      <p className="mb-4 text-sm text-muted-foreground">Overview of store performance and inventory health.</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AdminStatCard
          label="Sales Report"
          value={`₹${orders.reduce((s, o) => s + o.total, 0).toLocaleString("en-IN")}`}
          icon={BarChart3}
        />
        <AdminStatCard label="Order Report" value={`${orders.length} orders`} icon={ShoppingCart} />
        <AdminStatCard label="Product Report" value={`${products.length} products`} icon={Package} />
        <AdminStatCard
          label="Customer Report"
          value={`${new Set(orders.map((o) => o.customer.email)).size} customers`}
          icon={Users}
        />
        <AdminStatCard label="Lead Report" value={`${leadService.list().length} leads`} icon={UserPlus} />
        <AdminStatCard
          label="Inventory Report"
          value={`${products.filter((p) => p.stock <= 10).length} low stock`}
          icon={Warehouse}
        />
        <AdminStatCard label="Category Report" value={`${categoryService.list().length} categories`} icon={FolderTree} />
        <AdminStatCard label="Activity Report" value={`${activityService.list().length} activities`} icon={Activity} />
      </div>
    </AdminLayout>
  );
}
