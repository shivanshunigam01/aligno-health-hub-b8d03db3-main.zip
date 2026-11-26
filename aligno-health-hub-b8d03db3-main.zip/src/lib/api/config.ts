/** Primary storefront API (Vercel). */
export const DEFAULT_API_URL = "https://aligno-health.vercel.app/api/v1";

/** Retired production host — ignore if still present in an old dev build. */
const LEGACY_API_URL = "https://api.myaligno.com/api/v1";

function resolveApiUrl(): string {
  const raw = (import.meta.env.VITE_API_URL as string | undefined)?.trim().replace(/\/$/, "");
  if (!raw || raw === LEGACY_API_URL) return DEFAULT_API_URL;
  return raw;
}

export const API_URL = resolveApiUrl();

export const TOKEN_KEY = "aligno_access_token";
export const REFRESH_KEY = "aligno_refresh_token";