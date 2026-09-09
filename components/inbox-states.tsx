'use client'

import { CheckCircle2, Inbox, Loader2, WifiOff } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[22rem] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 px-6 py-12 text-center">
      {children}
    </div>
  )
}

export function LoadingState() {
  const { t } = useI18n()
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        {t.loadingLabel}
      </p>
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-lg border border-l-4 border-l-border bg-card p-4 sm:p-5" aria-hidden>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 max-w-[60%] rounded bg-muted" />
              <div className="h-3 w-64 max-w-[70%] rounded bg-muted/70" />
            </div>
            <div className="h-6 w-28 rounded-full bg-muted" />
          </div>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((k) => (
                <div key={k} className="size-14 rounded-md bg-muted" />
              ))}
            </div>
            <div className="hidden w-[22rem] space-y-2 lg:block">
              <div className="h-3 w-24 rounded bg-muted/70" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-9 w-full rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only" role="status">
        {t.loadingLabel}
      </span>
    </div>
  )
}

export function EmptyState() {
  const { t } = useI18n()
  return (
    <Centered>
      <Inbox className="size-8 text-muted-foreground" aria-hidden />
      <h2 className="mt-4 text-lg font-semibold text-foreground">{t.emptyTitle}</h2>
      <p className="mt-1.5 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">{t.emptyBody}</p>
    </Centered>
  )
}

export function AllDoneState() {
  const { t } = useI18n()
  return (
    <Centered>
      <CheckCircle2 className="size-8 text-success" aria-hidden />
      <h2 className="mt-4 text-lg font-semibold text-foreground">{t.allDoneTitle}</h2>
      <p className="mt-1.5 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">{t.allDoneBody}</p>
    </Centered>
  )
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useI18n()
  return (
    <Centered>
      <WifiOff className="size-8 text-destructive" aria-hidden />
      <h2 className="mt-4 text-lg font-semibold text-foreground">{t.errorTitle}</h2>
      <p className="mt-1.5 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">{t.errorBody}</p>
      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {t.retry}
      </button>
    </Centered>
  )
}
