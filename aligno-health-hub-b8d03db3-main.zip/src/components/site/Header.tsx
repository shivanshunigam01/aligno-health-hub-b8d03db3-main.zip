import { Link } from "@tanstack/react-router";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Mic,
  ChevronDown,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ASSETS } from "@/lib/assets";
import { useCart } from "@/lib/cart";
import { cmsService, useStore } from "@/lib/store";

const bodyParts = ["Knee", "Back", "Neck", "Shoulder", "Wrist", "Hand", "Foot", "Calf", "Chest", "Face"];
const activities = ["Yoga", "Running", "Gym", "Cricket", "Basketball", "Badminton", "Walking", "Office", "Travel"];
const cats = ["Orthopedic Supports", "Medical Disposables", "Personal Care", "Hygiene Products", "Pain Relief Products", "Daily Support Products"];

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-");
}

function NavDropdown({ label, items, prefix }: { label: string; items: string[]; prefix: string }) {
  return (
    <div className="group relative">
      <button
        type="button"
        aria-haspopup="true"
        className="flex min-h-11 items-center gap-1 px-3 py-3.5 text-sm font-semibold text-white transition hover:text-gold focus-visible:text-gold"
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5 opacity-70 transition group-hover:rotate-180" aria-hidden />
      </button>
      <div className="invisible absolute left-0 top-full z-50 min-w-[13rem] rounded-xl border border-white/10 bg-charcoal p-2 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        {items.map((it) => (
          <Link
            key={it}
            to={`${prefix}/${slugify(it)}`}
            className="block rounded-lg px-3 py-2.5 text-sm text-white/90 transition hover:bg-white/10 hover:text-gold"
          >
            {it}
          </Link>
        ))}
      </div>
    </div>
  );
}

function IconBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">
      {count}
    </span>
  );
}

export function Header() {
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const wishCount = useCart((s) => s.wishlist.length);
  const [open, setOpen] = useState(false);
  const cms = useStore(() => cmsService.get());

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full bg-ink text-white shadow-lg shadow-black/20">
      {/* Tier 1 — announcement bar */}
      <div className="border-b border-white/5 bg-[#0a0c0f] py-2 text-center text-xs font-medium tracking-wide text-white/90">
        {cms.topBarText}
      </div>

      {/* Tier 2 — logo, search, account icons */}
      <div className="border-b border-white/10 bg-ink">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-5 md:py-3.5">
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-white md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link to="/" className="shrink-0">
            <img
              src={ASSETS.logo}
              alt="Aligno"
              className="h-11 w-auto md:h-14 lg:h-16"
            />
          </Link>

          <div className="hidden flex-1 md:block">
            <label className="relative mx-auto block max-w-2xl">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden />
              <input
                type="search"
                name="search"
                autoComplete="off"
                className="h-11 w-full rounded-full border border-white/10 bg-white/10 pl-11 pr-12 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-gold/50 focus:bg-white/15"
                placeholder="Search for knee support, belts, braces..."
              />
              <button
                type="button"
                className="absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Voice search"
              >
                <Mic className="h-4 w-4" />
              </button>
            </label>
          </div>

          <div className="ml-auto flex items-center gap-0.5 md:gap-1">
            <Link
              to="/account"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 md:flex"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              to="/wishlist"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 md:flex"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              <IconBadge count={wishCount} />
            </Link>
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              <IconBadge count={cartCount} />
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <div className="border-t border-white/5 px-4 pb-3 md:hidden">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden />
            <input
              type="search"
              name="search-mobile"
              className="h-11 w-full rounded-full border border-white/10 bg-white/10 pl-10 pr-10 text-sm text-white placeholder:text-white/45 outline-none focus:border-gold/50"
              placeholder="Search products..."
            />
            <Mic className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" aria-hidden />
          </label>
        </div>
      </div>

      {/* Tier 3 — navigation menu */}
      <nav className="hidden border-b border-white/10 bg-ink md:block" aria-label="Main navigation">
        <div className="relative mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4">
          <div className="flex items-center justify-center gap-1 col-start-2">
            <NavDropdown label="Shop By Body Part" items={bodyParts} prefix="/body-part" />
            <NavDropdown label="Shop By Activity" items={activities} prefix="/activity" />
            <NavDropdown label="Shop By Category" items={cats} prefix="/category" />
            <Link
              to="/daily-support"
              className="px-3 py-3.5 text-sm font-semibold text-white transition hover:text-gold"
            >
              Shop By Daily Support
            </Link>
            <Link to="/shop" className="px-3 py-3.5 text-sm font-semibold text-white transition hover:text-gold">
              All Products
            </Link>
            <Link to="/blogs" className="px-3 py-3.5 text-sm font-semibold text-white transition hover:text-gold">
              Blogs
            </Link>
          </div>
          <Link
            to="/shop"
            search={{ sort: "newest" } as never}
            className="col-start-3 justify-self-end my-2 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-bold text-ink transition hover:brightness-110"
          >
            <Tag className="h-4 w-4" />
            New Launches
          </Link>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/70 md:hidden" onClick={() => setOpen(false)} role="presentation">
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="flex h-full w-[min(85vw,20rem)] flex-col bg-ink shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <img src={ASSETS.logo} alt="Aligno" className="h-12 w-auto" />
              <button type="button" onClick={() => setOpen(false)} className="text-white" aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-1">
                <Link to="/shop" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-semibold text-white hover:bg-white/10">
                  All Products
                </Link>
                <Link to="/daily-support" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-white hover:bg-white/10">
                  Daily Support
                </Link>
                <Link to="/blogs" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-white hover:bg-white/10">
                  Blogs
                </Link>
                <Link to="/account" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-white hover:bg-white/10">
                  Account
                </Link>
                <Link to="/wishlist" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-white hover:bg-white/10">
                  Wishlist
                </Link>
                <Link to="/cart" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-white hover:bg-white/10">
                  Cart
                </Link>
              </div>
              <p className="mb-2 mt-6 px-3 text-xs font-bold uppercase tracking-wider text-gold">Body Parts</p>
              <div className="flex flex-col gap-0.5">
                {bodyParts.map((b) => (
                  <Link
                    key={b}
                    to={`/body-part/${b.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    {b}
                  </Link>
                ))}
              </div>
            </div>
            <div className="border-t border-white/10 p-4">
              <Link
                to="/shop"
                search={{ sort: "newest" } as never}
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-bold text-ink"
              >
                <Tag className="h-4 w-4" />
                New Launches
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
