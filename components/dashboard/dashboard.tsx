'use client'

import { useMemo, useState } from 'react'
import { CircleAlert, CircleCheck } from 'lucide-react'
import { getDashboard, inboxBadge, queuesFor, SECTIONS, summarize, type DashboardData, type Role, type Scenario } from '@/lib/dashboard-data'
import { useT } from '@/lib/dashboard-i18n'
import { AppBar } from './app-bar'
import { ClearSiteCard } from './clearsite-card'
import { DemoToolbar, type Preview } from './demo-toolbar'
import { FakeNavProvider } from './fake-link'
import { NowStrip } from './now-strip'
import { PulseStrip } from './pulse-strip'
import { QueueList, SectionCard } from './queue-section'

export function Dashboard() {
  const [scenario, setScenario] = useState<Scenario>('normal')
  const [role, setRole] = useState<Role>('team')
  const [preview, setPreview] = useState<Preview>('desktop')
  const data = useMemo(() => getDashboard(scenario), [scenario])

  return (
    <FakeNavProvider>
      <DemoToolbar scenario={scenario} setScenario={setScenario} role={role} setRole={setRole} preview={preview} setPreview={setPreview} />
      <div
        className={
          preview === 'phone'
            ? 'mx-auto my-6 w-[390px] max-w-full overflow-hidden rounded-2xl border border-border bg-background shadow-xl'
            : ''
        }
      >
        <div className="@container">
          <AppBar inboxCount={inboxBadge(data)} />
          <DashboardBody data={data} role={role} />
        </div>
      </div>
    </FakeNavProvider>
  )
}

function DashboardBody({ data, role }: { data: DashboardData; role: Role }) {
  const { t } = useT()
  const summary = summarize(data, role)
  const section = (id: (typeof SECTIONS)[number]['id']) => SECTIONS.find((s) => s.id === id)!

  const renderSection = (id: 'reception' | 'interventions' | 'directory' | 'health', className?: string) => {
    const s = section(id)
    return (
      <SectionCard key={id} id={id} href={s.href} adminOnly={s.adminOnly} className={className}>
        <QueueList queues={queuesFor(data, s.queueIds, role)} tone={id === 'health' ? 'destructive' : 'attention'} />
      </SectionCard>
    )
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 pt-6 @2xl:px-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground @2xl:text-3xl">{t.greeting('Sophie')}</h1>
        <p className="tnum text-sm text-muted-foreground">
          {t.serviceDay} · {t.updatedAt}
        </p>
        <p className="mt-2 text-pretty text-base font-medium text-foreground @2xl:text-lg">
          {summary.allClear ? t.summaryClear : t.summary(summary.total, summary.late, summary.partial)}
        </p>
        {summary.partial && (
          <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <CircleAlert className="size-4" aria-hidden />
            {t.summaryUnavailable}
          </p>
        )}
      </header>

      {summary.allClear ? (
        <AllClear />
      ) : (
        <>
          <NowStrip urgent={data.urgent} />
          <div className="grid items-start gap-4 @4xl:grid-cols-2">
            {renderSection('reception')}
            {renderSection('interventions')}
            <ClearSiteCard data={data} role={role} className="@4xl:col-span-2" />
            {renderSection('directory', role === 'team' ? '@4xl:col-span-2' : undefined)}
            {role === 'admin' && renderSection('health')}
          </div>
        </>
      )}

      <PulseStrip pulse={data.pulse} />
    </main>
  )
}

function AllClear() {
  const { t } = useT()
  return (
    <section className="flex flex-col items-start gap-3 rounded-lg border border-success/30 bg-success-muted px-5 py-8 @2xl:flex-row @2xl:items-center @2xl:gap-5 @2xl:px-8">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-card text-success ring-1 ring-success/30">
        <CircleCheck className="size-6" aria-hidden />
      </span>
      <div>
        <h2 className="text-xl font-semibold text-success-foreground">{t.allClear.title}</h2>
        <p className="text-pretty text-sm leading-relaxed text-foreground/80">{t.allClear.body}</p>
      </div>
    </section>
  )
}
