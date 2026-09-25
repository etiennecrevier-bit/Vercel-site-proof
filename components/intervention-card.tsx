'use client'

import { ExternalLink, FileText, Images, MapPin, User } from 'lucide-react'
import type { Intervention, InterventionStatus } from '@/lib/interventions'
import { ThumbnailStrip } from '@/components/thumbnail-strip'
import { StatusSelect, STATUS_TONE } from '@/components/intervention-status'

export function InterventionCard({
  intervention: iv,
  onStatusChange,
}: {
  intervention: Intervention
  onStatusChange: (id: string, next: InterventionStatus) => void
}) {
  const tone = STATUS_TONE[iv.status]
  const title = iv.code ? `${iv.code} — ${iv.site}` : iv.site
  const photoLabel = iv.photoCount > 1 ? `${iv.photoCount} photos` : `${iv.photoCount} photo`

  return (
    <article className={['rounded-lg border border-l-4 bg-card transition-colors', tone.rail].join(' ')}>
      {/* En-tête : identité + statut */}
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-4 pt-3.5 sm:px-5">
        <div className="min-w-0">
          <h3 className="text-pretty text-base font-semibold text-card-foreground">{title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground/80">{iv.client}</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              {iv.city}
            </span>
            <span aria-hidden className="text-border">
              |
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="size-3.5 shrink-0" aria-hidden />
              {iv.technician}
            </span>
          </div>
        </div>
        <div className="shrink-0">
          <StatusSelect id={`st-${iv.id}`} status={iv.status} onChange={(next) => onStatusChange(iv.id, next)} />
        </div>
      </div>

      {/* Corps : vignettes toujours visibles + actions */}
      <div className="flex flex-col gap-4 px-4 pb-4 pt-3 sm:px-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 lg:flex-1">
          <ThumbnailStrip thumbnails={iv.thumbnails} total={iv.photoCount} alt={photoLabel} />
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2">
          <span className="tnum inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Images className="size-4 shrink-0" aria-hidden />
            {photoLabel}
          </span>
          <span className="tnum inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <FileText className="size-4 shrink-0" aria-hidden />
            {iv.reportCount} rapport{iv.reportCount > 1 ? 's' : ''}
          </span>
          {iv.hasSharedReport && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <ExternalLink className="size-4" aria-hidden />
              Rapport partagé
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
