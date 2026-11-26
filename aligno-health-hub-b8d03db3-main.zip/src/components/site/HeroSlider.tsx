import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveHeroBanners } from "@/lib/heroBanners";
import { heroImageSrcSet, optimizeHeroImage } from "@/lib/heroImage";
import { getBodyParts } from "@/lib/catalog";
import { bannerService, trustStripService, useStore } from "@/lib/store";

export function HeroSlider() {
  const allBanners = useStore(() => bannerService.list());
  const bodyParts = useStore(() => getBodyParts());
  const trustStrip = useStore(() => trustStripService.list());
  const fallbackImages = useMemo(
    () => [
      ...trustStrip.map((item) => item.image).filter(Boolean) as string[],
      ...bodyParts.map((part) => part.image).filter(Boolean),
    ],
    [trustStrip, bodyParts],
  );
  const banners = useMemo(() => resolveHeroBanners(allBanners, fallbackImages), [allBanners, fallbackImages]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    if (idx >= banners.length) setIdx(0);
  }, [banners.length, idx]);

  useEffect(() => {
    if (banners.length === 0) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (banners.length === 0) return null;
  const b = banners[idx];
  const heroSrc = optimizeHeroImage(b.image);
  const heroSet = heroImageSrcSet(b.image);

  const renderSlideImage = (banner: (typeof banners)[number], i: number) => {
    const src = optimizeHeroImage(banner.image);
    const srcSet = heroImageSrcSet(banner.image);
    return (
      <img
        src={src}
        srcSet={srcSet}
        alt={banner.title}
        decoding="async"
        fetchPriority={i === idx ? "high" : "auto"}
        sizes="100vw"
        className="block h-auto w-full"
      />
    );
  };

  return (
    <section
      className="relative w-full min-h-[240px] overflow-hidden bg-ink sm:min-h-[320px] md:min-h-[420px]"
      aria-roledescription="carousel"
      aria-label="Featured promotions"
    >
      {/* In-flow spacer sets height; visible slides use the same natural scale (no object-cover upscaling) */}
      <img
        src={heroSrc}
        srcSet={heroSet}
        alt=""
        aria-hidden
        className="block h-auto w-full select-none invisible"
      />
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className={`absolute inset-x-0 top-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          {banner.layout === "designed" ? (
            <Link to={banner.ctaLink} className="block">
              {renderSlideImage(banner, i)}
            </Link>
          ) : (
            <>
              {renderSlideImage(banner, i)}
              <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent" />
            </>
          )}
        </div>
      ))}

      {b.layout === "overlay" && (
        <div className="absolute inset-0 z-10 mx-auto flex max-w-7xl items-center px-6">
          <div key={b.id} className="max-w-xl animate-in fade-in slide-in-from-bottom-4 text-white duration-500">
            {b.offer && (
              <span className="inline-block rounded-full bg-gold px-4 py-1 text-xs font-extrabold tracking-widest text-ink">
                {b.offer}
              </span>
            )}
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">{b.title}</h2>
            {b.subtitle && <p className="mt-3 text-base text-white/80 md:text-lg">{b.subtitle}</p>}
            <Link
              to={b.ctaLink}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold text-ink hover:brightness-95"
            >
              {b.ctaText} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIdx((i) => (i - 1 + banners.length) % banners.length)}
            className="absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-gold hover:text-ink"
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={() => setIdx((i) => (i + 1) % banners.length)}
            className="absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-gold hover:text-ink"
            aria-label="Next slide"
          >
            <ChevronRight />
          </button>
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {banners.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === idx ? "true" : undefined}
                className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-gold" : "w-2 bg-white/60"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
