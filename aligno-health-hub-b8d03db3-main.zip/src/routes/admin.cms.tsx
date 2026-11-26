import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  AdminEditorShell,
  AdminFieldLabel,
  adminInputClassName,
  useAdminDraft,
} from "@/components/admin/admin-form";
import { cmsService } from "@/lib/store";

const SECTION_LABELS: Record<string, string> = {
  heroVisible: "Hero banner",
  trustStripVisible: "Trust strip",
  categoriesVisible: "Product categories",
  painAreaVisible: "Pain area section",
  bestSellersVisible: "Best sellers",
  postersVisible: "Posters",
  activityVisible: "Activities",
  brandBannerVisible: "Brand banner",
  brandRangeVisible: "Brand range",
  testimonialsVisible: "Testimonials",
  blogsVisible: "Blogs",
};

export const Route = createFileRoute("/admin/cms")({ component: Page });

function Page() {
  const source = cmsService.get();
  const { draft, dirty, saving, status, patch, runSave } = useAdminDraft(source, "cms");

  if (!draft) return null;

  const handleSave = () => {
    runSave(async () => {
      cmsService.set(draft);
    }, "CMS settings saved.");
  };

  return (
    <AdminLayout title="Website CMS">
      <AdminEditorShell
        title="Homepage & SEO"
        dirty={dirty}
        saving={saving}
        status={status}
        onSave={handleSave}
        saveLabel="Save CMS"
      >
        <AdminFieldLabel hint="Shown in the top announcement bar">
          Top bar text
          <input
            className={adminInputClassName("h-11")}
            value={draft.topBarText}
            onChange={(e) => patch({ topBarText: e.target.value })}
          />
        </AdminFieldLabel>

        <div>
          <p className="text-sm font-bold">Homepage sections</p>
          <p className="mt-1 text-xs text-muted-foreground">Toggle which blocks appear on the homepage.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(SECTION_LABELS) as (keyof typeof SECTION_LABELS)[]).map((key) => (
              <label
                key={key}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
                  draft[key] ? "border-gold bg-gold/10" : "border-border bg-white"
                }`}
              >
                <input type="checkbox" checked={draft[key]} onChange={(e) => patch({ [key]: e.target.checked })} />
                <span className="font-medium">{SECTION_LABELS[key]}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <AdminFieldLabel>
            SEO title
            <input className={adminInputClassName()} value={draft.seoTitle} onChange={(e) => patch({ seoTitle: e.target.value })} />
          </AdminFieldLabel>
          <AdminFieldLabel>
            SEO description
            <input
              className={adminInputClassName()}
              value={draft.seoDescription}
              onChange={(e) => patch({ seoDescription: e.target.value })}
            />
          </AdminFieldLabel>
        </div>
      </AdminEditorShell>
    </AdminLayout>
  );
}
