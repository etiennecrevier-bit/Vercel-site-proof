'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Download, MapPin, User, X } from 'lucide-react'
import type { Photo } from '@/lib/intervention'
import { Button } from '@/components/ui/button'

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const go = useCallback(
    (dir: 1 | -1) => {
      setOpenIndex((cur) => {
        if (cur === null) return cur
        const next = cur + dir
        if (next < 0) return photos.length - 1
        if (next >= photos.length) return 0
        return next
      })
    },
    [photos.length],
  )

  return (
    <section aria-labelledby="gallery-heading">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="gallery-heading" className="text-base font-semibold tracking-tight text-foreground">
          Galerie{' '}
          <span className="tnum font-normal text-muted-foreground">· {photos.length} photos</span>
        </h2>
        <Button variant="outline" size="sm">
          <Download aria-hidden />
          Tout télécharger
        </Button>
      </div>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <li key={p.index}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-label={`Agrandir la photo ${p.index}`}
            >
              <img
                src={p.src || '/placeholder.svg'}
                alt={`Photo ${p.index} — ${p.site}`}
                loading="lazy"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <span className="absolute left-2 top-2 rounded-md bg-background/85 px-1.5 py-0.5 text-xs font-semibold text-foreground backdrop-blur">
                #{p.index}
                <span className="ml-1 font-normal text-muted-foreground">{p.source}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {openIndex !== null && (
        <Lightbox
          photo={photos[openIndex]}
          position={openIndex + 1}
          total={photos.length}
          onClose={close}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
        />
      )}
    </section>
  )
}

function Lightbox({
  photo,
  position,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  photo: Photo
  position: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onPrev()
      else if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose, onPrev, onNext])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${position} sur ${total}`}
      className="fixed inset-0 z-50 flex flex-col bg-foreground/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Barre supérieure */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-3 text-background"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="tnum text-sm font-medium">
          Photo {position} / {total}
          <span className="ml-2 font-normal opacity-70">{photo.source}</span>
        </span>
        <div className="flex items-center gap-2">
          <a
            href={photo.src}
            download
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-background/25 px-2.5 text-sm font-medium text-background transition-colors hover:bg-background/10"
          >
            <Download className="size-4" aria-hidden />
            <span className="hidden sm:inline">Télécharger</span>
          </a>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-background/25 text-background outline-none transition-colors hover:bg-background/10 focus-visible:ring-3 focus-visible:ring-background/40"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* Image + navigation */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-4" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onPrev}
          aria-label="Photo précédente"
          className="absolute left-2 z-10 inline-flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md outline-none transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-background/50 sm:left-4"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>

        <img
          src={photo.src || '/placeholder.svg'}
          alt={`Photo ${position} — ${photo.site}`}
          className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
        />

        <button
          type="button"
          onClick={onNext}
          aria-label="Photo suivante"
          className="absolute right-2 z-10 inline-flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md outline-none transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-background/50 sm:right-4"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      {/* Métadonnées (affichées ici plutôt que répétées sur chaque vignette) */}
      <div
        className="mx-auto w-full max-w-3xl px-4 py-4 text-background"
        onClick={(e) => e.stopPropagation()}
      >
        <dl className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-sm">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4 opacity-70" aria-hidden />
            <dd className="tnum">{photo.takenAt}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="size-4 opacity-70" aria-hidden />
            <dd>{photo.site}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="size-4 opacity-70" aria-hidden />
            <dd>{photo.sender}</dd>
          </div>
        </dl>
        <p className="mt-1.5 truncate text-xs opacity-60">
          {photo.filename} · {photo.sizeKb} KB
        </p>
      </div>
    </div>
  )
}
