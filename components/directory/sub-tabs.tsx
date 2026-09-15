'use client'

import Link from 'next/link'
import { useDir } from '@/lib/directory-i18n'

type TabKey = 'clients' | 'employees' | 'buildings' | 'assignments' | 'team'

export function SubTabs({ active }: { active: TabKey }) {
  const { t } = useDir()

  const tabs: { key: TabKey; label: string; href?: string }[] = [
    { key: 'clients', label: t.tabClients },
    { key: 'employees', label: t.tabEmployees, href: '/repertoire' },
    { key: 'buildings', label: t.tabBuildings, href: '/repertoire/batiments' },
    { key: 'assignments', label: t.tabAssignments },
    { key: 'team', label: t.tabTeam },
  ]

  return (
    <div className="mb-5 flex flex-wrap gap-1 border-b border-border">
      {tabs.map((tab) => {
        const isActive = tab.key === active
        const className = [
          '-mb-px border-b-2 px-3 py-2 text-sm font-medium',
          isActive
            ? 'border-primary text-foreground'
            : 'border-transparent text-muted-foreground hover:text-foreground',
        ].join(' ')

        if (tab.href) {
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={className}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          )
        }
        return (
          <span key={tab.key} className={className}>
            {tab.label}
          </span>
        )
      })}
    </div>
  )
}
