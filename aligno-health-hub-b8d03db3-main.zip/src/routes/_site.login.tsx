import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { pageHead, PUBLIC_ROUTE_SEO } from "@/lib/seo";
import { useState } from "react";

export const Route = createFileRoute("/_site/login")({
  head: () => pageHead(PUBLIC_ROUTE_SEO["/login"]),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const login = useAuth((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    setError("");
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) return setError(res.msg || "Unable to login");
    nav({ to: "/account" });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-black">Login</h1>
      <div className="mt-6 space-y-3 rounded-2xl border border-border bg-white p-6">
        <label className="block text-sm">
          <span className="sr-only">Email</span>
          <input className="h-11 w-full rounded-xl border border-border px-4 text-sm" placeholder="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="sr-only">Password</span>
          <input className="h-11 w-full rounded-xl border border-border px-4 text-sm" placeholder="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button type="button" onClick={onSubmit} disabled={loading} className="w-full rounded-full bg-gold py-3 font-bold text-ink disabled:opacity-50">
          {loading ? "Logging in…" : "Login"}
        </button>
        <p className="text-sm text-muted-foreground">
          New user? <Link to="/register" className="font-semibold text-gold">Create account</Link>
        </p>
      </div>
    </div>
  );
}
