import { createFileRoute, Link } from "@tanstack/react-router";
import { formatINR } from "@/lib/cart";
import { orderService, useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { pageHead, PUBLIC_ROUTE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/_site/orders")({
  head: () => pageHead(PUBLIC_ROUTE_SEO["/orders"]),
  component: OrdersPage,
});

function OrdersPage() {
  const user = useAuth((s) => s.user);
  const orders = useStore(() => orderService.list());

  if (!user) return <div className="mx-auto max-w-md px-4 py-12 text-center"><Link to="/login" className="rounded-full bg-gold px-6 py-3 font-bold text-ink">Login to view orders</Link></div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-black">My Orders</h1>
      <div className="mt-6 space-y-3">
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground">No orders yet.</div>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-border bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">{new Date(o.date).toLocaleDateString()}</p>
                  <p className="font-bold">{o.id}</p>
                </div>
                <p className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">{o.status}</p>
                <p className="font-bold">{formatINR(o.total)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
