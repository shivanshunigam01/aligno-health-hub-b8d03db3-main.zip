import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type SectionCarouselProps = {
  children: React.ReactNode;
  /** Tailwind basis / width classes per slide, e.g. `basis-44 md:basis-56` */
  itemClassName?: string;
  className?: string;
  loop?: boolean;
  navButtonClassName?: string;
  /** How many slides move per arrow click */
  slidesToScroll?: number;
  /** Auto-advance interval in ms (omit to disable) */
  autoplayMs?: number;
  /** Pause auto-advance while hovered */
  pauseOnHover?: boolean;
};

export function SectionCarousel({
  children,
  itemClassName = "basis-auto",
  className,
  loop = false,
  navButtonClassName,
  slidesToScroll = 1,
  autoplayMs,
  pauseOnHover = true,
}: SectionCarouselProps) {
  const items = React.Children.toArray(children).filter(Boolean);
  const [api, setApi] = React.useState<CarouselApi>();
  const [canScroll, setCanScroll] = React.useState({ prev: false, next: false });
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;
    const update = () => {
      setCanScroll({
        prev: api.canScrollPrev(),
        next: api.canScrollNext(),
      });
    };
    update();
    api.on("reInit", update);
    api.on("select", update);
    return () => {
      api.off("reInit", update);
      api.off("select", update);
    };
  }, [api]);

  React.useEffect(() => {
    if (!api || !autoplayMs || items.length <= 1 || paused) return;
    const id = window.setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [api, autoplayMs, items.length, loop, paused]);

  if (items.length === 0) return null;

  const nav = cn(
    "z-20 h-10 w-10 border shadow-lg transition disabled:opacity-0",
    navButtonClassName,
  );

  const showNav = items.length > 1 && (canScroll.prev || canScroll.next || loop);

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={pauseOnHover && autoplayMs ? () => setPaused(true) : undefined}
      onMouseLeave={pauseOnHover && autoplayMs ? () => setPaused(false) : undefined}
    >
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop,
          dragFree: false,
          slidesToScroll,
          containScroll: "trimSnaps",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {items.map((child, i) => (
            <CarouselItem key={i} className={cn("pl-3 md:pl-4", itemClassName)}>
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
        {showNav && (
          <>
            <CarouselPrevious
              className={cn(
                nav,
                "left-0 top-[calc(50%-0.75rem)] -translate-y-1/2 md:-left-5",
              )}
            />
            <CarouselNext
              className={cn(
                nav,
                "right-0 top-[calc(50%-0.75rem)] -translate-y-1/2 md:-right-5",
              )}
            />
          </>
        )}
      </Carousel>
    </div>
  );
}