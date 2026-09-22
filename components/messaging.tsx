'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { CONVERSATIONS, type Conversation, type Message } from '@/lib/conversations'
import { LANGS, useI18n, type Lang } from '@/lib/i18n'
import { messagingDict } from '@/lib/messaging-i18n'
import { ConversationList } from '@/components/conversation-list'
import { MessageThread } from '@/components/message-thread'

function lastActivity(c: Conversation): number {
  return new Date(c.messages[c.messages.length - 1].at).getTime()
}

export function Messaging() {
  const { lang, setLang } = useI18n()
  const t = messagingDict(lang)

  const [convos, setConvos] = useState<Conversation[]>(CONVERSATIONS)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string>(() =>
    [...CONVERSATIONS].sort((a, b) => lastActivity(b) - lastActivity(a))[0].id,
  )
  // sur mobile : bascule entre la liste et le fil ouvert
  const [mobileView, setMobileView] = useState<'list' | 'thread'>('list')

  const sorted = useMemo(() => [...convos].sort((a, b) => lastActivity(b) - lastActivity(a)), [convos])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sorted
    return sorted.filter((c) => {
      const hay = [c.employeeName ?? '', c.waHandle, c.lastSite ?? '', ...c.messages.map((m) => m.text)].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [sorted, query])

  const selected = convos.find((c) => c.id === selectedId) ?? sorted[0]

  function handleSelect(id: string) {
    setSelectedId(id)
    setMobileView('thread')
  }

  function handleSend(conversationId: string, text: string) {
    const now = new Date().toISOString()
    const msg: Message = {
      id: `m-${Math.random().toString(36).slice(2, 9)}`,
      direction: 'out',
      kind: 'thanks',
      at: now,
      channel: 'whatsapp',
      status: 'sent',
      text,
    }
    setConvos((prev) => prev.map((c) => (c.id === conversationId ? { ...c, messages: [...c.messages, msg] } : c)))
  }

  return (
    <div className="mx-auto flex h-svh max-w-6xl flex-col px-0 sm:px-6 sm:py-6">
      {/* en-tête d'application */}
      <header className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:rounded-t-xl sm:border sm:border-b-0 sm:bg-card sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground" aria-hidden>
            <MessageSquare className="size-5" />
          </span>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <span className="inline-block size-2 rounded-sm bg-primary" aria-hidden />
              Site Proof
            </div>
            <h1 className="text-lg font-bold leading-tight tracking-tight text-foreground">{t.title}</h1>
          </div>
        </div>

        <div className="flex overflow-hidden rounded-md border border-border" role="group" aria-label="Langue">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLang(code as Lang)}
              aria-pressed={lang === code}
              className={[
                'px-2.5 py-1.5 text-sm font-semibold transition-colors',
                lang === code ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* deux volets */}
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden border-border sm:grid-cols-[20rem_1fr] sm:rounded-b-xl sm:border">
        {/* volet gauche — liste */}
        <aside
          className={[
            'min-h-0 border-border bg-card sm:block sm:border-r',
            mobileView === 'list' ? 'block' : 'hidden',
          ].join(' ')}
        >
          <ConversationList
            conversations={filtered}
            selectedId={selected?.id ?? ''}
            query={query}
            onQueryChange={setQuery}
            onSelect={handleSelect}
            lang={lang}
          />
        </aside>

        {/* volet droit — fil */}
        <section className={['min-h-0 bg-background sm:block', mobileView === 'thread' ? 'block' : 'hidden'].join(' ')}>
          {selected ? (
            <div className="flex h-full min-h-0 flex-col">
              {/* retour mobile */}
              <button
                onClick={() => setMobileView('list')}
                className="flex items-center gap-1.5 border-b border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground sm:hidden"
              >
                <ArrowLeft className="size-4" aria-hidden />
                {t.conversations}
              </button>
              <div className="min-h-0 flex-1">
                <MessageThread conversation={selected} lang={lang} onSend={handleSend} />
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
              <MessageSquare className="size-8 text-muted-foreground/50" aria-hidden />
              <p className="text-sm font-semibold text-foreground">{t.emptyTitle}</p>
              <p className="max-w-xs text-sm text-muted-foreground">{t.emptyBody}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
