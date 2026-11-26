import { API_URL, REFRESH_KEY, TOKEN_KEY } from "./config";

type ApiResult<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
  pagination?: { page: number; limit: number; total: number; pages: number };
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setTokens(access: string, refresh?: string) {
  localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean; json?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (options.json !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.auth !== false) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
    credentials: "include",
  });

  const payload = (await res.json().catch(() => ({}))) as ApiResult<T>;

  if (!res.ok || payload.success === false) {
    throw new ApiError(payload.message || `Request failed (${res.status})`, res.status);
  }

  return payload.data as T;
}

export async function apiUpload(path: string, files: File[], folder = "aligno") {
  const fd = new FormData();
  files.forEach((f) => fd.append(files.length === 1 ? "image" : "images", f));
  const token = getToken();
  const res = await fetch(`${API_URL}${path}?folder=${encodeURIComponent(folder)}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
    credentials: "include",
  });
  const payload = await res.json();
  if (!res.ok || !payload.success) throw new ApiError(payload.message || "Upload failed", res.status);
  const data = payload.data;
  if (data?.url) return [data.url as string];
  if (data?.urls) return data.urls as string[];
  if (data?.items) return (data.items as { url: string }[]).map((i) => i.url);
  return [];
}
