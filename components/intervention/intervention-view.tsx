'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  FileText,
  Heart,
  Lock,
  MapPin,
  Pencil,
  Plus,
  User,
} from 'lucide-react'
import type { Intervention, InternalNote, ReportState } from '@/lib/intervention'
import { Button } from '@/components/ui/button'
import { PhotoGallery } from '@/components/intervention/photo-gallery'
import { ActionPanel } from '@/components/intervention/action-panel'

const STATE_LABEL: Record<ReportState, string> = {
  draft: 'Brouillon',
  sent: 'Envoyé',
  archived: 'Archivé',
}

const STATE_TONE: Record<ReportState, string> = {
  draft: 'bg-attention-muted text-attention-foreground',
  sent: 'bg-success-muted text-success-foreground',
  archived: 'bg-secondary text-secondary-foreground',
}

export function InterventionView({ intervention }: { intervention: Intervention }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6">
      <a
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Retour au journal
      </a>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Colonne actions — à gauche, collante */}
        <div className="order-2 lg:order-1">
          <ActionPanel
            intervention={intervention}
            notes={<InternalNotes initial={intervention.notes} />}
          />
        </div>

        {/* Colonne contenu — la lecture */}
        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <Header intervention={intervention} />
          <ReportCard intervention={intervention} />
          <PhotoGallery photos={intervention.photos} />
        </div>
      </div>
    </div>
  )
}

function Header({ intervention }: { intervention: Intervention }) {
  return (
    <header>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-pretty text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {intervention.code} ({intervention.number}) - {intervention.siteName}
        </h1>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STATE_TONE[intervention.reportState]}`}
        >
          {STATE_LABEL[intervention.reportState]}
        </span>
      </div>
      <p className="mt-1 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {intervention.client}
      </p>

      <dl className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="size-4" aria-hidden />
          <dd className="tnum">{intervention.date}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="size-4" aria-hidden />
          <dd>{intervention.address}</dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <User className="size-4" aria-hidden />
          Photos : <span className="font-medium text-foreground">{intervention.photosSentBy}</span>
        </span>
        <Button variant="outline" size="sm">
          <Heart aria-hidden />
          Remercier
        </Button>
      </div>

      <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Pencil className="size-3.5" aria-hidden />
        {intervention.lastChange.action} · par {intervention.lastChange.by} · {intervention.lastChange.at}
      </p>
    </header>
  )
}

function ReportCard({ intervention }: { intervention: Intervention }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <FileText className="size-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Rapport</p>
            <p className="tnum text-xs text-muted-foreground">
              {intervention.report.createdAt} · {intervention.report.photoCount} photos
            </p>
          </div>
        </div>
        <a
          href={intervention.report.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <ExternalLink className="size-4" aria-hidden />
          Ouvrir le lien client
        </a>
      </div>
    </section>
  )
}

function InternalNotes({ initial }: { initial: InternalNote[] }) {
  const [notes, setNotes] = useState<InternalNote[]>(initial)
  const [draft, setDraft] = useState('')

  function add() {
    const body = draft.trim()
    if (!body) return
    setNotes((prev) => [
      ...prev,
      { id: crypto.randomUUID(), author: 'Vous', at: "à l'instant", body },
    ])
    setDraft('')
  }

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Lock className="size-4 text-muted-foreground" aria-hidden />
        <h2 className="text-sm font-semibold text-foreground">Notes internes</h2>
        {notes.length > 0 && (
          <span className="tnum rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {notes.length}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Visibles seulement par le bureau — jamais dans le rapport ni le lien client.
      </p>

      <div className="mt-3 flex flex-col gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              add()
            }
          }}
          rows={2}
          placeholder="Écrire une note pour le bureau"
          className="min-h-16 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
        />
        <Button size="lg" className="self-end" disabled={!draft.trim()} onClick={add}>
          <Plus aria-hidden />
          Ajouter
        </Button>
      </div>

      {notes.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Aucune note interne pour l&apos;instant.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {notes.map((n) => (
            <li key={n.id} className="rounded-lg border border-border bg-background p-3">
              <p className="text-sm text-foreground">{n.body}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {n.author} · {n.at}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
