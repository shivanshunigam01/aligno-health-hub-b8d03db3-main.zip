import { createFileRoute } from "@tanstack/react-router";
import { orderService } from "@/lib/store";
import { pageHead, PUBLIC_ROUTE_SEO } from "@/lib/seo";
import { useState } from "react";

export const Route = createFileRoute("/_site/track-order")({
  head: () => pageHead(PUBLIC_ROUTE_SEO["/track-order"]),
  component: TrackOrderPage,
});

function TrackOrderPage() {
  const [id, setId] = useState("");
  const [found, setFound] = useState<ReturnType<typeof orderService.byId>>();
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-black">Track Order</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Enter the Order ID from your confirmation email or SMS to check delivery status. You can also view all orders from My Account after logging in.
      </p>
      <div className="mt-6 rounded-2xl border border-border bg-white p-6">
        <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Enter Order ID" className="h-11 w-full rounded-xl border border-border px-4 text-sm" />
        <button onClick={() => setFound(orderService.byId(id))} className="mt-3 w-full rounded-full bg-gold py-3 font-bold text-ink">Track</button>
        <div className="mt-4 rounded-xl bg-secondary p-4 text-sm">
          {id && !found ? "No order found for this ID." : found ? `Status: ${found.status} | Total: ₹${found.total}` : "Enter your order ID to track status."}
        </div>
      </div>
    </div>
  );
}
