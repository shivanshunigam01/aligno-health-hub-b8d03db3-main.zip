import { createFileRoute, Link } from "@tanstack/react-router";
import { HeroSlider } from "@/components/site/HeroSlider";
import { Marquee } from "@/components/site/Marquee";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionCarousel } from "@/components/site/SectionCarousel";
import { activityService, posterService, blogService, cmsService, useStore } from "@/lib/store";
import { getVisibleProducts, getBodyParts, pickHighlightedProducts } from "@/lib/catalog";
import { getDisplayReviews } from "@/lib/reviews";
import { ASSETS } from "@/lib/assets";
import { Star, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { pageHead, PUBLIC_ROUTE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/_site/")({
  head: () => pageHead(PUBLIC_ROUTE_SEO["/"]),
  component: HomePage,
});

function HomePage() {
  const products = useStore(() => getVisibleProducts());
  const bodyParts = useStore(() => getBodyParts());
  const activities = useStore(() => activityService.list());
  const posters = useStore(() => posterService.list());
  const displayReviews = useStore(() => getDisplayReviews(3));
  const blogs = useStore(() => blogService.list());
  const cms = useStore(() => cmsService.get());
  const [tab, setTab] = useState<"best" | "feat" | "new">("best");
  const filtered = useMemo(() => {
    const kind = tab === "best" ? "bestSeller" : tab === "feat" ? "featured" : "newArrival";
    return pickHighlightedProducts(products, kind, 8);
  }, [products, tab]);

  return (
    <>
      <h1 className="sr-only">Aligno — Premium Orthopedic Supports &amp; Daily Comfort</h1>
      {cms.heroVisible !== false && <HeroSlider />}
      <Marquee />

      {/* Categories */}
      <section className="bg-ink py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-black md:text-4xl">Our Product Categories</h2>
              <p className="mt-2 text-white/60">Find the right product for your support needs</p>
            </div>
            <Link to="/shop" className="hidden text-sm font-semibold text-gold hover:underline md:inline">View all →</Link>
          </div>
          <SectionCarousel
            className="px-8 sm:px-12 md:px-14"
            itemClassName="basis-[45%] sm:basis-48 md:basis-56 lg:basis-[17rem] shrink-0"
            slidesToScroll={1}
            loop
            autoplayMs={2000}
            navButtonClassName="border-white/30 bg-ink/80 text-white backdrop-blur hover:bg-gold hover:text-ink hover:border-gold disabled:pointer-events-none"
          >
            {bodyParts.map((bp) => (
              <Link key={bp.id} to="/body-part/$slug" params={{ slug: bp.slug }} className="group block w-44 sm:w-48 md:w-56">
                <div className="h-44 w-full overflow-hidden rounded-2xl border-2 border-white/10 bg-white/5 md:h-56">
                  <img src={bp.image} alt={bp.name} className="h-full w-full object-cover object-top transition group-hover:scale-110" />
                </div>
                <p className="mt-3 text-center text-sm font-semibold">{bp.name}</p>
              </Link>
            ))}
          </SectionCarousel>
        </div>
      </section>

      {/* Collage */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-bold text-gold">No.1 Support Care Choice</span>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">Orthotic Care You Can Trust</h2>
              <p className="mt-2 max-w-xl text-muted-foreground">Premium support products designed for comfort, recovery, movement, and daily confidence.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">
            <div className="col-span-2 row-span-2 overflow-hidden rounded-2xl border border-border bg-white md:h-[460px]">
              <img src={ASSETS.collage.tall} className="h-full w-full object-contain p-4 md:p-6" alt="Aligno WFH support combo" />
            </div>
            <img src={ASSETS.collage.top1} className="h-44 w-full rounded-2xl border border-border object-cover object-top md:h-56" alt="Yoga support" />
            <img src={ASSETS.collage.top2} className="h-44 w-full rounded-2xl border border-border object-cover object-top md:h-56" alt="Knee support for active living" />
            <div className="overflow-hidden rounded-2xl border border-border bg-white md:h-56">
              <img
                src={ASSETS.collage.bottom1}
                className="h-44 w-full object-contain p-3 md:h-56 md:p-4"
                alt="Aligno seat and back cushion combo"
              />
            </div>
            <img src={ASSETS.collage.bottom2} className="h-44 w-full rounded-2xl border border-border object-cover object-center md:h-56" alt="Back pain relief support" />
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-ink py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-black md:text-4xl">Best Sellers</h2>
              <p className="mt-2 text-white/60">Shop our most popular supports</p>
            </div>
            <div className="flex gap-2">
              {[["best","Best Sellers"],["feat","Featured"],["new","New Arrivals"]].map(([k,l]) => (
                <button key={k} onClick={() => setTab(k as never)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${tab===k?"bg-gold text-ink":"bg-white/10 text-white hover:bg-white/20"}`}>{l}</button>
              ))}
            </div>
          </div>
          {filtered.length > 0 ? (
            <SectionCarousel
              className="mt-8 px-10 md:px-12"
              itemClassName="basis-[48%] sm:basis-1/3 lg:basis-1/4"
              navButtonClassName="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </SectionCarousel>
          ) : (
            <p className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-white/70">
              No products in this section yet. Mark products as Best Seller, Featured, or New Arrival in the admin Products panel.
            </p>
          )}
        </div>
      </section>

      {/* Posters */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 md:grid-cols-2">
          {posters.map((p) => (
            <Link
              key={p.id}
              to={p.ctaLink}
              className="group relative block aspect-[16/10] overflow-hidden rounded-3xl bg-ink shadow-lg md:aspect-[16/9]"
            >
              <img
                src={p.image}
                alt={p.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white md:p-8">
                <h3 className="text-xl font-black drop-shadow md:text-3xl">{p.title}</h3>
                <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-ink shadow">
                  {p.ctaText} <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Activity */}
      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-black md:text-4xl">Shop Based on Activity</h2>
          <SectionCarousel className="mt-8 px-10 md:px-12" itemClassName="basis-40 md:basis-48">
            {activities.map((a) => (
              <Link key={a.id} to="/activity/$slug" params={{ slug: a.slug }} className="group block">
                <div className="h-40 w-40 overflow-hidden rounded-2xl md:h-48 md:w-48">
                  <img src={a.image} alt={a.name} className="h-full w-full object-cover transition group-hover:scale-110" />
                </div>
                <p className="mt-2 text-center text-sm font-bold">{a.name}</p>
              </Link>
            ))}
          </SectionCarousel>
        </div>
      </section>

      {/* Brand banner
      <section className="relative h-80 overflow-hidden bg-ink md:h-[28rem]">
        <img src={ASSETS.lifestyle.active} alt="Everyday support for better alignment" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/50 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 text-white">
          <div className="max-w-lg">
            <h2 className="text-3xl font-black md:text-5xl">EVERYDAY SUPPORT FOR BETTER ALIGNMENT</h2>
            <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink">Shop Now <ChevronRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section> */}

      {/* Brand range */}
      <section className="bg-ink py-16 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
          {[
            { t: "Aligno Care", d: "Medical-grade orthopedic supports for recovery and daily relief." },
            { t: "Aligno Sport", d: "Performance braces engineered for athletes." },
            { t: "Aligno Life", d: "Lifestyle wellness products for everyday alignment." },
          ].map((r) => (
            <div key={r.t} className="rounded-3xl bg-white p-8 text-ink">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald">Range</span>
              <h3 className="mt-2 text-2xl font-black">{r.t}</h3>
              <div className="my-4 h-1 w-12 bg-gold" />
              <p className="text-sm text-muted-foreground">{r.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {cms.testimonialsVisible !== false && displayReviews.length > 0 && (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-black md:text-4xl">Real Stories, Real Results</h2>
          <SectionCarousel className="mt-8 px-10 md:px-12" itemClassName="basis-full md:basis-1/3">
            {displayReviews.map((r) => (
              <div key={r.id} className="h-full rounded-2xl border border-border bg-secondary p-6">
                <div className="flex items-center gap-3">
                  {r.image && <img src={r.image} className="h-12 w-12 rounded-full object-cover" alt="" />}
                  <div>
                    <p className="font-bold">{r.customerName}</p>
                    <div className="flex">{Array.from({length: r.rating}).map((_,i) => <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />)}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">"{r.text}"</p>
              </div>
            ))}
          </SectionCarousel>
        </div>
      </section>
      )}

      {/* Blogs */}
      <section className="bg-ink py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-black md:text-4xl">From Our Experts</h2>
          <SectionCarousel
            className="mt-8 px-10 md:px-12"
            itemClassName="basis-full md:basis-1/3"
            navButtonClassName="border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            {blogs.slice(0, 6).map((b) => (
              <Link key={b.id} to="/blog/$slug" params={{ slug: b.slug }} className="group block overflow-hidden rounded-2xl bg-white text-ink">
                <div className="aspect-video overflow-hidden"><img src={b.image} alt={b.title} className="h-full w-full object-cover transition group-hover:scale-105" /></div>
                <div className="p-5">
                  <h3 className="text-lg font-bold leading-snug group-hover:text-gold">{b.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{b.excerpt}</p>
                  <span className="mt-3 inline-block text-xs font-bold uppercase text-gold">Read more →</span>
                </div>
              </Link>
            ))}
          </SectionCarousel>
        </div>
      </section>
    </>
  );
}