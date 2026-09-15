'use client'

import { useState } from 'react'
import { Building2, Check, Plus, TriangleAlert, X } from 'lucide-react'
import type { Building } from '@/lib/buildings-data'
import { useDir } from '@/lib/directory-i18n'

export function BuildingCard({ b }: { b: Building }) {
  const { t } = useDir()
  const [code, setCode] = useState(b.shortCode ?? '')
  const [aliases, setAliases] = useState<string[]>(b.aliases)
  const [draft, setDraft] = useState('')
  const [active, setActive] = useState(b.active)
  const [base, setBase] = useState({ code: b.shortCode ?? '', aliases: b.aliases, active: b.active })

  const dirty = code !== base.code || active !== base.active || aliases.join('¦') !== base.aliases.join('¦')
  const missingCode = code.trim() === ''

  function addAlias() {
    const v = draft.trim()
    if (!v || aliases.includes(v)) return
    setAliases((a) => [...a, v])
    setDraft('')
  }

  return (
    <div className={['px-4 py-3.5', active ? '' : 'opacity-70'].join(' ')}>
      <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
        {/* Identité */}
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
            <Building2 className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-pretty text-sm font-semibold text-foreground">{b.name}</h3>
              {missingCode ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-attention-muted px-2 py-0.5 text-[11px] font-medium text-attention-foreground">
                  <TriangleAlert className="size-3" aria-hidden />
                  {t.missingCode}
                </span>
              ) : null}
              {!active ? (
                <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {t.inactive}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {b.city} · {t.assignedCount(b.employeesCount)}
            </p>
          </div>
        </div>

        {/* Code court + état + enregistrement */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={`code-${b.id}`}>
            {t.shortCode}
          </label>
          <input
            id={`code-${b.id}`}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={t.shortCodePlaceholder}
            className={[
              'h-9 w-36 rounded-md border bg-card px-2.5 font-mono text-sm text-foreground placeholder:font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30',
              missingCode ? 'border-attention/60' : 'border-input focus:border-ring',
            ].join(' ')}
          />

          <button
            type="button"
            onClick={() => setActive((v) => !v)}
            role="switch"
            aria-checked={active}
            className={[
              'inline-flex h-9 items-center gap-2 rounded-md border px-2.5 text-xs font-medium whitespace-nowrap',
              active
                ? 'border-success/40 bg-success-muted text-success-foreground'
                : 'border-border text-muted-foreground',
            ].join(' ')}
          >
            <span
              className={['size-2 rounded-full', active ? 'bg-success-foreground' : 'bg-muted-foreground'].join(' ')}
              aria-hidden
            />
            {active ? t.active : t.inactive}
          </button>

          <button
            type="button"
            onClick={() => setBase({ code, aliases, active })}
            disabled={!dirty}
            className={[
              'inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-semibold whitespace-nowrap',
              dirty
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'cursor-default border border-border text-muted-foreground',
            ].join(' ')}
          >
            {dirty ? (
              t.save
            ) : (
              <>
                <Check className="size-3.5" aria-hidden />
                {t.saved}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alias */}
      <div className="mt-3 flex flex-wrap items-center gap-2 sm:pl-11">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t.aliasLabel}</span>
        {aliases.map((a) => (
          <span
            key={a}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-1 text-xs font-medium text-foreground"
          >
            <span className="font-mono">{a}</span>
            <button
              type="button"
              onClick={() => setAliases((list) => list.filter((x) => x !== a))}
              aria-label={`${t.aliasLabel}: ${a}`}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <span className="inline-flex items-center">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                e.preventDefault()
                addAlias()
              }
            }}
            placeholder={t.addAlias}
            className="h-8 w-40 rounded-md border border-input bg-card px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
          <button
            type="button"
            onClick={addAlias}
            aria-label={t.addAlias}
            className="ml-1 inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-4" />
          </button>
        </span>
      </div>
    </div>
  )
}
