import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { pageHead, PUBLIC_ROUTE_SEO } from "@/lib/seo";
import { useState } from "react";

export const Route = createFileRoute("/_site/register")({
  head: () => pageHead(PUBLIC_ROUTE_SEO["/register"]),
  component: RegisterPage,
});

function RegisterPage() {
  const nav = useNavigate();
  const register = useAuth((s) => s.register);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    setError("");
    const res = await register(name, email, password);
    setLoading(false);
    if (!res.ok) return setError(res.msg || "Unable to register");
    nav({ to: "/account" });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-black">Create Account</h1>
      <div className="mt-6 space-y-3 rounded-2xl border border-border bg-white p-6">
        <input className="h-11 w-full rounded-xl border border-border px-4 text-sm" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="h-11 w-full rounded-xl border border-border px-4 text-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="h-11 w-full rounded-xl border border-border px-4 text-sm" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button onClick={onSubmit} disabled={loading} className="w-full rounded-full bg-gold py-3 font-bold text-ink disabled:opacity-50">
          {loading ? "Creating account…" : "Create Account"}
        </button>
        <p className="text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="font-semibold text-gold">Login</Link>
        </p>
      </div>
    </div>
  );
}
