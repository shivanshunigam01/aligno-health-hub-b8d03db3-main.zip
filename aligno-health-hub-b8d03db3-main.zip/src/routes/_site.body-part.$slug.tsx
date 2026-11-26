import { createFileRoute } from "@tanstack/react-router";
import { ProductGridPage } from "@/components/site/ProductGridPage";
import { pageHead, slugToTitle } from "@/lib/seo";

export const Route = createFileRoute("/_site/body-part/$slug")({
  head: ({ params }) =>
    pageHead({
      title: `${slugToTitle(params.slug)} Support Products`,
      description: `Shop Aligno orthopedic supports for ${slugToTitle(params.slug).toLowerCase()} — medical-grade braces and belts.`,
      path: `/body-part/${params.slug}`,
    }),
  component: BodyPartPage,
});

function BodyPartPage() {
  const { slug } = Route.useParams();
  return (
    <ProductGridPage
      title={`${slugToTitle(slug)} Supports`}
      subtitle="Medical-grade support products for this body area"
      filter={(p) => p.bodyPart === slug}
    />
  );
}
