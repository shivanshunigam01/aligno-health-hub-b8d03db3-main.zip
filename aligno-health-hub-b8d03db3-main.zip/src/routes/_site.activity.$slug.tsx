import { createFileRoute } from "@tanstack/react-router";
import { ProductGridPage } from "@/components/site/ProductGridPage";
import { pageHead, slugToTitle } from "@/lib/seo";

export const Route = createFileRoute("/_site/activity/$slug")({
  head: ({ params }) =>
    pageHead({
      title: `${slugToTitle(params.slug)} Support Products`,
      description: `Orthopedic supports designed for ${slugToTitle(params.slug).toLowerCase()} — shop Aligno braces and belts.`,
      path: `/activity/${params.slug}`,
    }),
  component: ActivityPage,
});

function ActivityPage() {
  const { slug } = Route.useParams();
  return (
    <ProductGridPage
      title={`${slugToTitle(slug)} Supports`}
      subtitle="Products matched to your activity and lifestyle"
      filter={(p) => p.activity?.includes(slug)}
    />
  );
}
