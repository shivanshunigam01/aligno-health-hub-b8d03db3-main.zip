import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { pageHead, PUBLIC_ROUTE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/_site/account")({
  head: () => pageHead(PUBLIC_ROUTE_SEO["/account"]),
  component: AccountPage,
});

function AccountPage() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const nav = useNavigate();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Please login to continue</h1>
        <Link to="/login" className="mt-4 inline-block rounded-full bg-gold px-6 py-3 font-bold text-ink">Login</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-black">My Account</h1>
      <div className="mt-6 rounded-2xl border border-border bg-white p-6">
        <p className="text-sm text-muted-foreground">Name</p>
        <p className="font-semibold">{user.name}</p>
        <p className="mt-4 text-sm text-muted-foreground">Email</p>
        <p className="font-semibold">{user.email}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/orders" className="rounded-full border border-border px-5 py-2 font-semibold">My Orders</Link>
          <Link to="/track-order" className="rounded-full border border-border px-5 py-2 font-semibold">Track Order</Link>
          <button
            onClick={() => {
              logout();
              nav({ to: "/" });
            }}
            className="rounded-full bg-ink px-5 py-2 font-semibold text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
