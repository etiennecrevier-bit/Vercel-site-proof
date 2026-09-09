'use client'

import { useState } from 'react'
import { Check, Clock, CornerDownLeft, Images, Pencil, Undo2, X } from 'lucide-react'
import { BUILDINGS, type Submission } from '@/lib/data'
import { useI18n } from '@/lib/i18n'
import { StatusBadge } from '@/components/status-badge'
import { ThumbnailStrip } from '@/components/thumbnail-strip'

type Props = {
  submission: Submission
  selected: boolean
  correcting: boolean
  onSelect: () => void
  onConfirm: () => void
  onStartCorrect: () => void
  onApplyCorrect: (building: string) => void
  onCancelCorrect: () => void
  onUndo: () => void
}

const RAIL: Record<Submission['state'], string> = {
  high: 'border-l-border',
  low: 'border-l-attention',
  unrecognized: 'border-l-attention',
  confirmed: 'border-l-success',
  corrected: 'border-l-success',
}

export function SubmissionRow({
  submission: s,
  selected,
  correcting,
  onSelect,
  onConfirm,
  onStartCorrect,
  onApplyCorrect,
  onCancelCorrect,
  onUndo,
}: Props) {
  const { t } = useI18n()
  const [choice, setChoice] = useState(s.correctedBuilding ?? s.guessedBuilding)

  const isDone = s.state === 'confirmed' || s.state === 'corrected'
  const finalBuilding = s.correctedBuilding ?? s.guessedBuilding

  return (
    <article
      onClick={onSelect}
      className={[
        'group relative rounded-lg border border-l-4 bg-card transition-colors',
        RAIL[s.state],
        selected ? 'ring-2 ring-ring ring-offset-2 ring-offset-background' : '',
        isDone ? 'bg-card/60' : '',
      ].join(' ')}
    >
      {/* Ligne 1 — identité + statut */}
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-4 pt-3.5 sm:px-5">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            {s.employeeName ? (
              <h3 className={['text-pretty text-base font-semibold', isDone ? 'text-muted-foreground' : 'text-card-foreground'].join(' ')}>
                {s.employeeName}
              </h3>
            ) : (
              <h3 className="text-pretty text-base font-semibold text-attention-foreground">{s.waHandle}</h3>
            )}
            <span className="tnum shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">{s.id}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 shrink-0" aria-hidden />
              <span className="tnum">
                {t.receivedAt} {s.time}
              </span>
            </span>
            <span aria-hidden className="text-border">|</span>
            <span className="inline-flex items-center gap-1.5">
              <Images className="size-3.5 shrink-0" aria-hidden />
              <span className="tnum">{t.photos(s.photoCount)}</span>
            </span>
            <span className="text-muted-foreground/70">· {s.city}</span>
          </div>
          {s.employeeName === null && <p className="mt-1.5 text-sm text-attention-foreground/90">{t.unrecognizedHint}</p>}
        </div>
        <div className="shrink-0">
          <StatusBadge state={s.state} confidence={s.confidence} />
        </div>
      </div>

      {/* Ligne 2 — vignettes + décision */}
      <div className="flex flex-col gap-4 px-4 pb-4 pt-3 sm:px-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 lg:flex-1">
          <ThumbnailStrip thumbnails={s.thumbnails} total={s.photoCount} alt={t.photos(s.photoCount)} />
        </div>

        <div className="w-full shrink-0 lg:w-[22rem]">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {isDone && s.state === 'corrected' ? t.correctedFrom : t.detected}
          </p>

          {correcting ? (
            <div className="mt-1.5 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
              <label className="sr-only" htmlFor={`b-${s.id}`}>
                {t.chooseBuilding}
              </label>
              <select
                id={`b-${s.id}`}
                autoFocus
                value={choice}
                onChange={(e) => setChoice(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {BUILDINGS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => onApplyCorrect(choice)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Check className="size-4" aria-hidden />
                  {t.save}
                </button>
                <button
                  onClick={onCancelCorrect}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="size-4" aria-hidden />
                  {t.cancel}
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className={['mt-1 text-pretty text-sm font-medium leading-snug', isDone ? 'text-muted-foreground' : 'text-card-foreground'].join(' ')}>
                {finalBuilding}
              </p>

              {isDone ? (
                <div className="mt-2.5 flex items-center gap-3">
                  <button
                    onClick={onUndo}
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Undo2 className="size-4" aria-hidden />
                    {t.undo}
                  </button>
                </div>
              ) : (
                <div className="mt-2.5 flex gap-2">
                  <button
                    onClick={onConfirm}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Check className="size-4" aria-hidden />
                    {t.confirm}
                  </button>
                  <button
                    onClick={onStartCorrect}
                    className="inline-flex items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Pencil className="size-4" aria-hidden />
                    {t.correct}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selected && !isDone && !correcting && (
        <div className="pointer-events-none absolute -top-2.5 left-3 hidden items-center gap-1 rounded bg-primary px-1.5 py-0.5 text-[11px] font-medium text-primary-foreground lg:inline-flex">
          <CornerDownLeft className="size-3" aria-hidden />
          {t.confirm}
        </div>
      )}
    </article>
  )
}
