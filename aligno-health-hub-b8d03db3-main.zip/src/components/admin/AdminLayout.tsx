import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { ASSETS } from "@/lib/assets";
import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ExternalLink, LogOut, Menu } from "lucide-react";

export function AdminLayout({ title, children }: { title: string; children: React.ReactNode }) {
  const pathname = useLocation({ select: (l) => l.pathname });
  const logoutAdmin = useAuth((s) => s.logoutAdmin);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="flex min-h-screen bg-secondary/60">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-ink text-white lg:flex">
        <div className="flex h-16 items-center border-b border-white/10 px-5">
          <Link to="/admin" className="flex items-center gap-2">
            <img src={ASSETS.logo} alt="Aligno" className="h-9 w-auto" />
            <span className="text-sm font-black tracking-tight text-gold">Admin</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <AdminNav pathname={pathname} />
        </ScrollArea>
        <div className="border-t border-white/10 p-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            View Storefront
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:h-16 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 lg:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[min(100vw-2rem,18rem)] border-r bg-ink p-0 text-white [&>button]:text-white [&>button]:opacity-80 [&>button]:hover:opacity-100"
              >
                <SheetHeader className="border-b border-white/10 px-5 py-4 text-left">
                  <SheetTitle className="flex items-center gap-2 font-black text-gold">
                    <img src={ASSETS.logo} alt="Aligno" className="h-8 w-auto" />
                    Admin
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  <AdminNav pathname={pathname} onNavigate={closeMobile} />
                </ScrollArea>
                <div className="border-t border-white/10 p-3">
                  <Link
                    to="/"
                    onClick={closeMobile}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Storefront
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black sm:text-xl">{title}</h1>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logoutAdmin}
            className="shrink-0 gap-1.5 font-semibold"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
