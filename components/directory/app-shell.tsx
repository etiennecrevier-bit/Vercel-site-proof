'use client'

import type { ReactNode } from 'react'
import { Camera, Inbox, ClipboardList, BookMarked, Activity, Languages, LogOut } from 'lucide-react'
import { useDir, LANGS, type Lang } from '@/lib/directory-i18n'

function NavItem({ icon, label, active }: { icon: ReactNode; label: string; active?: boolean }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap',
        active ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
      ].join(' ')}
      aria-current={active ? 'page' : undefined}
    >
      {icon}
      {label}
    </span>
  )
}

export function AppShell({
  children,
  active = 'directory',
}: {
  children: ReactNode
  active?: 'directory' | 'health'
}) {
  const { lang, setLang, t } = useDir()

  return (
    <div className="min-h-svh bg-background">
      {/* Bandeau supérieur */}
      <div className="h-1.5 w-full bg-success-muted" aria-hidden />
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold tracking-tight text-primary">Allstars</span>
            <span className="hidden text-[11px] leading-tight text-muted-foreground sm:block">
              Service d&apos;entretien
              <br />
              Est. 1993
            </span>
          </div>

          <nav className="flex items-center gap-1" aria-label={t.navDirectory}>
            <NavItem icon={<Camera className="size-4" />} label={t.navCapture} />
            <NavItem icon={<Inbox className="size-4" />} label={t.navInbox} />
            <NavItem icon={<ClipboardList className="size-4" />} label={t.navInterventions} />
            <NavItem icon={<BookMarked className="size-4" />} label={t.navDirectory} active={active === 'directory'} />
            <NavItem icon={<Activity className="size-4" />} label={t.navHealth} active={active === 'health'} />
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-md border border-border p-0.5" role="group" aria-label="Langue">
              <Languages className="mx-1 size-4 text-muted-foreground" aria-hidden />
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code as Lang)}
                  aria-pressed={lang === l.code}
                  className={[
                    'rounded px-2 py-1 text-xs font-semibold',
                    lang === l.code ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                  ].join(' ')}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-8">{children}</main>
    </div>
  )
}
