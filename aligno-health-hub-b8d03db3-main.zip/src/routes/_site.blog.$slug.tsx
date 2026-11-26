import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { blogService, useStore } from "@/lib/store";
import { pageHead, slugToTitle } from "@/lib/seo";

export const Route = createFileRoute("/_site/blog/$slug")({
  head: ({ params }) =>
    pageHead({
      title: slugToTitle(params.slug),
      description: `Read ${slugToTitle(params.slug).toLowerCase()} on the Aligno wellness blog.`,
      path: `/blog/${params.slug}`,
    }),
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const { slug } = Route.useParams();
  const blog = useStore(() => blogService.list().find((b) => b.slug === slug && b.published));
  if (!blog) throw notFound();
  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <Link to="/blogs" className="text-sm font-semibold text-gold">← Back to Blogs</Link>
      <h1 className="mt-3 text-3xl font-black">{blog.title}</h1>
      <img src={blog.image} alt={blog.title} className="mt-6 w-full rounded-2xl object-cover" />
      <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{blog.content}</p>
    </article>
  );
}
