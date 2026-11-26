import { Children, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminSaveStatus = { type: "ok" | "err"; text: string } | null;

export function useAdminDraft<T>(source: T | null | undefined, resetKey: string) {
  const [draft, setDraft] = useState<T | null>(source ?? null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<AdminSaveStatus>(null);

  useEffect(() => {
    if (source) {
      setDraft({ ...source });
      setDirty(false);
      setStatus(null);
    } else {
      setDraft(null);
      setDirty(false);
      setStatus(null);
    }
  }, [resetKey]);

  const patch = (partial: Partial<T>) => {
    setDraft((current) => (current ? { ...current, ...partial } : current));
    setDirty(true);
    setStatus(null);
  };

  const confirmDiscard = (message = "You have unsaved changes. Discard them?") => {
    if (!dirty) return true;
    return globalThis.confirm(message);
  };

  const runSave = async (action: () => void | Promise<void>, successMessage = "Saved successfully.") => {
    setSaving(true);
    setStatus(null);
    try {
      await action();
      setDirty(false);
      setStatus({ type: "ok", text: successMessage });
    } catch (err) {
      setStatus({
        type: "err",
        text: err instanceof Error ? err.message : "Could not save. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return { draft, setDraft, dirty, setDirty, saving, status, setStatus, patch, confirmDiscard, runSave };
}

export function AdminStatusMessage({ status }: { status: AdminSaveStatus }) {
  if (!status) return null;
  return (
    <p
      className={cn(
        "mb-4 rounded-xl px-4 py-2.5 text-sm font-semibold",
        status.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800",
      )}
    >
      {status.text}
    </p>
  );
}

export function AdminUnsavedBadge({ dirty }: { dirty: boolean }) {
  if (!dirty) return null;
  return <span className="text-xs font-semibold text-gold">Unsaved changes</span>;
}

export function AdminSaveBar({
  dirty,
  saving,
  onSave,
  label = "Save Changes",
  className,
}: {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-end gap-2", className)}>
      <Button
        type="button"
        onClick={onSave}
        disabled={!dirty || saving}
        className="gap-2 rounded-full bg-gold font-bold text-ink hover:bg-gold/90 disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? "Saving…" : label}
      </Button>
    </div>
  );
}

export function AdminEditorShell({
  title,
  dirty,
  saving,
  status,
  onSave,
  saveLabel,
  headerActions,
  children,
  footer,
}: {
  title: string;
  dirty: boolean;
  saving: boolean;
  status: AdminSaveStatus;
  onSave: () => void;
  saveLabel?: string;
  headerActions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-white p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black">{title}</h3>
          <AdminUnsavedBadge dirty={dirty} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AdminSaveBar dirty={dirty} saving={saving} onSave={onSave} label={saveLabel} className="!justify-start" />
          {headerActions}
        </div>
      </div>
      <AdminStatusMessage status={status} />
      {children}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        {footer}
        <AdminSaveBar dirty={dirty} saving={saving} onSave={onSave} label={saveLabel ?? "Save"} />
      </div>
    </div>
  );
}

export function AdminFieldLabel({ children, hint, className }: { children: ReactNode; hint?: string; className?: string }) {
  return (
    <label className={cn("block text-sm [&_input]:mt-1 [&_select]:mt-1 [&_textarea]:mt-1", className)}>
      {hint && <span className="mb-1 block text-xs font-normal text-muted-foreground">{hint}</span>}
      {Children.map(children, (child, index) =>
        typeof child === "string" ? (
          <span key={index} className="font-bold">
            {child}
          </span>
        ) : (
          child
        ),
      )}
    </label>
  );
}

export function adminInputClassName(extra = "") {
  return cn("mt-1 h-10 w-full rounded-xl border border-border px-3 text-sm", extra);
}

export function adminTextareaClassName(extra = "") {
  return cn("mt-1 min-h-24 w-full rounded-xl border border-border px-3 py-2 text-sm", extra);
}
