import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  AdminEditorShell,
  AdminFieldLabel,
  adminTextareaClassName,
  useAdminDraft,
} from "@/components/admin/admin-form";
import { policyService } from "@/lib/store";
import { useState } from "react";

export const Route = createFileRoute("/admin/policies")({ component: Page });

function Page() {
  const source = policyService.list();
  const [activeSlug, setActiveSlug] = useState(source[0]?.slug ?? "");
  const active = source.find((p) => p.slug === activeSlug) ?? source[0];
  const { draft, dirty, saving, status, patch, confirmDiscard, runSave } = useAdminDraft(active, activeSlug);

  const selectPolicy = (slug: string) => {
    if (!confirmDiscard()) return;
    setActiveSlug(slug);
  };

  if (!draft) return null;

  const handleSave = () => {
    runSave(async () => {
      policyService.update(draft.slug, { title: draft.title, content: draft.content });
    }, "Policy saved.");
  };

  return (
    <AdminLayout title="Policy Pages">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="rounded-2xl border border-border bg-white p-3">
          {source.map((policy) => (
            <button
              key={policy.slug}
              type="button"
              onClick={() => selectPolicy(policy.slug)}
              className={`mb-1 block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                activeSlug === policy.slug ? "bg-gold/20 font-bold" : "hover:bg-secondary"
              }`}
            >
              {policy.title}
            </button>
          ))}
        </div>

        <AdminEditorShell
          title={draft.title}
          dirty={dirty}
          saving={saving}
          status={status}
          onSave={handleSave}
          saveLabel="Save Policy"
        >
          <AdminFieldLabel>
            Page content
            <textarea
              className={adminTextareaClassName("min-h-80")}
              value={draft.content}
              onChange={(e) => patch({ content: e.target.value })}
            />
          </AdminFieldLabel>
        </AdminEditorShell>
      </div>
    </AdminLayout>
  );
}
