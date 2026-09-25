'use client'

import { useState } from 'react'
import { BadgeCheck, BookUser, Inbox as InboxIcon, ClipboardList, Settings } from 'lucide-react'
import { Inbox } from '@/components/inbox'
import { InterventionsView } from '@/components/interventions-view'

type Screen = 'inbox' | 'interventions'

const NAV: { key: Screen; label: string; icon: typeof InboxIcon; badge?: number; enabled: boolean }[] = [
  { key: 'inbox', label: 'Boîte de réception', icon: InboxIcon, badge: 9, enabled: true },
  { key: 'interventions', label: 'Interventions', icon: ClipboardList, enabled: true },
]

const DECORATIVE: { label: string; icon: typeof InboxIcon }[] = [
  { label: 'ClearSite', icon: BadgeCheck },
  { label: 'Répertoire', icon: BookUser },
]

export function AppShell() {
  const [screen, setScreen] = useState<Screen>('interventions')

  return (
    <div className="min-h-svh bg-background">
      <nav className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-2.5 sm:px-6">
          <div className="flex items-baseline gap-2 pr-2">
            <span className="text-lg font-black tracking-tight text-primary">Allstars</span>
            <span className="hidden text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:inline">
              Est. 1993
            </span>
          </div>

          <div className="flex flex-1 items-center gap-1">
            {NAV.map((item) => {
              const Icon = item.icon
              const active = screen === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => setScreen(item.key)}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    active ? 'bg-secondary text-secondary-foreground ring-1 ring-border' : 'text-muted-foreground hover:bg-muted',
                  ].join(' ')}
                >
                  <Icon className="size-4" aria-hidden />
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.badge != null && (
                    <span className="tnum rounded-full bg-attention-muted px-1.5 py-0.5 text-xs font-semibold text-attention-foreground">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
            {DECORATIVE.map((item) => {
              const Icon = item.icon
              return (
                <span
                  key={item.label}
                  className="hidden items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground/60 md:inline-flex"
                  aria-disabled
                >
                  <Icon className="size-4" aria-hidden />
                  {item.label}
                </span>
              )
            })}
          </div>

          <span className="text-muted-foreground/60" aria-hidden>
            <Settings className="size-5" />
          </span>
        </div>
      </nav>

      <main>{screen === 'inbox' ? <Inbox /> : <InterventionsView />}</main>
    </div>
  )
}
