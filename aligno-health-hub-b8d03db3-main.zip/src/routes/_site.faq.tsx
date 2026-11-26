import { createFileRoute, Link } from "@tanstack/react-router";
import { JsonLd } from "@/components/site/JsonLd";
import { faqSchema, pageHead, PUBLIC_ROUTE_SEO } from "@/lib/seo";

const faq = [
  ["How fast is delivery?", "Orders above ₹999 ship free across India. Once dispatched, metro deliveries typically arrive in 3–5 business days and other locations in 5–7 business days. Track your order anytime at our Track Order page using your Order ID."],
  ["Do you offer returns?", "Yes. Unused products in original packaging can be returned within 30 days of delivery. Email hello@aligno.in with your Order ID to start a return. See our Return & Refund Policy for full details."],
  ["Are Aligno products medical grade?", "Yes. Our braces, belts, and supports use medical-grade materials selected for clinical support, breathability, and comfort. They are designed for everyday wear and active recovery, but are not a substitute for professional medical advice."],
  ["How do I choose the right size?", "Each product page lists available sizes and a sizing guide. Measure as instructed and choose the size that matches your measurements. If you are between sizes, contact us at hello@aligno.in and we will help you pick the best fit."],
  ["Is cash on delivery available?", "Cash on delivery may be available on select pin codes at checkout. If COD is not shown for your location, you can pay securely online via UPI, card, or net banking."],
  ["How do I track my order?", "Use the Order ID from your confirmation email on our Track Order page, or log in to My Account → My Orders to view status and details."],
  ["What if my product arrives damaged?", "Contact us within 48 hours of delivery at hello@aligno.in with your Order ID and photos of the package. We will arrange a free replacement or full refund."],
  ["Can I cancel my order?", "Orders can be cancelled before dispatch by emailing hello@aligno.in with your Order ID. Once shipped, standard return policy applies."],
  ["Do you ship outside India?", "Currently we ship within India only. We are working to expand international delivery in the future."],
  ["How do I contact customer support?", "Email hello@aligno.in, WhatsApp +91 98000 11122, or use our Contact Us page. Support hours are Mon–Sat, 9:00 AM – 7:00 PM IST."],
];

export const Route = createFileRoute("/_site/faq")({
  head: () => pageHead(PUBLIC_ROUTE_SEO["/faq"]),
  component: FAQPage,
});

function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <JsonLd data={faqSchema(faq)} />
      <h1 className="text-3xl font-black">Frequently Asked Questions</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Find answers to common questions about ordering, shipping, returns, and Aligno products. Still need help?{" "}
        <Link to="/contact" className="font-semibold text-gold hover:underline">Contact our support team</Link>.
      </p>
      <div className="mt-6 space-y-3">
        {faq.map(([q, a]) => (
          <div key={q} className="rounded-2xl border border-border bg-white p-5">
            <h3 className="font-bold">{q}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
