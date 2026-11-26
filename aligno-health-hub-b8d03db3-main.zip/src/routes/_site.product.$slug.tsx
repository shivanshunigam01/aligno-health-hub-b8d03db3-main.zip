import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { categoryService, productService, reviewService, useStore } from "@/lib/store";
import { getVisibleProducts } from "@/lib/catalog";
import { useCart, formatINR } from "@/lib/cart";
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
  ChevronRight,
  Play,
  MapPin,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionCarousel } from "@/components/site/SectionCarousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Product } from "@/lib/types";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, pageHead, productSchema, slugToTitle } from "@/lib/seo";

const RECENT_KEY = "aligno_recent_views";

function saveRecentView(productId: string) {
  if (typeof window === "undefined") return;
  const prev: string[] = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  const next = [productId, ...prev.filter((id) => id !== productId)].slice(0, 8);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

function getRecentViews(currentId: string): Product[] {
  if (typeof window === "undefined") return [];
  const ids: string[] = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  const products = productService.list();
  return ids.filter((id) => id !== currentId).map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];
}

export const Route = createFileRoute("/_site/product/$slug")({
  head: ({ params }) =>
    pageHead({
      title: slugToTitle(params.slug),
      description: `Buy ${slugToTitle(params.slug)} at Aligno — medical-grade orthopedic support with fast delivery across India.`,
      path: `/product/${params.slug}`,
    }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-20 text-center">
      <h1 className="text-2xl font-bold">Product not found</h1>
      <Link to="/shop" className="mt-4 inline-block text-gold">
        Browse all →
      </Link>
    </div>
  ),
});

function ProductPage() {
  const { slug } = Route.useParams();
  const products = useStore(() => getVisibleProducts());
  const p = products.find((x) => x.slug === slug);
  const [size, setSize] = useState<string | undefined>(p?.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");
  const [recent, setRecent] = useState<Product[]>([]);
  const add = useCart((s) => s.add);
  const toggleWish = useCart((s) => s.toggleWish);
  const wished = useCart((s) => (p ? s.wishlist.includes(p.id) : false));

  useEffect(() => {
    if (!p) return;
    saveRecentView(p.id);
    setRecent(getRecentViews(p.id));
  }, [p?.id]);

  if (!p) throw notFound();

  const category = categoryService.list().find((c) => c.slug === p.category);
  const hasPrice = p.discountPrice > 0;
  const discountPct = p.price > 0 ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 0;
  const isPackshot = p.images[img]?.endsWith(".png");
  const reviews = reviewService.list().filter((r) => r.productId === p.id && r.approved);
  const related = products
    .filter((x) => x.id !== p.id && x.enabled !== false && (x.category === p.category || x.bodyPart === p.bodyPart))
    .slice(0, 4);

  const checkPincode = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryMsg("Please enter a valid 6-digit pincode.");
      return;
    }
    const code = parseInt(pincode, 10);
    const days = code % 2 === 0 ? "2–4 business days" : "3–5 business days";
    setDeliveryMsg(`Delivery available to ${pincode}. Estimated: ${days}. COD available.`);
  };

  const howToUse = [
    `Select the correct ${p.sizes?.length ? "size" : "fit"} for your body measurements.`,
    "Position the support as directed — snug but not restrictive.",
    "Wear during activity or as advised by your physiotherapist.",
    "Remove periodically to allow skin to breathe.",
    "Hand wash after extended use to maintain hygiene.",
  ];

  return (
    <div className="bg-background">
      <JsonLd
        data={[
          productSchema(p),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            ...(category ? [{ name: category.name, path: `/category/${category.slug}` }] : []),
            { name: p.name, path: `/product/${p.slug}` },
          ]),
        ]}
      />
      {/* Breadcrumb */}
      <div className="border-b border-border bg-secondary/50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-4 py-3 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-gold">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-gold">Shop</Link>
          {category && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link to="/category/$slug" params={{ slug: category.slug }} className="hover:text-gold">
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">{p.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <div>
            <div className="relative">
              <div className={`aspect-square overflow-hidden rounded-2xl ${isPackshot ? "bg-ink" : "bg-secondary"}`}>
                <img
                  src={p.images[img]}
                  alt={p.name}
                  className={`h-full w-full ${isPackshot ? "object-contain p-4" : "object-cover"}`}
                />
              </div>
              {p.bestSeller && (
                <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink">Best Seller</span>
              )}
              {p.newArrival && (
                <span className="absolute right-4 top-4 rounded-full bg-emerald px-3 py-1 text-xs font-bold text-white">New</span>
              )}
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {p.images.map((src, i) => {
                const thumbPack = src.endsWith(".png");
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImg(i)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${i === img ? "border-gold" : "border-border"} ${thumbPack ? "bg-ink" : ""}`}
                  >
                    <img src={src} className={`h-full w-full ${thumbPack ? "object-contain p-1" : "object-cover"}`} alt="" />
                  </button>
                );
              })}
            </div>
            {/* Video placeholder */}
            <div className="mt-6 flex aspect-video items-center justify-center rounded-2xl border border-dashed border-border bg-secondary">
              <div className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ink text-white">
                  <Play className="h-6 w-6 fill-white" />
                </div>
                <p className="mt-3 text-sm font-semibold">Product Demo Video</p>
                <p className="text-xs text-muted-foreground">See how to wear & adjust your support</p>
              </div>
            </div>
          </div>

          {/* Buy box */}
          <div>
            <div className="flex flex-wrap gap-2">
              {p.featured && <span className="rounded-full bg-charcoal px-3 py-1 text-xs font-bold text-white">Featured</span>}
              {p.stock < 10 && (
                <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive">Only {p.stock} left</span>
              )}
              {p.stock >= 10 && (
                <span className="rounded-full bg-emerald/10 px-3 py-1 text-xs font-bold text-emerald">In Stock</span>
              )}
            </div>

            <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">SKU: {p.sku}</p>
            <h1 className="mt-1 text-3xl font-black leading-tight md:text-4xl">{p.name}</h1>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(p.rating) ? "fill-gold text-gold" : "text-border"}`} />
                ))}
              </div>
              <span className="text-sm font-semibold">{p.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({p.reviewCount} reviews)</span>
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              {hasPrice ? (
                <>
                  <span className="text-4xl font-black">{formatINR(p.discountPrice)}</span>
                  {p.price > p.discountPrice && <span className="text-xl text-muted-foreground line-through">{formatINR(p.price)}</span>}
                  {discountPct > 0 && <span className="rounded-full bg-gold px-3 py-1 text-sm font-bold text-ink">{discountPct}% OFF</span>}
                </>
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">Price on request</span>
              )}
            </div>
            {hasPrice && <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes · MRP {formatINR(p.price)}</p>}

            <p className="mt-5 text-base leading-relaxed text-muted-foreground">{p.shortDescription}</p>

            {/* Tags / filters */}
            <div className="mt-5 flex flex-wrap gap-2">
              {p.bodyPart && (
                <Link to="/body-part/$slug" params={{ slug: p.bodyPart }} className="rounded-full border border-border px-3 py-1 text-xs font-semibold hover:border-gold hover:text-gold">
                  {p.bodyPart.charAt(0).toUpperCase() + p.bodyPart.slice(1)}
                </Link>
              )}
              {p.painArea && (
                <Link to="/pain-area/$slug" params={{ slug: p.painArea }} className="rounded-full border border-border px-3 py-1 text-xs font-semibold hover:border-gold hover:text-gold">
                  {p.painArea} pain
                </Link>
              )}
              {p.activity?.map((a) => (
                <Link key={a} to="/activity/$slug" params={{ slug: a }} className="rounded-full border border-border px-3 py-1 text-xs font-semibold capitalize hover:border-gold hover:text-gold">
                  {a}
                </Link>
              ))}
            </div>

            {p.sizes && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-bold">Select Size</p>
                <div className="flex flex-wrap gap-2">
                  {p.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`h-11 min-w-12 rounded-lg border-2 px-4 text-sm font-bold transition ${size === s ? "border-ink bg-ink text-white" : "border-border hover:border-gold"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full border border-border">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-11 w-11 text-lg">−</button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)} className="h-11 w-11 text-lg">+</button>
              </div>
              <button
                type="button"
                onClick={() => add(p.id, qty, size)}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-bold text-white hover:bg-charcoal"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() => toggleWish(p.id)}
                className={`grid h-11 w-11 place-items-center rounded-full border-2 ${wished ? "border-gold bg-gold text-ink" : "border-border hover:border-gold"}`}
                aria-label="Add to wishlist"
              >
                <Heart className={`h-5 w-5 ${wished ? "fill-current" : ""}`} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => { add(p.id, qty, size); window.location.href = "/checkout"; }}
              className="mt-3 w-full rounded-full bg-gold py-3.5 text-sm font-bold text-ink hover:brightness-110"
            >
              Buy Now
            </button>

            {/* Pincode check */}
            <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-4">
              <p className="flex items-center gap-2 text-sm font-bold">
                <MapPin className="h-4 w-4 text-gold" />
                Check Delivery
              </p>
              <div className="mt-3 flex gap-2">
                <input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter pincode"
                  className="h-10 flex-1 rounded-xl border border-border bg-white px-4 text-sm outline-none focus:border-gold"
                />
                <button type="button" onClick={checkPincode} className="rounded-xl bg-ink px-4 text-sm font-bold text-white hover:bg-charcoal">
                  Check
                </button>
              </div>
              {deliveryMsg && <p className="mt-2 text-xs text-emerald">{deliveryMsg}</p>}
            </div>

            {/* Offers */}
            <div className="mt-4 rounded-2xl border border-gold/30 bg-gold/5 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-ink">
                <Tag className="h-4 w-4 text-gold" />
                Available Offers
              </p>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li>• Free shipping on orders above ₹999</li>
                <li>• Use code <strong className="text-ink">ALIGNO10</strong> for 10% off at checkout</li>
                <li>• Extra 5% off on prepaid orders</li>
                <li>• 30-day easy returns on unused items</li>
              </ul>
            </div>

            {/* Trust icons */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { Icon: Truck, t: "Fast Delivery" },
                { Icon: ShieldCheck, t: "Secure Payment" },
                { Icon: BadgeCheck, t: "Genuine Product" },
                { Icon: RotateCcw, t: "Easy Returns" },
              ].map(({ Icon, t }) => (
                <div key={t} className="flex flex-col items-center rounded-xl border border-border bg-white p-3 text-center">
                  <Icon className="h-5 w-5 text-gold" />
                  <span className="mt-1 text-[10px] font-semibold leading-tight">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detail sections */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <section className="rounded-2xl border border-border bg-white p-6 md:p-8">
              <h2 className="text-xl font-black">Product Description</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{p.longDescription}</p>
            </section>

            <section className="rounded-2xl border border-border bg-white p-6 md:p-8">
              <h2 className="text-xl font-black">Key Benefits</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {p.benefits.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-0.5 text-gold">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-white p-6 md:p-8">
              <h2 className="text-xl font-black">How to Use</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                {howToUse.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>

            <section className="rounded-2xl border border-border bg-white p-6 md:p-8">
              <h2 className="text-xl font-black">Specifications</h2>
              <table className="mt-4 w-full text-sm">
                <tbody>
                  {Object.entries(p.specifications).map(([k, v]) => (
                    <tr key={k} className="border-b border-border">
                      <td className="py-3 pr-4 font-semibold text-foreground">{k}</td>
                      <td className="py-3 text-muted-foreground">{v}</td>
                    </tr>
                  ))}
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-semibold">SKU</td>
                    <td className="py-3 text-muted-foreground">{p.sku}</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold">Stock</td>
                    <td className="py-3 text-muted-foreground">{p.stock} units available</td>
                  </tr>
                </tbody>
              </table>
            </section>

            {p.careInstructions && p.careInstructions.length > 0 && (
              <section className="rounded-2xl border border-border bg-white p-6 md:p-8">
                <h2 className="text-xl font-black">Care Instructions</h2>
                <ul className="mt-4 space-y-2">
                  {p.careInstructions.map((c) => (
                    <li key={c} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-gold">•</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {p.faqs && p.faqs.length > 0 && (
              <section className="rounded-2xl border border-border bg-white p-6 md:p-8">
                <h2 className="text-xl font-black">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="mt-4">
                  {p.faqs.map((faq, i) => (
                    <AccordionItem key={faq.q} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left font-semibold">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {/* Reviews */}
            <section className="rounded-2xl border border-border bg-white p-6 md:p-8">
              <h2 className="text-xl font-black">Customer Reviews</h2>
              {reviews.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No reviews yet. Be the first to review this product!</p>
              ) : (
                <div className="mt-6 space-y-6">
                  {reviews.map((r) => (
                    <div key={r.id} className="border-b border-border pb-6 last:border-0">
                      <div className="flex items-center gap-3">
                        {r.image && <img src={r.image} alt="" className="h-10 w-10 rounded-full object-cover" />}
                        <div>
                          <p className="font-bold">{r.customerName}</p>
                          <div className="flex">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-muted-foreground">{r.date}</span>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">"{r.text}"</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar summary */}
          <div className="space-y-6">
            <div className="sticky top-28 rounded-2xl border border-border bg-ink p-6 text-white">
              <h3 className="font-black">Why Aligno?</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/80">
                <li className="flex gap-2"><BadgeCheck className="h-4 w-4 shrink-0 text-gold" /> Medical-grade materials</li>
                <li className="flex gap-2"><BadgeCheck className="h-4 w-4 shrink-0 text-gold" /> Designed by physiotherapists</li>
                <li className="flex gap-2"><BadgeCheck className="h-4 w-4 shrink-0 text-gold" /> Trusted across India</li>
                <li className="flex gap-2"><BadgeCheck className="h-4 w-4 shrink-0 text-gold" /> 30-day return promise</li>
              </ul>
              <Link to="/contact" className="mt-6 inline-flex text-sm font-bold text-gold hover:underline">
                Need help choosing? Contact us →
              </Link>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-black">Related Products</h2>
            <p className="mt-1 text-sm text-muted-foreground">You may also like these supports</p>
            <SectionCarousel className="mt-6 px-10 md:px-12" itemClassName="basis-[48%] sm:basis-1/3 lg:basis-1/4">
              {related.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </SectionCarousel>
          </section>
        )}

        {/* Recently viewed */}
        {recent.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-black">Recently Viewed</h2>
            <SectionCarousel className="mt-6 px-10 md:px-12" itemClassName="basis-[48%] sm:basis-1/3 lg:basis-1/4">
              {recent.slice(0, 8).map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </SectionCarousel>
          </section>
        )}
      </div>
    </div>
  );
}
