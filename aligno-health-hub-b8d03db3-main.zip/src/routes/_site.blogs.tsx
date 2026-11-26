import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { blogService, useStore } from "@/lib/store";
import { pageHead, PUBLIC_ROUTE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/_site/blogs")({
  head: () => pageHead(PUBLIC_ROUTE_SEO["/blogs"]),
  component: BlogsPage,
});

function BlogsPage() {
  const allBlogs = useStore(() => blogService.list());
  const blogs = useMemo(() => allBlogs.filter((b) => b.published), [allBlogs]);
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-black">Blogs</h1>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {blogs.map((b) => (
          <Link key={b.id} to="/blog/$slug" params={{ slug: b.slug }} className="overflow-hidden rounded-2xl border border-border bg-white">
            <div className="aspect-video overflow-hidden">
              <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <h3 className="font-bold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
