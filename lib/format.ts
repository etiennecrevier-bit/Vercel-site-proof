import type { Lang } from '@/lib/i18n'
import type { MessagingDict } from '@/lib/messaging-i18n'

const LOCALES: Record<Lang, string> = { fr: 'fr-CA', en: 'en-CA', es: 'es-ES' }

/** "aujourd'hui" simulé du prototype — aligné sur les données de démonstration */
const DEMO_TODAY = new Date('2026-09-22T12:00:00')

export function locale(lang: Lang): string {
  return LOCALES[lang]
}

export function formatTime(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleTimeString(LOCALES[lang], { hour: '2-digit', minute: '2-digit' })
}

/** clé de regroupement par jour (année-mois-jour) */
export function dayKey(iso: string): string {
  return iso.slice(0, 10)
}

export function dayLabel(iso: string, lang: Lang, dict: MessagingDict): string {
  const d = new Date(iso)
  const today = dayKey(DEMO_TODAY.toISOString())
  const yesterday = dayKey(new Date(DEMO_TODAY.getTime() - 86400000).toISOString())
  const key = dayKey(iso)
  if (key === today) return dict.today
  if (key === yesterday) return dict.yesterday
  return d.toLocaleDateString(LOCALES[lang], { weekday: 'long', day: 'numeric', month: 'long' })
}

/** libellé compact pour la liste : heure si aujourd'hui, sinon jour court */
export function shortStamp(iso: string, lang: Lang, dict: MessagingDict): string {
  const key = dayKey(iso)
  const today = dayKey(DEMO_TODAY.toISOString())
  const yesterday = dayKey(new Date(DEMO_TODAY.getTime() - 86400000).toISOString())
  if (key === today) return formatTime(iso, lang)
  if (key === yesterday) return dict.yesterday
  return new Date(iso).toLocaleDateString(LOCALES[lang], { day: 'numeric', month: 'short' })
}
