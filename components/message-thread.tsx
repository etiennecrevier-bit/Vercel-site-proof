'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, MapPin, Phone, SendHorizontal } from 'lucide-react'
import type { Conversation, Message } from '@/lib/conversations'
import type { Lang } from '@/lib/i18n'
import { dayKey, dayLabel } from '@/lib/format'
import { messagingDict } from '@/lib/messaging-i18n'
import { MessageBubble } from '@/components/message-bubble'

type Props = {
  conversation: Conversation
  lang: Lang
  onSend: (conversationId: string, text: string) => void
}

export function MessageThread({ conversation, lang, onSend }: Props) {
  const t = messagingDict(lang)
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  // faire défiler vers le dernier message à l'ouverture et à chaque nouvel envoi
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [conversation.id, conversation.messages.length])

  function submit() {
    const text = draft.trim()
    if (!text) return
    onSend(conversation.id, text)
    setDraft('')
  }

  const quickReplies =
    conversation.lang === 'es'
      ? [
          { key: 'confirm', label: t.quickConfirm, text: 'Fotos recibidas, gracias.' },
          { key: 'thanks', label: t.quickThanks, text: 'Gracias por tu trabajo de hoy, se aprecia.' },
        ]
      : [
          { key: 'confirm', label: t.quickConfirm, text: 'Photos bien reçues, merci.' },
          { key: 'thanks', label: t.quickThanks, text: "Merci pour ton travail aujourd'hui, c'est apprécié." },
        ]

  const inbound = conversation.messages.filter((m) => m.direction === 'in').length
  const outbound = conversation.messages.length - inbound

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* en-tête de conversation */}
      <header className="flex items-center justify-between gap-3 border-b border-border bg-card/60 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={[
              'flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
              conversation.employeeName ? 'bg-primary/10 text-primary' : 'bg-attention-muted text-attention-foreground',
            ].join(' ')}
            aria-hidden
          >
            {(conversation.employeeName ?? conversation.waHandle).replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || '#'}
          </span>
          <div className="min-w-0">
            <h2 className={['truncate text-sm font-semibold', conversation.employeeName ? 'text-foreground' : 'text-attention-foreground'].join(' ')}>
              {conversation.employeeName ?? t.unrecognized}
            </h2>
            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-muted-foreground">
              <span className="tnum inline-flex items-center gap-1">
                <Phone className="size-3" aria-hidden />
                {conversation.waHandle}
              </span>
              {conversation.lastSite && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" aria-hidden />
                  {conversation.lastSite}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* compteur entrant / sortant */}
        <div className="hidden shrink-0 items-center gap-3 text-xs text-muted-foreground sm:flex">
          <span className="inline-flex items-center gap-1">
            <ArrowDownToLine className="size-3.5 text-success-foreground" aria-hidden />
            <span className="tnum">{inbound}</span>
            <span className="hidden md:inline">{t.inbound}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <ArrowUpFromLine className="size-3.5 text-primary" aria-hidden />
            <span className="tnum">{outbound}</span>
            <span className="hidden md:inline">{t.outbound}</span>
          </span>
        </div>
      </header>

      {/* fil de discussion unifié */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto bg-background px-4 py-5">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {groupByDay(conversation.messages).map((group) => (
            <div key={group.key} className="flex flex-col gap-3">
              <div className="my-1 flex items-center justify-center">
                <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium capitalize text-muted-foreground">
                  {dayLabel(group.items[0].at, lang, t)}
                </span>
              </div>
              {group.items.map((m) => (
                <MessageBubble key={m.id} message={m} lang={lang} />
              ))}
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>

      {/* zone de réponse */}
      <div className="border-t border-border bg-card px-4 py-3">
        <div className="mx-auto max-w-2xl">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{t.quickReplies}:</span>
            {quickReplies.map((q) => (
              <button
                key={q.key}
                onClick={() => setDraft(q.text)}
                className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {q.label}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                  e.preventDefault()
                  submit()
                }
              }}
              rows={1}
              placeholder={t.composerPlaceholder}
              aria-label={t.composerPlaceholder}
              className="max-h-32 min-h-[2.75rem] flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              onClick={submit}
              disabled={!draft.trim()}
              className="inline-flex h-[2.75rem] shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-40"
            >
              <SendHorizontal className="size-4" aria-hidden />
              <span className="hidden sm:inline">{t.send}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function groupByDay(messages: Message[]): { key: string; items: Message[] }[] {
  const groups: { key: string; items: Message[] }[] = []
  for (const m of messages) {
    const key = dayKey(m.at)
    const last = groups[groups.length - 1]
    if (last && last.key === key) last.items.push(m)
    else groups.push({ key, items: [m] })
  }
  return groups
}
