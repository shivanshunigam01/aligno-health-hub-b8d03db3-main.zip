import { createFileRoute } from "@tanstack/react-router";
import { ProductGridPage } from "@/components/site/ProductGridPage";
import { pageHead, slugToTitle } from "@/lib/seo";

export const Route = createFileRoute("/_site/category/$slug")({
  head: ({ params }) =>
    pageHead({
      title: slugToTitle(params.slug),
      description: `Browse ${slugToTitle(params.slug).toLowerCase()} at Aligno Health Hub.`,
      path: `/category/${params.slug}`,
    }),
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  return (
    <ProductGridPage
      title={slugToTitle(slug)}
      subtitle="Quality orthopedic and wellness products"
      filter={(p) => p.category === slug}
    />
  );
}
