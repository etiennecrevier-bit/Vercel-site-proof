'use client'

import { useState } from 'react'
import {
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  FileDown,
  Link2,
  Mail,
  MoreHorizontal,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import type { Intervention, ReportState } from '@/lib/intervention'
import { Button } from '@/components/ui/button'

const STATES: { value: ReportState; label: string }[] = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'sent', label: 'Envoyé' },
  { value: 'archived', label: 'Archivé' },
]

export function ActionPanel({
  intervention,
  notes,
}: {
  intervention: Intervention
  notes?: React.ReactNode
}) {
  const [workOrder, setWorkOrder] = useState(intervention.workOrder)
  const [state, setState] = useState<ReportState>(intervention.reportState)
  const [moreOpen, setMoreOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  function copyLink() {
    navigator.clipboard?.writeText(intervention.report.url).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
      {/* Actions principales */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Actions</h2>
        <div className="flex flex-col gap-2">
          <Button size="lg" className="justify-start">
            <Mail aria-hidden />
            Envoyer le rapport
          </Button>

          <a
            href={intervention.report.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-start gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <ExternalLink className="size-4" aria-hidden />
            Voir le rapport
          </a>

          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="flex-1 justify-start">
              <FileDown aria-hidden />
              PDF
            </Button>
            <Button variant="outline" size="lg" className="flex-1 justify-start" onClick={copyLink}>
              {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
              {copied ? 'Copié' : 'Copier le lien'}
            </Button>
          </div>

          {/* Actions secondaires / techniques */}
          <div className="relative">
            <Button
              variant="ghost"
              size="lg"
              className="w-full justify-between text-muted-foreground"
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              onClick={() => setMoreOpen((v) => !v)}
            >
              <span className="inline-flex items-center gap-1.5">
                <MoreHorizontal aria-hidden />
                Plus d&apos;actions
              </span>
              <ChevronDown
                className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </Button>

            {moreOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMoreOpen(false)} aria-hidden />
                <div
                  role="menu"
                  className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg"
                >
                  <MenuItem icon={<RefreshCw className="size-4" aria-hidden />} label="Reconstruire le PDF" />
                  <MenuItem icon={<Link2 className="size-4" aria-hidden />} label="Nouveau lien (annule l'ancien)" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Détails administratifs */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Détails</h2>

        <label htmlFor="po" className="mb-1 block text-xs font-medium text-muted-foreground">
          Bon de travail / PO
        </label>
        <div className="flex gap-2">
          <input
            id="po"
            value={workOrder}
            onChange={(e) => setWorkOrder(e.target.value)}
            placeholder="ex. BT-10482"
            className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
          />
          <Button variant="secondary" size="lg" disabled={!workOrder.trim()}>
            Enregistrer
          </Button>
        </div>

        <label htmlFor="state" className="mb-1 mt-4 block text-xs font-medium text-muted-foreground">
          État du rapport
        </label>
        <div className="relative">
          <select
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value as ReportState)}
            className="h-9 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            {STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
        </div>
      </div>

      {/* Notes internes — entre les détails et la zone de danger */}
      {notes}

      {/* Zone de danger */}
      <details className="group rounded-xl border border-border bg-card">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40">
          <span>Zone de danger</span>
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <div className="border-t border-border px-4 py-3">
          <Button variant="destructive" size="lg" className="w-full justify-start">
            <Trash2 aria-hidden />
            Supprimer l&apos;intervention
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Action irréversible. Le rapport et les photos associés seront définitivement supprimés.
          </p>
        </div>
      </details>
    </aside>
  )
}

function MenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      role="menuitem"
      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-foreground outline-none transition-colors hover:bg-muted focus-visible:bg-muted"
    >
      <span className="text-muted-foreground">{icon}</span>
      {label}
    </button>
  )
}
