import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  AdminEditorShell,
  AdminFieldLabel,
  adminInputClassName,
  useAdminDraft,
} from "@/components/admin/admin-form";
import { contactService } from "@/lib/store";

export const Route = createFileRoute("/admin/contact-details")({ component: Page });

function Page() {
  const source = contactService.get();
  const { draft, dirty, saving, status, patch, runSave } = useAdminDraft(source, "contact");

  if (!draft) return null;

  return (
    <AdminLayout title="Contact Details">
      <AdminEditorShell
        title="Contact information"
        dirty={dirty}
        saving={saving}
        status={status}
        onSave={() => runSave(async () => contactService.set(draft), "Contact details saved.")}
        saveLabel="Save Contact"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AdminFieldLabel>
            Business name
            <input className={adminInputClassName("h-11")} value={draft.businessName} onChange={(e) => patch({ businessName: e.target.value })} />
          </AdminFieldLabel>
          <AdminFieldLabel>
            Hours
            <input className={adminInputClassName("h-11")} value={draft.hours} onChange={(e) => patch({ hours: e.target.value })} />
          </AdminFieldLabel>
          <AdminFieldLabel className="md:col-span-2">
            Address
            <input className={adminInputClassName("h-11")} value={draft.address} onChange={(e) => patch({ address: e.target.value })} />
          </AdminFieldLabel>
          <AdminFieldLabel>
            Phone
            <input className={adminInputClassName("h-11")} value={draft.phone} onChange={(e) => patch({ phone: e.target.value })} />
          </AdminFieldLabel>
          <AdminFieldLabel>
            Email
            <input className={adminInputClassName("h-11")} value={draft.email} onChange={(e) => patch({ email: e.target.value })} />
          </AdminFieldLabel>
          <AdminFieldLabel>
            WhatsApp
            <input className={adminInputClassName("h-11")} value={draft.whatsapp} onChange={(e) => patch({ whatsapp: e.target.value })} />
          </AdminFieldLabel>
          <AdminFieldLabel>
            Map link
            <input className={adminInputClassName("h-11")} value={draft.mapLink} onChange={(e) => patch({ mapLink: e.target.value })} />
          </AdminFieldLabel>
        </div>
      </AdminEditorShell>
    </AdminLayout>
  );
}
