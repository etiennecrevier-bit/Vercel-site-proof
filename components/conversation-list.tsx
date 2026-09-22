'use client'

import { MessageCircle, Search } from 'lucide-react'
import type { Conversation } from '@/lib/conversations'
import type { Lang } from '@/lib/i18n'
import { shortStamp } from '@/lib/format'
import { messagingDict } from '@/lib/messaging-i18n'

type Props = {
  conversations: Conversation[]
  selectedId: string
  query: string
  onQueryChange: (q: string) => void
  onSelect: (id: string) => void
  lang: Lang
}

function initials(name: string | null, handle: string): string {
  if (!name) return handle.replace(/\D/g, '').slice(-2)
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')
}

export function ConversationList({ conversations, selectedId, query, onQueryChange, onSelect, lang }: Props) {
  const t = messagingDict(lang)

  return (
    <div className="flex h-full flex-col">
      {/* recherche */}
      <div className="border-b border-border p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* liste */}
      <ul className="min-h-0 flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <li className="p-6 text-center text-sm text-muted-foreground">—</li>
        ) : (
          conversations.map((c) => {
            const last = c.messages[c.messages.length - 1]
            const active = c.id === selectedId
            const preview = last.photoCount ? t.photosReceived(last.photoCount) : last.text
            return (
              <li key={c.id}>
                <button
                  onClick={() => onSelect(c.id)}
                  aria-current={active}
                  className={[
                    'flex w-full items-start gap-3 border-b border-border px-3 py-3 text-left transition-colors',
                    active ? 'bg-secondary' : 'hover:bg-muted',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase',
                      c.employeeName ? 'bg-primary/10 text-primary' : 'bg-attention-muted text-attention-foreground',
                    ].join(' ')}
                    aria-hidden
                  >
                    {initials(c.employeeName, c.waHandle)}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className={['truncate text-sm font-semibold', c.employeeName ? 'text-foreground' : 'text-attention-foreground'].join(' ')}>
                        {c.employeeName ?? c.waHandle}
                      </span>
                      <span className="tnum shrink-0 text-[11px] text-muted-foreground">{shortStamp(last.at, lang, t)}</span>
                    </span>

                    <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      {last.direction === 'out' && <span className="shrink-0 text-muted-foreground/70">↩</span>}
                      {last.photoCount ? <MessageCircle className="size-3 shrink-0" aria-hidden /> : null}
                      <span className="truncate">{preview}</span>
                    </span>

                    {c.lastSite && (
                      <span className="mt-1 inline-block max-w-full truncate rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {c.lastSite}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}
