'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { QueueId, SectionId, UrgentId, VisitState } from './dashboard-data'

export type Lang = 'fr' | 'en' | 'es'

const NB = '\u00a0'

type Dict = {
  nav: { label: string; dashboard: string; inbox: string; interventions: string; clearsite: string; directory: string; settings: string }
  greeting: (name: string) => string
  serviceDay: string
  updatedAt: string
  summary: (total: number, late: number, partial: boolean) => string
  summaryUnavailable: string
  summaryClear: string
  now: { title: string; subtitle: string; rulesLabel: string; rules: string[]; alsoLate: string; nothingLate: string }
  urgent: Record<UrgentId, (n: number) => string>
  urgentVerb: Record<UrgentId, string>
  deadlineLate: (deadline: string, late: string) => string
  oldest: (age: string) => string
  expiresIn: (age: string) => string
  sections: Record<SectionId, string>
  sectionHints: Partial<Record<SectionId, string>>
  openSection: string
  adminOnly: string
  queues: Record<QueueId, { label: string; verb: string }>
  nothingPending: string
  unavailable: string
  unavailableHint: string
  visit: Record<VisitState, string>
  visitsPlanned: (n: number) => string
  notRequired: (n: number) => string
  mostLate: string
  deadline: (t: string) => string
  seeAllMissing: (n: number) => string
  pulse: { title: string; since: string; received: string; auto: string; reportsSent: string; proofs: string }
  allClear: { title: string; body: string }
  demo: {
    label: string
    state: string
    normal: string
    clear: string
    unavailable: string
    viewAs: string
    team: string
    admin: string
    preview: string
    desktop: string
    phone: string
  }
  fakeLink: string
  age: (min: number) => string
  clock: (min: number) => string
  pct: (n: number) => string
}

const pad = (n: number) => String(n).padStart(2, '0')
const pl = (n: number, one: string, many: string) => (n === 1 ? one : many)

function makeAge(day: string, sep: string) {
  return (m: number) => {
    if (m < 60) return `${m}${NB}min`
    if (m < 1440) {
      const h = Math.floor(m / 60)
      const r = m % 60
      return r ? `${h}${sep}h${sep}${pad(r)}` : `${h}${sep}h`
    }
    const d = Math.floor(m / 1440)
    const h = Math.floor((m % 1440) / 60)
    return h ? `${d}${sep}${day}${NB}${h}${sep}h` : `${d}${sep}${day}`
  }
}

const fr: Dict = {
  nav: {
    label: 'Navigation principale',
    dashboard: 'Tableau de bord',
    inbox: 'Boîte de réception',
    interventions: 'Interventions',
    clearsite: 'ClearSite',
    directory: 'Répertoire',
    settings: 'Paramètres',
  },
  greeting: (n) => `Bonjour ${n}`,
  serviceDay: 'Journée de service du vendredi 25 septembre',
  updatedAt: `mis à jour à 10${NB}h${NB}42`,
  summary: (t, l, p) =>
    p
      ? `Au moins ${t} éléments attendent l'équipe, dont au moins ${l} en retard.`
      : `${t} ${pl(t, 'élément attend', 'éléments attendent')} l'équipe, dont ${l} en retard.`,
  summaryUnavailable: "Un compteur n'a pas pu se charger : le total est incomplet.",
  summaryClear: "Rien n'attend l'équipe pour l'instant.",
  now: {
    title: 'À faire maintenant',
    subtitle: 'En retard, toutes sections confondues',
    rulesLabel: 'Règles de retard (provisoires)',
    rules: [
      "preuve ClearSite manquante après l'heure limite",
      'conflit de preuve',
      'envoi à classer depuis plus de 2 h',
      'rapport non traité depuis plus de 24 h',
      'soumission qui expire dans moins de 3 jours',
    ],
    alsoLate: 'Aussi en retard :',
    nothingLate: 'Rien en retard',
  },
  urgent: {
    clearsiteMissing: (n) => pl(n, "preuve ClearSite manquante après l'heure limite", "preuves ClearSite manquantes après l'heure limite"),
    proofConflict: (n) => pl(n, 'conflit de preuve', 'conflits de preuve'),
    sortOver2h: (n) => pl(n, 'envoi à classer depuis plus de 2 h', 'envois à classer depuis plus de 2 h'),
    reportOver24h: (n) => pl(n, 'rapport non traité depuis plus de 24 h', 'rapports non traités depuis plus de 24 h'),
    quoteExpiring: (n) => pl(n, 'soumission qui expire dans moins de 3 jours', 'soumissions qui expirent dans moins de 3 jours'),
  },
  urgentVerb: { clearsiteMissing: 'Voir', proofConflict: 'Classer', sortOver2h: 'Classer', reportOver24h: 'Traiter', quoteExpiring: 'Suivre' },
  deadlineLate: (d, l) => `limite ${d} · en retard de ${l}`,
  oldest: (a) => `le plus ancien : il y a ${a}`,
  expiresIn: (a) => `la plus proche expire dans ${a}`,
  sections: {
    reception: 'Réception',
    interventions: 'Interventions',
    clearsite: 'ClearSite du jour',
    directory: 'Répertoire',
    health: 'Santé du système',
  },
  sectionHints: {
    interventions: 'Journal et Soumissions',
    clearsite: 'Preuves de présence des banques',
    directory: 'Ce qui empêche le classement automatique',
  },
  openSection: 'Ouvrir',
  adminOnly: 'Admin',
  queues: {
    toSort: { label: 'Envois de photos à classer', verb: 'Classer' },
    proofConflict: { label: 'dont conflits de preuve', verb: 'Classer' },
    texts: { label: "Textos d'employés à traiter", verb: 'Répondre' },
    unknownNumbers: { label: 'Numéros inconnus', verb: 'Rattacher' },
    emails: { label: 'Courriels non classés ou en échec', verb: 'Traiter' },
    reportsUntreated: { label: 'Rapports non traités', verb: 'Traiter' },
    reportsInProgress: { label: 'Rapports en traitement', verb: 'Reprendre' },
    noReport: { label: 'Interventions sans rapport', verb: 'Rédiger' },
    quoteDrafts: { label: 'Soumissions en brouillon', verb: 'Terminer' },
    quotesSent: { label: 'Soumissions envoyées sans réponse', verb: 'Suivre' },
    quotesExpiring: { label: 'dont expirent dans moins de 3 jours', verb: 'Suivre' },
    proofsToAttach: { label: 'Preuves à rattacher à une visite', verb: 'Rattacher' },
    noPhone: { label: 'Employés actifs sans numéro de téléphone', verb: 'Compléter' },
    noAssignment: { label: 'Employés sans affectation', verb: 'Affecter' },
    errors7d: { label: 'Envois en erreur (7 jours)', verb: 'Examiner' },
    stuck: { label: 'Traitements bloqués', verb: 'Examiner' },
    emailFailures: { label: 'Courriels en échec', verb: 'Examiner' },
    oldestPending: { label: 'Plus ancien envoi en attente', verb: 'Ouvrir' },
  },
  nothingPending: 'Rien en attente',
  unavailable: 'indisponible',
  unavailableHint: "Le compteur n'a pas pu se charger.",
  visit: { received: 'Reçue', anomaly: 'Anomalie', missing: 'Manquante', pending: 'En attente', excused: 'Excusée' },
  visitsPlanned: (n) => `${n} visites prévues aujourd'hui`,
  notRequired: (n) => `${n} bâtiments « non requise », non comptés`,
  mostLate: 'Manquantes les plus en retard',
  deadline: (t) => `limite ${t}`,
  seeAllMissing: (n) => `Voir les ${n} manquantes`,
  pulse: {
    title: 'Pouls du jour',
    since: 'depuis 4 h ce matin',
    received: 'envois reçus',
    auto: 'classés automatiquement',
    reportsSent: 'rapports transmis au client',
    proofs: 'preuves ClearSite reçues',
  },
  allClear: {
    title: 'Tout est à jour',
    body: 'Réception, Interventions, ClearSite et Répertoire : aucune file en attente.',
  },
  demo: {
    label: 'Maquette',
    state: 'État',
    normal: 'Journée normale',
    clear: 'Tout est à jour',
    unavailable: 'Compteur indisponible',
    viewAs: 'Voir comme',
    team: 'Équipe',
    admin: 'Administrateur',
    preview: 'Aperçu',
    desktop: 'Bureau',
    phone: 'Téléphone',
  },
  fakeLink: 'Lien factice, ouvrirait :',
  age: makeAge('j', NB),
  clock: (m) => `${pad(Math.floor(m / 60))}${NB}h${NB}${pad(m % 60)}`,
  pct: (n) => `${n}${NB}%`,
}

const en: Dict = {
  nav: {
    label: 'Main navigation',
    dashboard: 'Dashboard',
    inbox: 'Inbox',
    interventions: 'Interventions',
    clearsite: 'ClearSite',
    directory: 'Directory',
    settings: 'Settings',
  },
  greeting: (n) => `Hello ${n}`,
  serviceDay: 'Service day of Friday, September 25',
  updatedAt: 'updated at 10:42 a.m.',
  summary: (t, l, p) =>
    p
      ? `At least ${t} items are waiting for the team, at least ${l} of them late.`
      : `${t} ${pl(t, 'item is', 'items are')} waiting for the team, ${l} of them late.`,
  summaryUnavailable: 'One counter failed to load: the total is incomplete.',
  summaryClear: 'Nothing is waiting for the team right now.',
  now: {
    title: 'Do now',
    subtitle: 'Late, across all sections',
    rulesLabel: 'Lateness rules (provisional)',
    rules: [
      'ClearSite proof missing past its deadline',
      'proof conflict',
      'submission to sort for over 2 h',
      'report untreated for over 24 h',
      'quote expiring within 3 days',
    ],
    alsoLate: 'Also late:',
    nothingLate: 'Nothing late',
  },
  urgent: {
    clearsiteMissing: (n) => pl(n, 'ClearSite proof missing past deadline', 'ClearSite proofs missing past deadline'),
    proofConflict: (n) => pl(n, 'proof conflict', 'proof conflicts'),
    sortOver2h: (n) => pl(n, 'submission to sort for over 2 h', 'submissions to sort for over 2 h'),
    reportOver24h: (n) => pl(n, 'report untreated for over 24 h', 'reports untreated for over 24 h'),
    quoteExpiring: (n) => pl(n, 'quote expiring within 3 days', 'quotes expiring within 3 days'),
  },
  urgentVerb: { clearsiteMissing: 'View', proofConflict: 'Sort', sortOver2h: 'Sort', reportOver24h: 'Process', quoteExpiring: 'Follow up' },
  deadlineLate: (d, l) => `deadline ${d} · ${l} late`,
  oldest: (a) => `oldest: ${a} ago`,
  expiresIn: (a) => `soonest expires in ${a}`,
  sections: {
    reception: 'Reception',
    interventions: 'Interventions',
    clearsite: "Today's ClearSite",
    directory: 'Directory',
    health: 'System health',
  },
  sectionHints: {
    interventions: 'Log and Quotes',
    clearsite: 'Bank proof-of-presence',
    directory: 'What blocks automatic sorting',
  },
  openSection: 'Open',
  adminOnly: 'Admin',
  queues: {
    toSort: { label: 'Photo submissions to sort', verb: 'Sort' },
    proofConflict: { label: 'of which proof conflicts', verb: 'Sort' },
    texts: { label: 'Employee texts to handle', verb: 'Reply' },
    unknownNumbers: { label: 'Unknown numbers', verb: 'Link' },
    emails: { label: 'Unsorted or failed emails', verb: 'Handle' },
    reportsUntreated: { label: 'Untreated reports', verb: 'Process' },
    reportsInProgress: { label: 'Reports in progress', verb: 'Resume' },
    noReport: { label: 'Interventions without a report', verb: 'Write' },
    quoteDrafts: { label: 'Draft quotes', verb: 'Finish' },
    quotesSent: { label: 'Quotes sent, no reply', verb: 'Follow up' },
    quotesExpiring: { label: 'of which expire within 3 days', verb: 'Follow up' },
    proofsToAttach: { label: 'Proofs to attach to a visit', verb: 'Attach' },
    noPhone: { label: 'Active employees without a phone number', verb: 'Complete' },
    noAssignment: { label: 'Employees without an assignment', verb: 'Assign' },
    errors7d: { label: 'Submissions in error (7 days)', verb: 'Inspect' },
    stuck: { label: 'Stuck processing jobs', verb: 'Inspect' },
    emailFailures: { label: 'Failed emails', verb: 'Inspect' },
    oldestPending: { label: 'Oldest pending submission', verb: 'Open' },
  },
  nothingPending: 'Nothing pending',
  unavailable: 'unavailable',
  unavailableHint: 'This counter failed to load.',
  visit: { received: 'Received', anomaly: 'Anomaly', missing: 'Missing', pending: 'Pending', excused: 'Excused' },
  visitsPlanned: (n) => `${n} visits planned today`,
  notRequired: (n) => `${n} buildings "not required", not counted`,
  mostLate: 'Most overdue missing',
  deadline: (t) => `deadline ${t}`,
  seeAllMissing: (n) => `See all ${n} missing`,
  pulse: {
    title: "Today's pulse",
    since: 'since 4 a.m.',
    received: 'submissions received',
    auto: 'sorted automatically',
    reportsSent: 'reports sent to client',
    proofs: 'ClearSite proofs received',
  },
  allClear: { title: 'All caught up', body: 'Reception, Interventions, ClearSite and Directory: no queue is waiting.' },
  demo: {
    label: 'Mockup',
    state: 'State',
    normal: 'Normal day',
    clear: 'All caught up',
    unavailable: 'Counter unavailable',
    viewAs: 'View as',
    team: 'Team',
    admin: 'Administrator',
    preview: 'Preview',
    desktop: 'Desktop',
    phone: 'Phone',
  },
  fakeLink: 'Mock link, would open:',
  age: (m) => {
    if (m < 60) return `${m}${NB}min`
    if (m < 1440) return `${Math.floor(m / 60)}h${m % 60 ? ` ${pad(m % 60)}m` : ''}`
    const h = Math.floor((m % 1440) / 60)
    return `${Math.floor(m / 1440)}d${h ? ` ${h}h` : ''}`
  },
  clock: (m) => {
    const h = Math.floor(m / 60)
    return `${h % 12 || 12}:${pad(m % 60)}${NB}${h < 12 ? 'a.m.' : 'p.m.'}`
  },
  pct: (n) => `${n}%`,
}

const es: Dict = {
  nav: {
    label: 'Navegación principal',
    dashboard: 'Panel',
    inbox: 'Bandeja de entrada',
    interventions: 'Intervenciones',
    clearsite: 'ClearSite',
    directory: 'Directorio',
    settings: 'Ajustes',
  },
  greeting: (n) => `Hola ${n}`,
  serviceDay: 'Jornada de servicio del viernes 25 de septiembre',
  updatedAt: 'actualizado a las 10:42',
  summary: (t, l, p) =>
    p
      ? `Al menos ${t} elementos esperan al equipo, de ellos al menos ${l} con retraso.`
      : `${t} ${pl(t, 'elemento espera', 'elementos esperan')} al equipo, de ellos ${l} con retraso.`,
  summaryUnavailable: 'Un contador no se pudo cargar: el total está incompleto.',
  summaryClear: 'Nada espera al equipo por ahora.',
  now: {
    title: 'Hacer ahora',
    subtitle: 'Con retraso, en todas las secciones',
    rulesLabel: 'Reglas de retraso (provisionales)',
    rules: [
      'prueba ClearSite faltante tras la hora límite',
      'conflicto de prueba',
      'envío por clasificar desde hace más de 2 h',
      'informe sin tratar desde hace más de 24 h',
      'cotización que vence en menos de 3 días',
    ],
    alsoLate: 'También con retraso:',
    nothingLate: 'Nada con retraso',
  },
  urgent: {
    clearsiteMissing: (n) => pl(n, 'prueba ClearSite faltante tras la hora límite', 'pruebas ClearSite faltantes tras la hora límite'),
    proofConflict: (n) => pl(n, 'conflicto de prueba', 'conflictos de prueba'),
    sortOver2h: (n) => pl(n, 'envío por clasificar desde hace más de 2 h', 'envíos por clasificar desde hace más de 2 h'),
    reportOver24h: (n) => pl(n, 'informe sin tratar desde hace más de 24 h', 'informes sin tratar desde hace más de 24 h'),
    quoteExpiring: (n) => pl(n, 'cotización que vence en menos de 3 días', 'cotizaciones que vencen en menos de 3 días'),
  },
  urgentVerb: { clearsiteMissing: 'Ver', proofConflict: 'Clasificar', sortOver2h: 'Clasificar', reportOver24h: 'Tratar', quoteExpiring: 'Seguir' },
  deadlineLate: (d, l) => `límite ${d} · ${l} de retraso`,
  oldest: (a) => `el más antiguo: hace ${a}`,
  expiresIn: (a) => `la más próxima vence en ${a}`,
  sections: {
    reception: 'Recepción',
    interventions: 'Intervenciones',
    clearsite: 'ClearSite de hoy',
    directory: 'Directorio',
    health: 'Salud del sistema',
  },
  sectionHints: {
    interventions: 'Registro y Cotizaciones',
    clearsite: 'Pruebas de presencia de los bancos',
    directory: 'Lo que impide la clasificación automática',
  },
  openSection: 'Abrir',
  adminOnly: 'Admin',
  queues: {
    toSort: { label: 'Envíos de fotos por clasificar', verb: 'Clasificar' },
    proofConflict: { label: 'de ellos conflictos de prueba', verb: 'Clasificar' },
    texts: { label: 'Mensajes de empleados por tratar', verb: 'Responder' },
    unknownNumbers: { label: 'Números desconocidos', verb: 'Vincular' },
    emails: { label: 'Correos sin clasificar o fallidos', verb: 'Tratar' },
    reportsUntreated: { label: 'Informes sin tratar', verb: 'Tratar' },
    reportsInProgress: { label: 'Informes en tratamiento', verb: 'Retomar' },
    noReport: { label: 'Intervenciones sin informe', verb: 'Redactar' },
    quoteDrafts: { label: 'Cotizaciones en borrador', verb: 'Terminar' },
    quotesSent: { label: 'Cotizaciones enviadas sin respuesta', verb: 'Seguir' },
    quotesExpiring: { label: 'de ellas vencen en menos de 3 días', verb: 'Seguir' },
    proofsToAttach: { label: 'Pruebas por vincular a una visita', verb: 'Vincular' },
    noPhone: { label: 'Empleados activos sin número de teléfono', verb: 'Completar' },
    noAssignment: { label: 'Empleados sin asignación', verb: 'Asignar' },
    errors7d: { label: 'Envíos con error (7 días)', verb: 'Revisar' },
    stuck: { label: 'Procesos bloqueados', verb: 'Revisar' },
    emailFailures: { label: 'Correos fallidos', verb: 'Revisar' },
    oldestPending: { label: 'Envío pendiente más antiguo', verb: 'Abrir' },
  },
  nothingPending: 'Nada pendiente',
  unavailable: 'no disponible',
  unavailableHint: 'Este contador no se pudo cargar.',
  visit: { received: 'Recibida', anomaly: 'Anomalía', missing: 'Faltante', pending: 'Pendiente', excused: 'Excusada' },
  visitsPlanned: (n) => `${n} visitas previstas hoy`,
  notRequired: (n) => `${n} edificios «no requerida», no contados`,
  mostLate: 'Faltantes con más retraso',
  deadline: (t) => `límite ${t}`,
  seeAllMissing: (n) => `Ver las ${n} faltantes`,
  pulse: {
    title: 'Pulso del día',
    since: 'desde las 4 h',
    received: 'envíos recibidos',
    auto: 'clasificados automáticamente',
    reportsSent: 'informes enviados al cliente',
    proofs: 'pruebas ClearSite recibidas',
  },
  allClear: { title: 'Todo al día', body: 'Recepción, Intervenciones, ClearSite y Directorio: ninguna cola pendiente.' },
  demo: {
    label: 'Maqueta',
    state: 'Estado',
    normal: 'Día normal',
    clear: 'Todo al día',
    unavailable: 'Contador no disponible',
    viewAs: 'Ver como',
    team: 'Equipo',
    admin: 'Administrador',
    preview: 'Vista',
    desktop: 'Escritorio',
    phone: 'Teléfono',
  },
  fakeLink: 'Enlace ficticio, abriría:',
  age: makeAge('d', NB),
  clock: (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`,
  pct: (n) => `${n}${NB}%`,
}

const DICTS: Record<Lang, Dict> = { fr, en, es }

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
]

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({ lang: 'fr', setLang: () => {}, t: fr })

export function DashboardLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr')
  return <Ctx.Provider value={{ lang, setLang, t: DICTS[lang] }}>{children}</Ctx.Provider>
}

export function useT() {
  return useContext(Ctx)
}
