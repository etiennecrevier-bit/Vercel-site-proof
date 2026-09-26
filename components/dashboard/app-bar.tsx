'use client'

import Link from 'next/link'
import { Settings } from 'lucide-react'
import { LANGS, useT } from '@/lib/dashboard-i18n'
import { FakeLink } from './fake-link'

export function AppBar({ inboxCount }: { inboxCount: number | null }) {
  const { t, lang, setLang } = useT()

  const tab = 'inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors'
  const idle = `${tab} text-muted-foreground hover:bg-card/70 hover:text-foreground`

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5 @2xl:px-6">
        <Link href="/" className="flex items-baseline gap-2" aria-label="Allstars Maintenance">
          <span className="text-base font-bold tracking-tight text-foreground">Allstars</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Est. 1993</span>
        </Link>

        <nav
          aria-label={t.nav.label}
          className="order-last -mx-1 flex w-full gap-1 overflow-x-auto px-1 pb-0.5 @4xl:order-none @4xl:w-auto @4xl:flex-1 @4xl:pb-0"
        >
          <Link href="/" aria-current="page" className={`${tab} bg-card text-foreground shadow-sm ring-1 ring-border`}>
            {t.nav.dashboard}
          </Link>
          <Link href="/boite-de-reception" className={idle}>
            {t.nav.inbox}
            {inboxCount !== null && inboxCount > 0 && (
              <span className="tnum rounded-full bg-attention-muted px-1.5 py-0.5 text-xs font-semibold text-attention-foreground ring-1 ring-attention/30">
                {inboxCount}
              </span>
            )}
          </Link>
          <FakeLink href="/interventions/journal" className={idle}>
            {t.nav.interventions}
          </FakeLink>
          <FakeLink href="/clearsite" className={idle}>
            {t.nav.clearsite}
          </FakeLink>
          <FakeLink href="/repertoire" className={idle}>
            {t.nav.directory}
          </FakeLink>
        </nav>

        <div className="ml-auto flex items-center gap-2 @4xl:ml-0">
          <div className="flex overflow-hidden rounded-md border border-border" role="group" aria-label="Langue / Language / Idioma">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={[
                  'px-2 py-1 text-xs font-semibold transition-colors',
                  lang === code ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
          <FakeLink
            href="/parametres"
            aria-label={t.nav.settings}
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            <Settings className="size-4" aria-hidden />
          </FakeLink>
        </div>
      </div>
    </header>
  )
}
