'use client'

import { Check, ImageIcon, RefreshCw, ExternalLink, Send, ClipboardList } from 'lucide-react'
import { useDir } from '@/lib/directory-i18n'
import type { FlatReport, Report, SendStatus } from '@/lib/interventions-data'

/** Photo-count chip — labelled so the number is never ambiguous. */
export function PhotoChip({ n }: { n: number }) {
  const { t } = useDir()
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-muted-foreground">
      <ImageIcon className="size-3.5 shrink-0" aria-hidden />
      <span className="tnum">{t.ivPhotos(n)}</span>
    </span>
  )
}

/** Report-count chip. */
export function ReportChip({ n }: { n: number }) {
  const { t } = useDir()
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-muted-foreground">
      <ClipboardList className="size-3.5 shrink-0" aria-hidden />
      <span className="tnum">{t.ivReports(n)}</span>
    </span>
  )
}

/** Amber "N à envoyer" pill — the load-bearing signal of the whole page. */
export function ToSendPill({ n }: { n: number }) {
  const { t } = useDir()
  if (n <= 0) return null
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-attention-muted px-2.5 py-1 text-xs font-semibold text-attention-foreground">
      <span className="size-1.5 rounded-full bg-attention" aria-hidden />
      <span className="tnum">{t.ivToSendInline(n)}</span>
    </span>
  )
}

function formatSentAt(iso: string | undefined, lang: string) {
  if (!iso) return ''
  const locale = lang === 'fr' ? 'fr-CA' : lang === 'es' ? 'es' : 'en-CA'
  const d = new Date(iso)
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
}

/** Delivery status: amber when the client is still waiting, green when sent. */
export function StatusPill({ status, sentAt }: { status: SendStatus; sentAt?: string }) {
  const { t, lang } = useDir()

  if (status === 'not_sent') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-attention-muted px-2.5 py-1 text-sm font-semibold text-attention-foreground">
        <Send className="size-3.5 shrink-0" aria-hidden />
        {t.ivStatusToSend}
      </span>
    )
  }

  const channel = status === 'sent_email' ? 'email' : 'link'
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-foreground">
      <Check className="size-4 shrink-0" aria-hidden />
      <span>
        {t.ivSentVia(channel)}
        {sentAt ? <span className="font-normal text-muted-foreground"> · {formatSentAt(sentAt, lang)}</span> : null}
      </span>
    </span>
  )
}

/**
 * Context-aware actions. When a report is not sent, the filled primary is
 * "Send to client". Once sent, the primary recedes to viewing the shared
 * report and sending becomes a quiet "Resend". Regenerate is always demoted
 * to an icon — it is a rare, technical action.
 */
export function ReportActions({ status }: { status: SendStatus }) {
  const { t } = useDir()
  const notSent = status === 'not_sent'

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        title={t.ivRegenerate}
        aria-label={t.ivRegenerate}
        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <RefreshCw className="size-4" aria-hidden />
      </button>

      <button
        type="button"
        className="hidden items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary sm:inline-flex"
      >
        {t.ivIntervention}
      </button>

      {notSent ? (
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-95"
        >
          <Send className="size-4" aria-hidden />
          <span className="whitespace-nowrap">{t.ivSendNow}</span>
        </button>
      ) : (
        <>
          <button
            type="button"
            className="hidden rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground md:inline-flex"
          >
            {t.ivResend}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            <ExternalLink className="size-4" aria-hidden />
            <span className="whitespace-nowrap">{t.ivSharedReport}</span>
          </button>
        </>
      )}
    </div>
  )
}

/** Shared report row used by both the Reports and By-date views. */
export function ReportRow({ report, showClient = false }: { report: FlatReport; showClient?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-lg border border-border bg-card p-4">
      <div className="min-w-[14rem] flex-1">
        <p className="truncate font-medium text-foreground">{report.site}</p>
        <p className="truncate text-sm text-muted-foreground">
          {showClient ? `${report.clientName} · ` : ''}
          {report.city}
        </p>
      </div>
      <PhotoChip n={report.photoCount} />
      <div className="w-44 shrink-0">
        <StatusPill status={report.status} sentAt={report.sentAt} />
      </div>
      <ReportActions status={report.status} />
    </div>
  )
}

export type { Report }
