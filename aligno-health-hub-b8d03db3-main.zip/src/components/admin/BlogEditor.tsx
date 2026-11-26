import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  AdminEditorShell,
  AdminFieldLabel,
  adminInputClassName,
  adminTextareaClassName,
  useAdminDraft,
} from "@/components/admin/admin-form";
import { AdminEmptyState, AdminPanel, AdminPanelBody, AdminPanelHeader } from "@/components/admin/admin-ui";
import { ASSETS } from "@/lib/assets";
import { blogService, uid, useStore } from "@/lib/store";
import type { Blog } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function emptyBlog(): Blog {
  return {
    id: uid(),
    title: "New Blog Post",
    slug: `new-blog-${uid()}`,
    excerpt: "",
    content: "",
    image: ASSETS.body.knee,
    author: "Aligno",
    date: new Date().toISOString().slice(0, 10),
    published: false,
  };
}

export function BlogEditor() {
  const blogs = useStore(() => blogService.list());
  const [editingId, setEditingId] = useState<string | null>(blogs[0]?.id ?? null);
  const editing = blogs.find((blog) => blog.id === editingId);
  const { draft, dirty, saving, status, patch, confirmDiscard, runSave } = useAdminDraft(editing, editingId ?? "");

  const selectBlog = (id: string) => {
    if (!confirmDiscard()) return;
    setEditingId(id);
  };

  const handleSave = () => {
    if (!draft || !editingId) return;
    runSave(async () => {
      blogService.update(editingId, draft);
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <AdminPanel className="h-fit">
        <AdminPanelHeader
          title="Blog posts"
          action={
            <Button
              size="sm"
              className="gap-1 rounded-full bg-gold font-bold text-ink"
              onClick={() => {
                const blog = emptyBlog();
                blogService.add(blog);
                setEditingId(blog.id);
              }}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          }
        />
        <AdminPanelBody className="max-h-[70vh] space-y-1 overflow-y-auto pt-0">
          {blogs.map((blog) => (
            <button
              key={blog.id}
              type="button"
              onClick={() => selectBlog(blog.id)}
              className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                editingId === blog.id ? "bg-gold/20 font-bold" : "hover:bg-secondary"
              }`}
            >
              {blog.title}
              {!blog.published && <span className="ml-1 text-xs text-muted-foreground">(draft)</span>}
            </button>
          ))}
        </AdminPanelBody>
      </AdminPanel>

      {draft ? (
        <AdminEditorShell
          title="Edit blog"
          dirty={dirty}
          saving={saving}
          status={status}
          onSave={handleSave}
          saveLabel="Save Blog"
          headerActions={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg text-xs text-destructive"
              onClick={() => {
                if (!confirmDiscard("Discard changes and delete this post?")) return;
                blogService.remove(draft.id);
                setEditingId(blogs.find((blog) => blog.id !== draft.id)?.id ?? null);
              }}
            >
              Delete
            </Button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AdminFieldLabel>
              Title
              <input
                className={adminInputClassName()}
                value={draft.title}
                onChange={(e) => {
                  const title = e.target.value;
                  patch({ title, slug: slugify(title) });
                }}
              />
            </AdminFieldLabel>
            <AdminFieldLabel>
              Slug
              <input className={adminInputClassName()} value={draft.slug} onChange={(e) => patch({ slug: slugify(e.target.value) })} />
            </AdminFieldLabel>
            <AdminFieldLabel>
              Author
              <input className={adminInputClassName()} value={draft.author} onChange={(e) => patch({ author: e.target.value })} />
            </AdminFieldLabel>
            <AdminFieldLabel>
              Date
              <input type="date" className={adminInputClassName()} value={draft.date} onChange={(e) => patch({ date: e.target.value })} />
            </AdminFieldLabel>
          </div>
          <AdminFieldLabel>
            Excerpt
            <textarea className={adminTextareaClassName("min-h-20")} value={draft.excerpt} onChange={(e) => patch({ excerpt: e.target.value })} />
          </AdminFieldLabel>
          <AdminFieldLabel>
            Content
            <textarea className={adminTextareaClassName("min-h-48")} value={draft.content} onChange={(e) => patch({ content: e.target.value })} />
          </AdminFieldLabel>
          <ImageUploadField
            label="Cover image"
            images={draft.image ? [draft.image] : []}
            onChange={(images) => patch({ image: images[0] ?? ASSETS.body.knee })}
            multiple={false}
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.published} onChange={(e) => patch({ published: e.target.checked })} />
            <span className="font-semibold">Published on storefront</span>
          </label>
        </AdminEditorShell>
      ) : (
        <AdminEmptyState title="Select a blog post" description="Add or choose a post to edit." />
      )}
    </div>
  );
}
