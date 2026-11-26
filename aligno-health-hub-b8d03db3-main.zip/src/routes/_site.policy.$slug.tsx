import { createFileRoute, notFound } from "@tanstack/react-router";
import { policyService, useStore } from "@/lib/store";
import { pageHead, slugToTitle } from "@/lib/seo";

export const Route = createFileRoute("/_site/policy/$slug")({
  head: ({ params }) =>
    pageHead({
      title: slugToTitle(params.slug),
      description: `Aligno ${slugToTitle(params.slug).toLowerCase()} — legal and policy information.`,
      path: `/policy/${params.slug}`,
    }),
  component: PolicyPage,
});

function PolicySection({ content }: { content: string }) {
  return (
    <div className="mt-6 space-y-6">
      {content.split(/\n\n+/).map((block, i) => {
        const trimmed = block.trim();
        const isHeading =
          trimmed.length < 80 &&
          /^[A-Z0-9][A-Z0-9\s&,'\-]+$/.test(trimmed) &&
          !trimmed.startsWith("Last updated");
        if (isHeading) {
          return (
            <h2 key={i} className="text-base font-bold text-foreground">
              {trimmed}
            </h2>
          );
        }
        return (
          <p key={i} className="text-sm leading-7 text-muted-foreground">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

function PolicyPage() {
  const { slug } = Route.useParams();
  const p = useStore(() => policyService.bySlug(slug));
  if (!p) throw notFound();
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-black">{p.title}</h1>
      <PolicySection content={p.content} />
    </div>
  );
}
