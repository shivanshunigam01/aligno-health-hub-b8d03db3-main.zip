import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminEmptyState, AdminPanel, AdminPanelBody, AdminPanelHeader, AdminStatCard, AdminStatusBadge } from "@/components/admin/admin-ui";
import { getCatalogProducts, getEnabledCategories } from "@/lib/catalog";
import { customerService, leadService, orderService, reviewService, useStore } from "@/lib/store";
import { useEffect } from "react";import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FolderTree,
  IndianRupee,
  Package,
  ShoppingCart,
  Star,
  Users,
  UserPlus,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({ component: AdminDashboardPage });

const STATUS_COLORS = ["#D4AF37", "#23282D", "#006B4F", "#F8C94A", "#111418", "#D9D9D9"];

function AdminDashboardPage() {
  useEffect(() => {
    import("@/lib/api/bootstrap").then((m) => m.refreshAdminData()).catch(console.error);
  }, []);

  const orders = useStore(() => orderService.list());
  const products = useStore(() => getCatalogProducts());
  const categories = useStore(() => getEnabledCategories());
  const reviews = useStore(() => reviewService.list());
  const leads = useStore(() => leadService.list());
  const customers = useStore(() => customerService.list());  const pendingReviews = reviews.filter((r) => !r.approved).length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const completedOrders = orders.filter((o) => o.status === "Delivered").length;
  const lowStock = products.filter((p) => p.stock < 10);

  const statusData = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"].map((s) => ({
    name: s,
    value: orders.filter((o) => o.status === s).length,
  }));

  const activityData = categories.map((c) => ({
    name: c.name.length > 12 ? `${c.name.slice(0, 12)}…` : c.name,
    sales: products.filter((p) => p.category === c.slug).length,
  }));

  return (
    <AdminLayout title="Dashboard">
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/products" className="group block">
          <AdminStatCard
            label="Catalog Products"
            value={String(products.length)}
            hint="Upload photos & descriptions"
            icon={Package}
            accent
            className="h-full group-hover:border-gold/60"
          />
        </Link>
        <Link to="/admin/categories" className="group block">
          <AdminStatCard
            label="Live Categories"
            value={String(categories.length)}
            hint="Manage shop categories"
            icon={FolderTree}
            className="h-full group-hover:border-gold/50"
          />
        </Link>
        <Link to="/admin/reviews" className="group block sm:col-span-2 lg:col-span-1">
          <AdminStatCard
            label="Reviews"
            value={String(reviews.length)}
            hint={`${pendingReviews} pending approval`}
            icon={Star}
            className="h-full group-hover:border-gold/50"
          />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        <AdminStatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString("en-IN")}`} icon={IndianRupee} />
        <AdminStatCard label="Total Orders" value={String(orders.length)} icon={ShoppingCart} />
        <AdminStatCard label="Customers" value={String(customers.length)} icon={Users} />
        <AdminStatCard label="Leads" value={String(leads.length)} icon={UserPlus} />
        <AdminStatCard label="Pending Orders" value={String(pendingOrders)} icon={Clock} />
        <AdminStatCard label="Completed" value={String(completedOrders)} icon={CheckCircle2} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AdminPanel>
          <AdminPanelHeader title="Products by Category" />
          <AdminPanelBody className="pt-0">
            <div className="h-56 sm:h-64">
              {activityData.length === 0 ? (
                <AdminEmptyState title="No categories yet" description="Add categories to see product distribution." />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Order Status" />
          <AdminPanelBody className="pt-0">
            <div className="h-56 sm:h-64">
              {orders.length === 0 ? (
                <AdminEmptyState title="No orders yet" description="Order status breakdown will appear here." />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={statusData.filter((d) => d.value > 0)}
                      outerRadius={80}
                      label={({ name, value }) => (value ? `${name}: ${value}` : "")}
                    >
                      {statusData.map((_, i) => (
                        <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </AdminPanelBody>
        </AdminPanel>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AdminPanel>
          <AdminPanelHeader
            title="Recent Orders"
            action={
              <Link to="/admin/orders" className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <AdminPanelBody className="pt-0">
            {orders.length === 0 ? (
              <AdminEmptyState title="No orders yet" />
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 5).map((o) => (
                  <div
                    key={o.id}
                    className="flex flex-col gap-2 rounded-xl bg-secondary/80 px-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="font-medium">{o.id}</span>
                    <AdminStatusBadge status={o.status} />
                    <span className="font-bold sm:text-right">₹{o.total.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            )}
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader
            title="Low Stock Products"
            action={
              <Link to="/admin/products" className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline">
                Manage <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <AdminPanelBody className="pt-0">
            {lowStock.length === 0 ? (
              <AdminEmptyState title="All products are well stocked" />
            ) : (
              <div className="space-y-2">
                {lowStock.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col gap-1 rounded-xl bg-secondary/80 px-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="font-medium">{p.name}</span>
                    <span className="font-bold text-destructive">{p.stock} left</span>
                  </div>
                ))}
              </div>
            )}
          </AdminPanelBody>
        </AdminPanel>
      </div>
    </AdminLayout>
  );
}
