/**
 * Smoke-test public catalog API endpoints (axios).
 * Usage: node scripts/test-api.mjs [baseUrl]
 */
import axios from "axios";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(root, ".env") });

const base =
  process.argv[2] ||
  process.env.VITE_API_URL ||
  "https://aligno-health.vercel.app/api/v1";

const ENDPOINTS = [
  { name: "products", path: "/products?limit=5", expectArray: true },
  { name: "categories", path: "/categories", expectArray: true },
  { name: "body-parts", path: "/body-parts", expectArray: true },
  { name: "pain-areas", path: "/pain-areas", expectArray: true },
  { name: "activities", path: "/activities", expectArray: true },
  { name: "banners", path: "/banners?limit=50", expectArray: true },
  { name: "posters", path: "/posters", expectArray: true },
  { name: "trust-strip", path: "/trust-strip", expectArray: true },
  { name: "blogs", path: "/blogs", expectArray: true },
  { name: "testimonials", path: "/testimonials?limit=50", expectArray: true },
  { name: "cms", path: "/cms", expectArray: false },
  { name: "footer", path: "/footer", expectArray: false },
  { name: "contact-info", path: "/contact-info", expectArray: false },
  { name: "policies", path: "/policies", expectArray: true },
];

async function check({ name, path: p, expectArray }) {
  const url = `${base.replace(/\/$/, "")}${p}`;
  try {
    const res = await axios.get(url, { timeout: 30000, validateStatus: () => true });
    const body = res.data;
    const okShape =
      body &&
      typeof body === "object" &&
      body.success !== false &&
      body.data !== undefined;
    const data = body?.data;
    const okData = expectArray ? Array.isArray(data) : data !== null && typeof data === "object";
    const pass = res.status >= 200 && res.status < 300 && okShape && okData;
    const count = expectArray && Array.isArray(data) ? data.length : undefined;
    return {
      name,
      pass,
      status: res.status,
      count,
      message: pass ? "OK" : body?.message || `HTTP ${res.status}`,
    };
  } catch (err) {
    return { name, pass: false, status: 0, message: err.message || String(err) };
  }
}

async function main() {
  console.log(`API base: ${base}\n`);
  const results = [];
  for (const ep of ENDPOINTS) {
    const r = await check(ep);
    results.push(r);
    const extra = r.count !== undefined ? ` (${r.count} items)` : "";
    console.log(`${r.pass ? "✓" : "✗"} ${r.name.padEnd(16)} ${r.status} ${r.message}${extra}`);
  }
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) process.exit(1);
}

main();