import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  Activity,
  BarChart3,
  Bone,
  BookOpen,
  FolderTree,
  Globe,
  Image,
  Layout,
  LayoutDashboard,
  MapPin,
  Package,
  PanelBottom,
  Phone,
  ScrollText,
  Settings,
  Shield,
  ShoppingCart,
  Star,
  UserPlus,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = { label: string; href: string; icon: LucideIcon };

const catalogNav: NavItem[] = [
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
];

const storeNav: NavItem[] = [
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Leads", href: "/admin/leads", icon: UserPlus },
];

const contentNav: NavItem[] = [
  { label: "Banners", href: "/admin/banners", icon: Image },
  { label: "Posters", href: "/admin/posters", icon: Layout },
  { label: "Trust Strip", href: "/admin/trust-strip", icon: Shield },
  { label: "Blogs", href: "/admin/blogs", icon: BookOpen },
  { label: "Body Parts", href: "/admin/body-parts", icon: Bone },
  { label: "Pain Areas", href: "/admin/pain-areas", icon: MapPin },
  { label: "Activities", href: "/admin/activities", icon: Activity },
];

const settingsNav: NavItem[] = [
  { label: "Website CMS", href: "/admin/cms", icon: Globe },
  { label: "Footer", href: "/admin/footer", icon: PanelBottom },
  { label: "Contact", href: "/admin/contact-details", icon: Phone },
  { label: "Policies", href: "/admin/policies", icon: ScrollText },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin" || pathname === "/admin/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isActive(pathname, item.href);
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      onClick={onNavigate}
      className={cn(
        "mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
        active
          ? "bg-gold font-semibold text-ink shadow-sm"
          : "text-white/75 hover:bg-white/10 hover:text-white",
      )}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-90" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function NavSection({
  title,
  items,
  pathname,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="mb-4">
      <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-white/35">{title}</p>
      {items.map((item) => (
        <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

export function AdminNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="p-2">
      <NavLink
        item={{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }}
        pathname={pathname}
        onNavigate={onNavigate}
      />
      <NavSection title="Catalog" items={catalogNav} pathname={pathname} onNavigate={onNavigate} />
      <NavSection title="Store" items={storeNav} pathname={pathname} onNavigate={onNavigate} />
      <NavSection title="Site Content" items={contentNav} pathname={pathname} onNavigate={onNavigate} />
      <NavSection title="Settings" items={settingsNav} pathname={pathname} onNavigate={onNavigate} />
    </nav>
  );
}
