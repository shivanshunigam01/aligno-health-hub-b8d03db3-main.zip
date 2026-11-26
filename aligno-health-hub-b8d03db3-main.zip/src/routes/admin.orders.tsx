import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminEmptyState, AdminPanel, AdminPanelBody, AdminPanelHeader, AdminStatusBadge } from "@/components/admin/admin-ui";
import { AdminStatusMessage } from "@/components/admin/admin-form";
import { orderService, useStore } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/orders")({ component: Page });
const statuses: OrderStatus[] = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

function Page() {
  const orders = useStore(() => orderService.list());
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const updateStatus = (id: string, value: OrderStatus) => {
    orderService.update(id, { status: value });
    setStatus({ type: "ok", text: "Order status saved." });
  };

  return (
    <AdminLayout title="Orders">
      <AdminStatusMessage status={status} />
      <AdminPanel>
        <AdminPanelHeader
          title="Order Management"
          description={`${orders.length} order${orders.length === 1 ? "" : "s"} total`}
        />
        <AdminPanelBody className="pt-0">
          {orders.length === 0 ? (
            <AdminEmptyState title="No orders yet" description="Orders from the storefront will appear here." />
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="rounded-xl border border-border p-4 transition hover:border-gold/30 hover:shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold">{o.id}</p>
                        <AdminStatusBadge status={o.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">{o.customer.fullName}</p>
                      <p className="text-xs text-muted-foreground">{o.customer.email}</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <p className="text-lg font-black">₹{o.total.toLocaleString("en-IN")}</p>
                      <Select
                        value={o.status}
                        onValueChange={(value) => updateStatus(o.id, value as OrderStatus)}
                      >
                        <SelectTrigger className="h-9 w-full min-w-[140px] rounded-lg sm:w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminPanelBody>
      </AdminPanel>
    </AdminLayout>
  );
}
