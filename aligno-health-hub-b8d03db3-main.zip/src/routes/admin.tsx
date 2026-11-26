import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { initAuth, useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ASSETS } from "@/lib/assets";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin")({
  head: () => pageHead({ title: "Admin", description: "Aligno admin panel", path: "/admin", noindex: true }),
  component: AdminLayoutRoute,
});

function AdminLayoutRoute() {
  const isAdmin = useAuth((s) => s.isAdmin);
  const hydrated = useAuth((s) => s.hydrated);
  const loginAdmin = useAuth((s) => s.loginAdmin);
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@alignohealthhub.com");
  const [password, setPassword] = useState("Admin@12345");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    initAuth().finally(() => setBooting(false));
  }, []);

  if (booting || !hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 items-center justify-center">
              <img src={ASSETS.logo} alt="Aligno" className="h-14 w-auto sm:h-16" />
            </div>
            <h1 className="text-2xl font-black text-white sm:text-3xl">Admin Login</h1>
            <p className="mt-2 text-sm text-white/60">Sign in to manage your Aligno store</p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  className="h-11 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@alignohealthhub.com"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    className="h-11 rounded-xl pr-11"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    onKeyDown={(e) => e.key === "Enter" && !loading && handleLogin()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {err && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                  {err}
                </p>
              )}
              <Button
                className="h-11 w-full rounded-full bg-gold font-bold text-ink hover:bg-gold/90"
                disabled={loading}
                onClick={handleLogin}
              >
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;

  async function handleLogin() {
    setLoading(true);
    setErr("");
    const res = await loginAdmin(email, password);
    setLoading(false);
    if (!res.ok) return setErr(res.msg || "Invalid credentials");
    nav({ to: "/admin" });
  }
}
