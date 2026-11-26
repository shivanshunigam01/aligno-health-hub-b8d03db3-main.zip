import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { orderService } from "@/lib/store";
import { downloadInvoice } from "@/lib/invoice";
import { formatINR } from "@/lib/cart";
import { pageHead, PUBLIC_ROUTE_SEO } from "@/lib/seo";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_site/order-success")({
  head: () => pageHead(PUBLIC_ROUTE_SEO["/order-success"]),
  component: Success,
});
function Success() {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setId(localStorage.getItem("aligno_last_order"));
  }, []);

  const order = id ? orderService.byId(id) : undefined;
  if (id === null) {
    return <div className="py-20 text-center text-sm text-muted-foreground">Loading order details…</div>;
  }
  if (!order) return <div className="py-20 text-center"><h1 className="text-2xl font-bold">No recent order</h1><Link to="/shop" className="mt-4 inline-block text-gold">Shop →</Link></div>;
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-emerald" />
      <h1 className="mt-4 text-3xl font-black">Order Placed!</h1>
      <p className="text-muted-foreground">Order ID: <b className="text-foreground">{order.id}</b></p>
      <div className="mt-8 rounded-2xl border border-border bg-white p-6 text-left">
        <p className="text-sm"><b>{order.customer.fullName}</b> · {order.customer.email}</p>
        <p className="text-sm text-muted-foreground">{order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
        <p className="mt-2 text-sm">Payment: {order.paymentMethod} · Total: <b>{formatINR(order.total)}</b></p>
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={() => downloadInvoice(order)} className="rounded-full bg-ink px-6 py-3 font-bold text-white">Download Invoice</button>
        <Link to="/shop" className="rounded-full border-2 border-ink px-6 py-3 font-bold">Continue Shopping</Link>
      </div>
    </div>
  );
}