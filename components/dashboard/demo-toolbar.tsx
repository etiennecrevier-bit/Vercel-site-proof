'use client'

import type { Role, Scenario } from '@/lib/dashboard-data'
import { useT } from '@/lib/dashboard-i18n'

export type Preview = 'desktop' | 'phone'

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { key: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div role="group" aria-label={label} className="flex overflow-hidden rounded-md border border-border">
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            aria-pressed={value === o.key}
            onClick={() => onChange(o.key)}
            className={[
              'px-2.5 py-1 text-xs font-medium transition-colors',
              value === o.key ? 'bg-foreground text-background' : 'bg-card text-muted-foreground hover:bg-muted',
            ].join(' ')}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function DemoToolbar(props: {
  scenario: Scenario
  setScenario: (s: Scenario) => void
  role: Role
  setRole: (r: Role) => void
  preview: Preview
  setPreview: (p: Preview) => void
}) {
  const { t } = useT()
  return (
    <div className="border-b border-dashed border-border bg-secondary">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2 sm:px-6">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.demo.label}</span>
        <Segmented
          label={t.demo.state}
          value={props.scenario}
          onChange={props.setScenario}
          options={[
            { key: 'normal', label: t.demo.normal },
            { key: 'clear', label: t.demo.clear },
            { key: 'unavailable', label: t.demo.unavailable },
          ]}
        />
        <Segmented
          label={t.demo.viewAs}
          value={props.role}
          onChange={props.setRole}
          options={[
            { key: 'team', label: t.demo.team },
            { key: 'admin', label: t.demo.admin },
          ]}
        />
        <Segmented
          label={t.demo.preview}
          value={props.preview}
          onChange={props.setPreview}
          options={[
            { key: 'desktop', label: t.demo.desktop },
            { key: 'phone', label: `${t.demo.phone} · 390 px` },
          ]}
        />
      </div>
    </div>
  )
}
