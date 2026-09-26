'use client'

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { useT } from '@/lib/dashboard-i18n'

const Ctx = createContext<(href: string) => void>(() => {})

export function FakeNavProvider({ children }: { children: ReactNode }) {
  const { t } = useT()
  const [href, setHref] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const go = useCallback((h: string) => {
    setHref(h)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setHref(null), 3200)
  }, [])

  return (
    <Ctx.Provider value={go}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        {href && (
          <div className="flex max-w-full flex-wrap items-baseline gap-x-2 rounded-md bg-foreground px-4 py-2.5 text-sm text-background shadow-lg">
            <span>{t.fakeLink}</span>
            <code className="break-all font-mono text-xs">{href}</code>
          </div>
        )}
      </div>
    </Ctx.Provider>
  )
}

export function FakeLink({ href, className, children, ...rest }: { href: string; className?: string; children: ReactNode } & Omit<React.ComponentProps<'a'>, 'href' | 'onClick'>) {
  const go = useContext(Ctx)
  return (
    <a
      {...rest}
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault()
        go(href)
      }}
    >
      {children}
    </a>
  )
}
