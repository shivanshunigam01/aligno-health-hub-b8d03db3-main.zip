import { createFileRoute, redirect } from "@tanstack/react-router";
import { pageHead, PUBLIC_ROUTE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/_site/my-orders")({
  head: () => pageHead(PUBLIC_ROUTE_SEO["/my-orders"]),
  beforeLoad: () => {
    throw redirect({ to: "/orders" });
  },
});
