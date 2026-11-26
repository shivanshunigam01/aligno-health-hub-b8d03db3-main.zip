const CLOUDINARY_HOST = "res.cloudinary.com";

/** Sharpen hero banners served from Cloudinary (source files are often ~1024px wide). */
export function optimizeHeroImage(url: string, width = 1920): string {
  if (!url || !url.includes(CLOUDINARY_HOST)) return url;
  if (url.includes("e_upscale,")) return url;

  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const transform = `e_upscale,w_${width},c_limit,q_auto:good,f_auto/`;
  const rest = url.slice(idx + marker.length).replace(/^v\d+\//, "");
  return `${url.slice(0, idx + marker.length)}${transform}${rest}`;
}

export function heroImageSrcSet(url: string): string | undefined {
  if (!url.includes(CLOUDINARY_HOST)) return undefined;
  return [1280, 1920, 2560].map((w) => `${optimizeHeroImage(url, w)} ${w}w`).join(", ");
}
