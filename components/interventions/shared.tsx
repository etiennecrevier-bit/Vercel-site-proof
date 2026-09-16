'use client'

import { ImageIcon, RefreshCw, ExternalLink, ClipboardList, Send, Wrench, Archive, Clock, PenLine, ChevronDown } from 'lucide-react'
import { useDir } from '@/lib/directory-i18n'
import type { FlatReport, Report, Disposition, Signature } from '@/lib/interventions-data'
import { useTreatment } from './treatment-context'

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

/** Amber "N à traiter" pill — the load-bearing signal of the whole page. */
export function ToTreatPill({ n }: { n: number }) {
  const { t } = useDir()
  if (n <= 0) return null
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-attention-muted px-2.5 py-1 text-xs font-semibold text-attention-foreground">
      <span className="size-1.5 rounded-full bg-attention" aria-hidden />
      <span className="tnum">{t.ivToTreatInline(n)}</span>
    </span>
  )
}

function formatDate(iso: string | undefined, lang: string) {
  if (!iso) return ''
  const locale = lang === 'fr' ? 'fr-CA' : lang === 'es' ? 'es' : 'en-CA'
  return new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short' })
}

const DONE_META: Record<
  Exclude<Disposition, 'a_traiter'>,
  { icon: typeof Send; toneClass: string }
> = {
  envoyer_client: { icon: Send, toneClass: 'text-success-foreground' },
  traite_interne: { icon: Wrench, toneClass: 'text-success-foreground' },
  archive: { icon: Archive, toneClass: 'text-muted-foreground' },
}

/**
 * Treatment status. Amber "À traiter" while the report still needs a human;
 * once processed, it shows what was decided plus the employee signature
 * (who + when) so accountability is visible at a glance.
 */
export function StatusPill({ report }: { report: Pick<Report, 'disposition' | 'signature'> }) {
  const { t, lang } = useDir()

  if (report.disposition === 'a_traiter') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-attention-muted px-2.5 py-1 text-sm font-semibold text-attention-foreground">
        <Clock className="size-3.5 shrink-0" aria-hidden />
        {t.ivStateToTreat}
      </span>
    )
  }

  const label =
    report.disposition === 'envoyer_client'
      ? t.ivStateSentClient
      : report.disposition === 'traite_interne'
        ? t.ivStateInternal
        : t.ivStateArchived
  const meta = DONE_META[report.disposition]
  const Icon = meta.icon

  return (
    <span className="inline-flex flex-wrap items-center gap-x-1.5 text-sm">
      <span className={['inline-flex items-center gap-1.5 font-medium', meta.toneClass].join(' ')}>
        <Icon className="size-4 shrink-0" aria-hidden />
        {label}
      </span>
      {report.signature ? (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <PenLine className="size-3 shrink-0" aria-hidden />
          {t.ivSignedBy(report.signature.employee)} · <span className="tnum">{formatDate(report.signature.at, lang)}</span>
        </span>
      ) : null}
    </span>
  )
}

/**
 * The disposition dropdown — the "traité" control the whole redesign hinges
 * on. Picking anything other than "À traiter" stamps the current user's
 * signature via the treatment context. It reads as amber (a call to action)
 * while untreated, then recedes to a quiet control once handled.
 */
export function DispositionSelect({ report }: { report: Pick<Report, 'id' | 'disposition'> }) {
  const { t } = useDir()
  const { setDisposition } = useTreatment()
  const untreated = report.disposition === 'a_traiter'

  return (
    <div className="relative">
      <select
        value={report.disposition}
        onChange={(e) => setDisposition(report.id, e.target.value as Disposition)}
        aria-label={t.ivMarkAs}
        className={[
          'appearance-none rounded-md border py-1.5 pl-3 pr-8 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring',
          untreated
            ? 'border-attention bg-attention-muted text-attention-foreground'
            : 'border-border bg-card font-medium text-foreground hover:bg-secondary',
        ].join(' ')}
      >
        <option value="a_traiter">{t.ivDispToTreat}</option>
        <option value="envoyer_client">{t.ivDispSendClient}</option>
        <option value="traite_interne">{t.ivDispInternal}</option>
        <option value="archive">{t.ivDispArchive}</option>
      </select>
      <ChevronDown
        className={[
          'pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2',
          untreated ? 'text-attention-foreground' : 'text-muted-foreground',
        ].join(' ')}
        aria-hidden
      />
    </div>
  )
}

/**
 * Row actions. The disposition dropdown is the primary control; viewing the
 * shared report and the source job are secondary; regenerate is a rare,
 * technical action demoted to an icon.
 */
export function ReportActions({ report }: { report: Pick<Report, 'id' | 'disposition'> }) {
  const { t } = useDir()

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
        className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground md:inline-flex"
      >
        {t.ivIntervention}
      </button>
      <button
        type="button"
        className="hidden items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary sm:inline-flex"
      >
        <ExternalLink className="size-4" aria-hidden />
        <span className="whitespace-nowrap">{t.ivSharedReport}</span>
      </button>
      <DispositionSelect report={report} />
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
      <div className="min-w-[13rem] shrink-0">
        <StatusPill report={report} />
      </div>
      <ReportActions report={report} />
    </div>
  )
}

export type { Report, Signature }
