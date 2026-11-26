import { createFileRoute } from "@tanstack/react-router";
import { ProductGridPage } from "@/components/site/ProductGridPage";
import { pageHead, PUBLIC_ROUTE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/_site/daily-support")({
  head: () => pageHead(PUBLIC_ROUTE_SEO["/daily-support"]),
  component: DailySupportPage,
});

function DailySupportPage() {
  return <ProductGridPage title="Shop By Daily Support" filter={(p) => p.category === "daily-support-products"} />;
}
