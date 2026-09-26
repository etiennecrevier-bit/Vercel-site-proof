'use client'

import type { Pulse } from '@/lib/dashboard-data'
import { useT } from '@/lib/dashboard-i18n'

export function PulseStrip({ pulse }: { pulse: Pulse }) {
  const { t } = useT()
  const show = (v: number | null, f: (n: number) => string = String) => (v === null ? '—' : f(v))
  const items = [
    { value: show(pulse.received), label: t.pulse.received },
    { value: show(pulse.autoPct, t.pct), label: t.pulse.auto },
    { value: show(pulse.reportsSent), label: t.pulse.reportsSent },
    {
      value: pulse.proofsReceived === null || pulse.proofsExpected === null ? '—' : `${pulse.proofsReceived} / ${pulse.proofsExpected}`,
      label: t.pulse.proofs,
    },
  ]

  return (
    <section aria-labelledby="pulse-title" className="flex flex-col gap-3 border-t border-border pt-5">
      <h2 id="pulse-title" className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-foreground">
        {t.pulse.title}
        <span className="text-xs font-normal text-muted-foreground">{t.pulse.since}</span>
      </h2>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 @2xl:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="flex flex-col">
            <dd className="tnum text-lg font-semibold text-foreground">{it.value}</dd>
            <dt className="text-sm text-muted-foreground">{it.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
