'use client'

import { AlertTriangle, Check, HelpCircle } from 'lucide-react'
import type { Submission } from '@/lib/data'
import { useI18n } from '@/lib/i18n'

export function StatusBadge({ state, confidence }: { state: Submission['state']; confidence: number }) {
  const { t } = useI18n()

  if (state === 'confirmed' || state === 'corrected') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-foreground">
        <Check className="size-4 shrink-0" aria-hidden />
        {state === 'confirmed' ? t.isConfirmed : t.isCorrected}
      </span>
    )
  }

  if (state === 'unrecognized') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-attention-muted px-2.5 py-1 text-sm font-semibold text-attention-foreground">
        <HelpCircle className="size-4 shrink-0" aria-hidden />
        {t.unrecognized}
      </span>
    )
  }

  if (state === 'low') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-attention-muted px-2.5 py-1 text-sm font-semibold text-attention-foreground">
        <AlertTriangle className="size-4 shrink-0" aria-hidden />
        {t.confidenceLow} <span className="tnum font-normal opacity-80">· {confidence}%</span>
      </span>
    )
  }

  // high — volontairement discret
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <span className="size-1.5 rounded-full bg-success" aria-hidden />
      {t.confidenceHigh} <span className="tnum">· {confidence}%</span>
    </span>
  )
}
