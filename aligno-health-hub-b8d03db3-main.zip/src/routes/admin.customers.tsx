import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminEmptyState, AdminPanel, AdminPanelBody, AdminPanelHeader } from "@/components/admin/admin-ui";
import { customerService, orderService, useStore } from "@/lib/store";
import { Mail, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/admin/customers")({ component: Page });

function Page() {
  const customers = useStore(() => customerService.list());
  const orders = useStore(() => orderService.list());

  return (
    <AdminLayout title="Customers">
      <AdminPanel>
        <AdminPanelHeader
          title="Customer Directory"
          description={`${customers.length} registered customer${customers.length === 1 ? "" : "s"}`}
        />
        <AdminPanelBody className="pt-0">
          {customers.length === 0 ? (
            <AdminEmptyState title="No customers yet" description="Customer profiles appear after checkout." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {customers.map((c) => {
                const customerOrders = orders.filter((o) => o.customer.email === c.email);
                const spend = customerOrders.reduce((s, o) => s + o.total, 0);
                return (
                  <div key={c.id} className="rounded-xl border border-border p-4 transition hover:border-gold/30 hover:shadow-sm">
                    <p className="font-bold">{c.name}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{c.email}</span>
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <ShoppingBag className="h-3.5 w-3.5" />
                        {customerOrders.length} orders
                      </span>
                      <span className="font-semibold text-foreground">₹{spend.toLocaleString("en-IN")} spent</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </AdminPanelBody>
      </AdminPanel>
    </AdminLayout>
  );
}
