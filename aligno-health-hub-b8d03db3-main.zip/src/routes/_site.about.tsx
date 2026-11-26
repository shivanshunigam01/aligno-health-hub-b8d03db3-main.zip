import { createFileRoute } from "@tanstack/react-router";
import { pageHead, PUBLIC_ROUTE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/_site/about")({
  head: () => pageHead(PUBLIC_ROUTE_SEO["/about"]),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-black">About Aligno</h1>
      <p className="mt-4 text-muted-foreground">
        Aligno builds premium orthopedic and daily-support products inspired by athletic movement, physiotherapy science, and ergonomic design. From knee braces and lumbo-sacral belts to posture correctors and car comfort essentials, every product is engineered to help you move, recover, and live aligned.
      </p>

      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-bold">Our Mission</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            To make recovery and movement support accessible, comfortable, and trustworthy for every home. We believe quality orthopedic care should not be limited to clinics — it should be part of everyday life, whether you are at work, on the road, or staying active.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-bold">What We Stand For</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><strong className="text-foreground">Medical-grade quality</strong> — Materials selected for clinical support, breathability, and long-lasting durability.</li>
            <li><strong className="text-foreground">Expert design</strong> — Products shaped with input from physiotherapists and ergonomic specialists.</li>
            <li><strong className="text-foreground">Trusted by thousands</strong> — Serving customers across India with braces, belts, cushions, and daily comfort solutions.</li>
            <li><strong className="text-foreground">Support that cares</strong> — Free shipping above ₹999, 30-day easy returns, and responsive customer support.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-bold">Our Product Range</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Aligno offers orthopedic supports for the knee, back, neck, shoulder, wrist, and foot, along with daily-support products for office ergonomics, travel, yoga, and driving. Whether you need pain relief, posture correction, or active-lifestyle support, our collection is built to fit your routine.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-bold">Get in Touch</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Have questions about sizing, product selection, or your order? Reach us at hello@aligno.in or +91 98000 11122. We are available Mon–Sat, 9:00 AM – 7:00 PM IST.
          </p>
        </div>
      </div>
    </div>
  );
}
