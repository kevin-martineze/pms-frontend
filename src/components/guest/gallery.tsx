"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Grid2x2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Galería de la unidad.
 *
 * La retícula es 1 grande + 4 chicas porque la primera foto es el LCP de la
 * página y merece el peso; las otras cuatro dan contexto sin competir. Con
 * menos de cinco fotos la retícula se colapsa en vez de rellenarse con huecos:
 * un placeholder gris comunica "falta trabajo", no "hay menos fotos".
 */
export function Gallery({ photos }: { photos: { src: string; alt: string }[] }) {
  const { t } = useI18n();
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const show = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const next = React.useCallback(
    () => setIndex((i) => (i + 1) % photos.length),
    [photos.length],
  );
  const prev = React.useCallback(
    () => setIndex((i) => (i - 1 + photos.length) % photos.length),
    [photos.length],
  );

  React.useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev]);

  const rest = photos.slice(1, 5);

  return (
    <>
      <div
        className={cn(
          "relative grid gap-2 overflow-hidden rounded-3xl",
          rest.length > 0 ? "md:grid-cols-2" : "",
        )}
      >
        <button
          type="button"
          onClick={() => show(0)}
          className="group relative aspect-[4/3] overflow-hidden bg-muted md:aspect-auto md:min-h-[26rem]"
        >
          <Image
            src={photos[0].src}
            alt={photos[0].alt}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
          />
        </button>

        {rest.length > 0 && (
          <div className="hidden grid-cols-2 gap-2 md:grid">
            {rest.map((photo, i) => (
              <button
                key={photo.src + i}
                type="button"
                onClick={() => show(i + 1)}
                className="group relative aspect-[4/3] overflow-hidden bg-muted"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                />
              </button>
            ))}
          </div>
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => show(0)}
          className="absolute bottom-4 right-4 gap-2 bg-background/90 backdrop-blur hover:bg-background"
        >
          <Grid2x2 className="size-4" aria-hidden />
          {t.unit.seeAllPhotos(photos.length)}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-none border-0 bg-black/95 p-0 sm:max-w-[min(72rem,94vw)]"
        >
          <DialogTitle className="sr-only">
            {t.unit.photosOf} {photos[index].alt}
          </DialogTitle>

          <div className="relative flex aspect-[3/2] items-center justify-center">
            <Image
              src={photos[index].src}
              alt={photos[index].alt}
              fill
              sizes="94vw"
              className="object-contain"
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              className="absolute left-3 size-11 rounded-full bg-black/45 text-white hover:bg-black/65 hover:text-white"
            >
              <ChevronLeft className="size-5" aria-hidden />
              <span className="sr-only">{t.unit.previousPhoto}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              className="absolute right-3 size-11 rounded-full bg-black/45 text-white hover:bg-black/65 hover:text-white"
            >
              <ChevronRight className="size-5" aria-hidden />
              <span className="sr-only">{t.unit.nextPhoto}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 size-10 rounded-full bg-black/45 text-white hover:bg-black/65 hover:text-white"
            >
              <X className="size-5" aria-hidden />
              <span className="sr-only">{t.common.close}</span>
            </Button>
          </div>

          <div className="flex items-center justify-between gap-4 px-5 pb-5 text-sm text-white/70">
            <p>{photos[index].alt}</p>
            <p className="tnum shrink-0">
              {index + 1} / {photos.length}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
