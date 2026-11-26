import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminEmptyState, AdminPanel, AdminPanelBody, AdminPanelHeader, AdminStatusBadge } from "@/components/admin/admin-ui";
import { AdminStatusMessage } from "@/components/admin/admin-form";
import { leadService, useStore } from "@/lib/store";
import type { Lead } from "@/lib/types";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/leads")({ component: Page });
const statuses: Lead["status"][] = ["New", "Contacted", "Converted", "Closed"];

function Page() {
  const leads = useStore(() => leadService.list());
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const updateStatus = (id: string, value: Lead["status"]) => {
    leadService.update(id, { status: value });
    setStatus({ type: "ok", text: "Lead status saved." });
  };

  return (
    <AdminLayout title="Leads">
      <AdminStatusMessage status={status} />
      <AdminPanel>
        <AdminPanelHeader title="Lead Pipeline" description={`${leads.length} lead${leads.length === 1 ? "" : "s"} total`} />
        <AdminPanelBody className="pt-0">
          {leads.length === 0 ? (
            <AdminEmptyState title="No leads yet" description="Contact form submissions will show up here." />
          ) : (
            <div className="space-y-3">
              {leads.map((l) => (
                <div
                  key={l.id}
                  className="rounded-xl border border-border p-4 transition hover:border-gold/30 hover:shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{l.name}</p>
                        <AdminStatusBadge status={l.status} />
                      </div>
                      <p className="truncate text-sm text-muted-foreground">{l.email}</p>
                      <p className="text-xs text-muted-foreground">Source: {l.source}</p>
                    </div>
                    <Select
                      value={l.status}
                      onValueChange={(value) => updateStatus(l.id, value as Lead["status"])}
                    >
                      <SelectTrigger className="h-9 w-full min-w-[140px] rounded-lg sm:w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminPanelBody>
      </AdminPanel>
    </AdminLayout>
  );
}
