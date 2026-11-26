import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  AdminEditorShell,
  AdminFieldLabel,
  adminInputClassName,
  useAdminDraft,
} from "@/components/admin/admin-form";
import { footerService } from "@/lib/store";

export const Route = createFileRoute("/admin/footer")({ component: Page });

function Page() {
  const source = footerService.get();
  const { draft, dirty, saving, status, patch, runSave } = useAdminDraft(source, "footer");

  if (!draft) return null;

  return (
    <AdminLayout title="Footer Management">
      <AdminEditorShell
        title="Footer content"
        dirty={dirty}
        saving={saving}
        status={status}
        onSave={() => runSave(async () => footerService.set(draft), "Footer saved.")}
        saveLabel="Save Footer"
      >
        <div className="grid gap-4">
          <AdminFieldLabel>
            Description
            <input className={adminInputClassName("h-11")} value={draft.description} onChange={(e) => patch({ description: e.target.value })} />
          </AdminFieldLabel>
          <AdminFieldLabel>
            Address
            <input className={adminInputClassName("h-11")} value={draft.address} onChange={(e) => patch({ address: e.target.value })} />
          </AdminFieldLabel>
          <div className="grid gap-4 md:grid-cols-2">
            <AdminFieldLabel>
              Email
              <input className={adminInputClassName("h-11")} value={draft.email} onChange={(e) => patch({ email: e.target.value })} />
            </AdminFieldLabel>
            <AdminFieldLabel>
              Phone
              <input className={adminInputClassName("h-11")} value={draft.phone} onChange={(e) => patch({ phone: e.target.value })} />
            </AdminFieldLabel>
            <AdminFieldLabel>
              WhatsApp
              <input className={adminInputClassName("h-11")} value={draft.whatsapp} onChange={(e) => patch({ whatsapp: e.target.value })} />
            </AdminFieldLabel>
            <AdminFieldLabel>
              Copyright
              <input className={adminInputClassName("h-11")} value={draft.copyright} onChange={(e) => patch({ copyright: e.target.value })} />
            </AdminFieldLabel>
          </div>
        </div>
      </AdminEditorShell>
    </AdminLayout>
  );
}
