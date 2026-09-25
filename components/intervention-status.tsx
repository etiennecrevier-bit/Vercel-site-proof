'use client'

import { ChevronDown } from 'lucide-react'
import { STATUS_META, STATUS_ORDER, type InterventionStatus } from '@/lib/interventions'

/** Ton visuel par statut — sert au rail de gauche et à la pastille. */
export const STATUS_TONE: Record<
  InterventionStatus,
  { rail: string; dot: string; pill: string }
> = {
  'non-traite': {
    rail: 'border-l-attention',
    dot: 'bg-attention',
    pill: 'bg-attention-muted text-attention-foreground',
  },
  'en-traitement': {
    rail: 'border-l-primary',
    dot: 'bg-primary',
    pill: 'bg-secondary text-secondary-foreground ring-1 ring-border',
  },
  'envoye-client': {
    rail: 'border-l-success',
    dot: 'bg-success',
    pill: 'bg-success-muted text-success-foreground',
  },
  'envoye-soumission': {
    rail: 'border-l-success',
    dot: 'bg-success',
    pill: 'bg-success-muted text-success-foreground',
  },
  archive: {
    rail: 'border-l-border',
    dot: 'bg-muted-foreground/50',
    pill: 'bg-muted text-muted-foreground',
  },
}

/** Pastille statique (lecture seule). */
export function StatusPill({ status }: { status: InterventionStatus }) {
  const tone = STATUS_TONE[status]
  return (
    <span
      className={['inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', tone.pill].join(' ')}
    >
      <span className={['size-1.5 rounded-full', tone.dot].join(' ')} aria-hidden />
      {STATUS_META[status].label}
    </span>
  )
}

/** Sélecteur de statut : pastille + <select> natif superposé, pour changer en un clic. */
export function StatusSelect({
  status,
  onChange,
  id,
}: {
  status: InterventionStatus
  onChange: (next: InterventionStatus) => void
  id: string
}) {
  const tone = STATUS_TONE[status]
  return (
    <div className="relative inline-flex">
      <label className="sr-only" htmlFor={id}>
        Changer le statut
      </label>
      <span
        aria-hidden
        className={[
          'pointer-events-none inline-flex items-center gap-1.5 rounded-full py-1 pl-2.5 pr-2 text-xs font-semibold',
          tone.pill,
        ].join(' ')}
      >
        <span className={['size-1.5 rounded-full', tone.dot].join(' ')} />
        {STATUS_META[status].label}
        <ChevronDown className="size-3.5 opacity-70" />
      </span>
      <select
        id={id}
        value={status}
        onChange={(e) => onChange(e.target.value as InterventionStatus)}
        className="absolute inset-0 cursor-pointer opacity-0"
        title="Changer le statut"
      >
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s}>
            {STATUS_META[s].label}
          </option>
        ))}
      </select>
    </div>
  )
}
