import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart, computeCart, formatINR } from "@/lib/cart";
import { pageHead, PUBLIC_ROUTE_SEO } from "@/lib/seo";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_site/cart")({
  head: () => pageHead(PUBLIC_ROUTE_SEO["/cart"]),
  component: CartPage,
});

function CartPage() {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const setCoupon = useCart((s) => s.setCoupon);
  const coupon = useCart((s) => s.coupon);
  useCart((s) => s.items); // subscribe
  const c = computeCart();
  if (c.rows.length === 0) return <div className="mx-auto max-w-md py-20 text-center"><h1 className="text-2xl font-bold">Your cart is empty</h1><Link to="/shop" className="mt-4 inline-block rounded-full bg-gold px-6 py-3 font-bold text-ink">Shop now</Link></div>;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-black">Your Cart</h1>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {c.rows.map((r) => (
            <div key={r.productId+(r.size??"")} className="flex gap-4 rounded-2xl border border-border bg-white p-4">
              <img src={r.product.images[0]} alt={r.product.name} className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-semibold">{r.product.name}</p>
                {r.size && <p className="text-xs text-muted-foreground">Size: {r.size}</p>}
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-border">
                    <button onClick={() => setQty(r.productId, r.qty - 1)} className="h-8 w-8">−</button>
                    <span className="w-8 text-center text-sm font-bold">{r.qty}</span>
                    <button onClick={() => setQty(r.productId, r.qty + 1)} className="h-8 w-8">+</button>
                  </div>
                  <button onClick={() => remove(r.productId)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="font-bold">{formatINR(r.line)}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-white p-6">
          <h2 className="font-bold">Order Summary</h2>
          <div className="mt-2 flex gap-2"><input placeholder="Coupon (try ALIGNO10)" defaultValue={coupon ?? ""} onBlur={(e) => setCoupon(e.target.value || null)} className="h-10 flex-1 rounded-full border border-border px-4 text-sm" /></div>
          <div className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" v={formatINR(c.subtotal)} />
            <Row label="Discount" v={`- ${formatINR(c.discount)}`} />
            <Row label="Shipping" v={c.shipping === 0 ? "Free" : formatINR(c.shipping)} />
            <Row label="GST (5%)" v={formatINR(c.gst)} />
            <div className="border-t border-border pt-2"><Row label={<span className="font-bold">Total</span>} v={<span className="text-lg font-bold">{formatINR(c.total)}</span>} /></div>
          </div>
          <Link to="/checkout" className="mt-5 block rounded-full bg-gold py-3 text-center font-bold text-ink">Checkout →</Link>
        </div>
      </div>
    </div>
  );
}
function Row({ label, v }: { label: React.ReactNode; v: React.ReactNode }) {
  return <div className="flex justify-between"><span>{label}</span><span>{v}</span></div>;
}