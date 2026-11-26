import { createFileRoute } from "@tanstack/react-router";
import { contactService, leadService, uid, useStore } from "@/lib/store";
import { pageHead, PUBLIC_ROUTE_SEO } from "@/lib/seo";
import { useState } from "react";

export const Route = createFileRoute("/_site/contact")({
  head: () => pageHead(PUBLIC_ROUTE_SEO["/contact"]),
  component: ContactPage,
});

function ContactPage() {
  const c = useStore(() => contactService.get());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-12 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-white p-6">
        <h1 className="text-3xl font-black">Contact Us</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Our support team is here to help with product questions, sizing, orders, returns, and wholesale enquiries.
        </p>
        <div className="mt-5 space-y-3 text-sm">
          <div>
            <p className="font-semibold">{c?.businessName}</p>
            <p className="mt-1 text-muted-foreground">{c?.address}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p className="font-semibold">{c?.phone}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-semibold">{c?.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">WhatsApp</p>
            <p className="font-semibold">{c?.whatsapp}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Support Hours</p>
            <p className="font-semibold">{c?.hours}</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-xl font-bold">Send us a message</h2>
        <div className="mt-3 space-y-3">
          <input className="h-11 w-full rounded-xl border border-border px-4 text-sm" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="h-11 w-full rounded-xl border border-border px-4 text-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <textarea className="h-28 w-full rounded-xl border border-border px-4 py-3 text-sm" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button
            onClick={() => {
              leadService.add({ id: `lead-${uid()}`, name, email, message, source: "contact", status: "New", createdAt: new Date().toISOString() });
              setDone(true);
            }}
            className="w-full rounded-full bg-gold py-3 font-bold text-ink"
          >
            Submit
          </button>
          {done && <p className="text-sm text-emerald">Message submitted successfully.</p>}
        </div>
      </div>
    </div>
  );
}
