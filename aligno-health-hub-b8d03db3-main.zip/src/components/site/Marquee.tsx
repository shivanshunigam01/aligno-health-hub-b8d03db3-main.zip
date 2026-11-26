import { useMemo } from "react";
import { Globe, Award, Truck, Stethoscope, ShieldCheck, BadgeCheck, RotateCcw, Sparkles, type LucideIcon } from "lucide-react";
import { trustStripService, useStore } from "@/lib/store";

const ICONS: Record<string, LucideIcon> = { Globe, Award, Truck, Stethoscope, ShieldCheck, BadgeCheck, RotateCcw, Sparkles };

export function Marquee() {
  const allItems = useStore(() => trustStripService.list());
  const items = useMemo(
    () => allItems.filter((i) => i.enabled).sort((a, b) => a.order - b.order),
    [allItems],
  );
  if (items.length === 0) return null;
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-border bg-white py-4">
      <div className="marquee-track gap-10">
        {doubled.map((it, i) =>
          it.image ? (
            <img
              key={i}
              src={it.image}
              alt={it.title}
              className="h-14 w-auto shrink-0 object-contain md:h-16"
              draggable={false}
            />
          ) : (
            <div key={i} className="flex shrink-0 items-center gap-3 px-2">
              {(() => {
                const Icon = ICONS[it.icon] ?? Sparkles;
                return <Icon className="h-7 w-7 text-ink" />;
              })()}
              <div>
                <div className="text-sm font-bold leading-tight text-ink">{it.title}</div>
                <div className="text-xs text-muted-foreground">{it.subtitle}</div>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
