import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Linkedin, ShieldCheck, BadgeCheck, Truck, Stethoscope, RotateCcw } from "lucide-react";
import { ASSETS } from "@/lib/assets";
import { footerService, useStore } from "@/lib/store";

const trustIcons = [
  { Icon: ShieldCheck, t: "Secure Payment" },
  { Icon: BadgeCheck, t: "Medical Grade Quality" },
  { Icon: Truck, t: "Fast Delivery" },
  { Icon: Stethoscope, t: "Expert Support" },
  { Icon: RotateCcw, t: "Easy Returns" },
];

export function Footer() {
  const f = useStore(() => footerService.get());
  return (
    <>
      <section className="border-y border-border bg-white py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 md:grid-cols-5">
          {trustIcons.map(({ Icon, t }) => (
            <div key={t} className="flex flex-col items-center gap-2 text-center">
              <Icon className="h-8 w-8 text-gold" />
              <span className="text-sm font-semibold">{t}</span>
            </div>
          ))}
        </div>
      </section>
      <footer className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-14 md:grid-cols-6">
          <div className="col-span-2">
            <img src={ASSETS.logo} alt="Aligno" className="h-12 w-auto md:h-14" />
            <p className="mt-4 text-sm text-white/70">{f.description}</p>
            <p className="mt-4 text-xs text-white/60">{f.address}</p>
            <p className="mt-1 text-xs text-white/60">{f.email} · {f.phone}</p>
            <div className="mt-5 flex gap-3" aria-label="Social media">
              <a href={f.social.facebook} aria-label="Facebook" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-ink"><Facebook className="h-4 w-4" aria-hidden /></a>
              <a href={f.social.instagram} aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-ink"><Instagram className="h-4 w-4" aria-hidden /></a>
              <a href={f.social.youtube} aria-label="YouTube" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-ink"><Youtube className="h-4 w-4" aria-hidden /></a>
              <a href={f.social.linkedin} aria-label="LinkedIn" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-ink"><Linkedin className="h-4 w-4" aria-hidden /></a>
            </div>
          </div>
          <FooterCol title="Company" links={[["About Us","/about"],["Contact Us","/contact"],["FAQ","/faq"]]} />
          <FooterCol title="Shop" links={[["All Products","/shop"],["Best Sellers","/shop"],["Daily Support","/daily-support"],["Blogs","/blogs"]]} />
          <FooterCol title="Legal" links={[["Privacy Policy","/policy/privacy-policy"],["Terms","/policy/terms-conditions"],["Shipping","/policy/shipping-policy"],["Returns","/policy/return-refund-policy"]]} />
          <FooterCol title="Help" links={[["My Account","/account"],["My Orders","/orders"],["Track Order","/track-order"],["Support","/contact"]]} />
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-white/60">{f.copyright}</div>
        </div>
      </footer>
    </>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold">{title}</h4>
      <ul className="space-y-2 text-sm text-white/70">
        {links.map(([l, h]) => <li key={`${title}-${l}`}><Link to={h} className="hover:text-gold">{l}</Link></li>)}
      </ul>
    </div>
  );
}