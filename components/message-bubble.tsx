'use client'

import { Bot, Check, CheckCheck, Image as ImageIcon } from 'lucide-react'
import type { Message } from '@/lib/conversations'
import type { Lang } from '@/lib/i18n'
import { formatTime } from '@/lib/format'
import { messagingDict } from '@/lib/messaging-i18n'

export function MessageBubble({ message, lang }: { message: Message; lang: Lang }) {
  const t = messagingDict(lang)
  const out = message.direction === 'out'

  return (
    <div className={['flex w-full', out ? 'justify-end' : 'justify-start'].join(' ')}>
      <div className={['flex max-w-[min(30rem,85%)] flex-col gap-1', out ? 'items-end' : 'items-start'].join(' ')}>
        {/* étiquette d'origine pour les sortants */}
        {out && (
          <span className="flex items-center gap-1 px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {message.automated ? (
              <>
                <Bot className="size-3" aria-hidden />
                {t.automated}
              </>
            ) : (
              t.supervisor
            )}
          </span>
        )}

        <div
          className={[
            'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm',
            out
              ? 'rounded-br-sm bg-primary text-primary-foreground'
              : 'rounded-bl-sm border border-border bg-card text-card-foreground',
          ].join(' ')}
        >
          {/* bandeau site pour un rapport photo entrant */}
          {message.site && (
            <div
              className={[
                'mb-1.5 text-xs font-semibold',
                out ? 'text-primary-foreground/80' : 'text-primary',
              ].join(' ')}
            >
              {message.site}
            </div>
          )}

          <p className="text-pretty whitespace-pre-line">{message.text}</p>

          {/* vignettes de photos jointes */}
          {message.photoCount ? (
            <div className="mt-2">
              <div className="grid grid-cols-3 gap-1">
                {(message.thumbnails ?? []).slice(0, 3).map((src, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-md bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src || '/placeholder.svg'} alt="" className="size-full object-cover" />
                    {i === 2 && (message.photoCount ?? 0) > 3 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-foreground/55 text-sm font-semibold text-background">
                        +{(message.photoCount ?? 0) - 3}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div
                className={[
                  'mt-1.5 flex items-center gap-1 text-xs',
                  out ? 'text-primary-foreground/80' : 'text-muted-foreground',
                ].join(' ')}
              >
                <ImageIcon className="size-3.5" aria-hidden />
                <span className="tnum">{t.photosReceived(message.photoCount)}</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* horodatage + accusé */}
        <span className="flex items-center gap-1 px-1 text-[11px] text-muted-foreground">
          <span className="tnum">{formatTime(message.at, lang)}</span>
          {out && <DeliveryTick status={message.status} />}
        </span>
      </div>
    </div>
  )
}

function DeliveryTick({ status }: { status?: Message['status'] }) {
  if (!status || status === 'received') return null
  if (status === 'read') return <CheckCheck className="size-3.5 text-primary" aria-label="Lu" />
  if (status === 'delivered') return <CheckCheck className="size-3.5 text-muted-foreground" aria-label="Distribué" />
  return <Check className="size-3.5 text-muted-foreground" aria-label="Envoyé" />
}
