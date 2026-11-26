import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clearTokens, getToken } from "./api/client";
import { authApi } from "./api/services";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAdmin: boolean;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; msg?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; msg?: string }>;
  loginAdmin: (email: string, password: string) => Promise<{ ok: boolean; msg?: string }>;
  logout: () => void;
  logoutAdmin: () => void;
  restoreSession: () => Promise<void>;
  setHydrated: () => void;
}

function mapUser(u: Record<string, unknown>): AuthUser {
  return {
    id: String(u._id || u.id || ""),
    name: String(u.name || ""),
    email: String(u.email || ""),
    role: String(u.role || "customer"),
  };
}

function isAdminRole(role?: string) {
  return role === "admin" || role === "super_admin";
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAdmin: false,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      restoreSession: async () => {
        const token = getToken();
        if (!token) return;
        try {
          const u = mapUser(await authApi.me());
          set({ user: u, isAdmin: isAdminRole(u.role) });
          if (isAdminRole(u.role)) {
            import("./api/bootstrap").then((m) => m.refreshAdminData()).catch(console.error);
          }
        } catch {
          clearTokens();
          set({ user: null, isAdmin: false });
        }
      },
      login: async (email, password) => {
        try {
          const res = await authApi.login(email, password);
          const user = mapUser(res.user);
          if (isAdminRole(user.role)) {
            return { ok: false, msg: "Use admin login for admin accounts" };
          }
          set({ user, isAdmin: false });
          return { ok: true };
        } catch (e) {
          return { ok: false, msg: e instanceof Error ? e.message : "Invalid credentials" };
        }
      },
      register: async (name, email, password) => {
        try {
          const res = await authApi.register(name, email, password);
          const user = mapUser(res.user);
          set({ user, isAdmin: false });
          return { ok: true };
        } catch (e) {
          return { ok: false, msg: e instanceof Error ? e.message : "Registration failed" };
        }
      },
      loginAdmin: async (email, password) => {
        try {
          const res = await authApi.login(email, password);
          const user = mapUser(res.user);
          if (!isAdminRole(user.role)) {
            clearTokens();
            return { ok: false, msg: "Admin access required" };
          }
          set({ user, isAdmin: true });
          await import("./api/bootstrap").then((m) => m.refreshAdminData()).catch(console.error);
          return { ok: true };
        } catch (e) {
          clearTokens();
          return { ok: false, msg: e instanceof Error ? e.message : "Invalid admin credentials" };
        }
      },
      logout: () => {
        authApi.logout().catch(() => clearTokens());
        set({ user: null, isAdmin: false });
      },
      logoutAdmin: () => {
        authApi.logout().catch(() => clearTokens());
        set({ user: null, isAdmin: false });
      },
    }),
    {
      name: "aligno_auth",
      partialize: (s) => ({ user: s.user, isAdmin: s.isAdmin }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

export function hasAuthToken() {
  return !!getToken();
}

/** Call once on app boot to sync JWT with admin/user state */
export async function initAuth() {
  await new Promise<void>((resolve) => {
    if (useAuth.persist.hasHydrated()) {
      useAuth.getState().setHydrated();
      useAuth.getState().restoreSession().finally(resolve);
      return;
    }
    const unsub = useAuth.persist.onFinishHydration(() => {
      unsub();
      useAuth.getState().setHydrated();
      useAuth.getState().restoreSession().finally(resolve);
    });
  });
}

export function useAdminAuth() {
  const isAdmin = useAuth((s) => s.isAdmin);
  const hydrated = useAuth((s) => s.hydrated);
  return { isAdmin, hydrated, ready: hydrated && isAdmin };
}
