import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCart, computeCart, formatINR } from "@/lib/cart";
import { orderService } from "@/lib/store";
import { orderApi } from "@/lib/api/services";
import { pageHead, PUBLIC_ROUTE_SEO } from "@/lib/seo";
import { useState } from "react";

export const Route = createFileRoute("/_site/checkout")({
  head: () => pageHead(PUBLIC_ROUTE_SEO["/checkout"]),
  component: Checkout,
});

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const PAYMENT_METHODS = ["COD", "UPI", "Card", "Razorpay"] as const;

const emptyForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

function validateForm(f: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!f.fullName.trim()) errors.fullName = "Full name is required";
  if (!f.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors.email = "Enter a valid email";
  if (!f.phone.trim()) errors.phone = "Mobile number is required";
  else if (!/^\d{10}$/.test(f.phone.replace(/\D/g, ""))) errors.phone = "Enter a valid 10-digit mobile number";
  if (!f.address.trim()) errors.address = "Address is required";
  if (!f.city.trim()) errors.city = "City is required";
  if (!f.state.trim()) errors.state = "State is required";
  if (!f.pincode.trim()) errors.pincode = "Pincode is required";
  else if (!/^\d{6}$/.test(f.pincode)) errors.pincode = "Enter a valid 6-digit pincode";
  return errors;
}

function Checkout() {
  const nav = useNavigate();
  const clear = useCart((s) => s.clear);
  const coupon = useCart((s) => s.coupon);
  const setCoupon = useCart((s) => s.setCoupon);
  useCart((s) => s.items);

  const [f, setF] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [pay, setPay] = useState<(typeof PAYMENT_METHODS)[number]>("COD");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const c = computeCart();

  const setField = (key: keyof FormState, value: string) => {
    setF((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const place = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateForm(f);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    if (c.rows.length === 0) {
      setErr("Your cart is empty.");
      return;
    }

    setLoading(true);
    setErr("");
    try {
      const phone = f.phone.replace(/\D/g, "").slice(-10);
      const order = await orderApi.guestCheckout({
        customer: { ...f, phone },
        paymentMethod: pay,
        couponCode: coupon || undefined,
        items: c.rows.map((r) => ({ productId: r.productId, quantity: r.qty, size: r.size })),
      });
      orderService.add(order);
      clear();
      localStorage.setItem("aligno_last_order", order.id);
      nav({ to: "/order-success" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (c.rows.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Nothing to checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">Add products to your cart first.</p>
        <Link to="/shop" className="mt-6 inline-block rounded-full bg-gold px-6 py-3 font-bold text-ink">
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-black">Checkout</h1>
      <p className="mt-1 text-sm text-muted-foreground">Complete your delivery details to place the order.</p>

      <form onSubmit={place} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-border bg-white p-5 md:p-6">
            <h2 className="text-lg font-bold">Contact &amp; Delivery</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Full Name" required error={errors.fullName}>
                <input
                  type="text"
                  autoComplete="name"
                  value={f.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  placeholder="Your full name"
                  className={inputClass(!!errors.fullName)}
                />
              </Field>

              <Field label="Email" required error={errors.email}>
                <input
                  type="email"
                  autoComplete="email"
                  value={f.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass(!!errors.email)}
                />
              </Field>

              <Field label="Mobile Number" required error={errors.phone}>
                <input
                  type="tel"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={f.phone}
                  onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit mobile"
                  className={inputClass(!!errors.phone)}
                />
              </Field>

              <Field label="Pincode" required error={errors.pincode}>
                <input
                  type="text"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  maxLength={6}
                  value={f.pincode}
                  onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6-digit PIN"
                  className={inputClass(!!errors.pincode)}
                />
              </Field>

              <Field label="Street Address" required error={errors.address} className="md:col-span-2">
                <textarea
                  rows={3}
                  autoComplete="street-address"
                  value={f.address}
                  onChange={(e) => setField("address", e.target.value)}
                  placeholder="House no., street, landmark"
                  className={`${inputClass(!!errors.address)} min-h-[88px] resize-y py-3`}
                />
              </Field>

              <Field label="City" required error={errors.city}>
                <input
                  type="text"
                  autoComplete="address-level2"
                  value={f.city}
                  onChange={(e) => setField("city", e.target.value)}
                  placeholder="City"
                  className={inputClass(!!errors.city)}
                />
              </Field>

              <Field label="State" required error={errors.state}>
                <select
                  value={f.state}
                  onChange={(e) => setField("state", e.target.value)}
                  className={inputClass(!!errors.state)}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-5 md:p-6">
            <h2 className="text-lg font-bold">Payment Method</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPay(m)}
                  className={`rounded-xl border-2 p-3 text-sm font-bold transition ${
                    pay === m ? "border-gold bg-gold/10 text-ink" : "border-border hover:border-gold/50"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            {pay !== "COD" && (
              <p className="mt-3 text-xs text-muted-foreground">
                Online payment will be collected after order confirmation. COD is recommended for quick checkout.
              </p>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-white p-6 lg:sticky lg:top-24">
          <h2 className="font-bold">Order Summary</h2>

          <ul className="mt-4 max-h-56 space-y-3 overflow-y-auto border-b border-border pb-4">
            {c.rows.map((r) => (
              <li key={r.productId + (r.size ?? "")} className="flex gap-3 text-sm">
                <img
                  src={r.product.images[0]}
                  alt={r.product.name}
                  className="h-14 w-14 shrink-0 rounded-lg border border-border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-semibold leading-snug">{r.product.name}</p>
                  {r.size && <p className="text-xs text-muted-foreground">Size: {r.size}</p>}
                  <p className="text-xs text-muted-foreground">Qty: {r.qty}</p>
                </div>
                <p className="shrink-0 font-bold">{formatINR(r.line)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-2">
            <input
              placeholder="Coupon (try ALIGNO10)"
              defaultValue={coupon ?? ""}
              onBlur={(e) => setCoupon(e.target.value.trim().toUpperCase() || null)}
              className="h-10 flex-1 rounded-full border border-border px-4 text-sm outline-none focus:border-gold"
            />
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" v={formatINR(c.subtotal)} />
            <Row label="Discount" v={c.discount > 0 ? `- ${formatINR(c.discount)}` : formatINR(0)} />
            <Row label="Shipping" v={c.shipping === 0 ? "Free" : formatINR(c.shipping)} />
            <Row label="GST (5%)" v={formatINR(c.gst)} />
            <div className="border-t border-border pt-2">
              <Row label={<span className="font-bold">Total</span>} v={<span className="text-lg font-bold">{formatINR(c.total)}</span>} />
            </div>
          </div>

          {err && <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-full bg-gold py-3 font-bold text-ink transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Placing order…" : "Place Order"}
          </button>

          <Link to="/cart" className="mt-3 block text-center text-sm font-semibold text-muted-foreground hover:text-gold">
            ← Back to cart
          </Link>
        </aside>
      </form>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:border-gold ${
    hasError ? "border-destructive" : "border-border"
  }`;
}

function Field({
  label,
  required,
  error,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block text-sm ${className ?? ""}`}>
      <span className="font-semibold text-ink">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </label>
  );
}

function Row({ label, v }: { label: React.ReactNode; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span>{v}</span>
    </div>
  );
}
