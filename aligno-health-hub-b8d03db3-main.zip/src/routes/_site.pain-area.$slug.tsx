import { createFileRoute } from "@tanstack/react-router";
import { ProductGridPage } from "@/components/site/ProductGridPage";
import { getPainAreas } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { pageHead, slugToTitle } from "@/lib/seo";

export const Route = createFileRoute("/_site/pain-area/$slug")({
  head: ({ params }) =>
    pageHead({
      title: `${slugToTitle(params.slug)} Pain Relief Products`,
      description: `Shop Aligno orthopedic supports for ${slugToTitle(params.slug).toLowerCase()} pain relief and recovery.`,
      path: `/pain-area/${params.slug}`,
    }),
  component: PainAreaPage,
});

function matchesPainArea(productPainArea: string | undefined, slug: string) {
  if (!productPainArea) return false;
  return productPainArea === slug || productPainArea === `${slug}-pain`;
}

function PainAreaPage() {
  const { slug } = Route.useParams();
  const painAreas = useStore(() => getPainAreas());
  const label = painAreas.find((p) => p.slug === slug)?.name ?? `${slugToTitle(slug)} Pain`;

  return (
    <ProductGridPage
      title={label}
      subtitle="Supports matched to your pain relief needs"
      filter={(p) => matchesPainArea(p.painArea, slug)}
    />
  );
}
