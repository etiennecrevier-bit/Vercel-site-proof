export type Role = 'team' | 'admin'
export type Scenario = 'normal' | 'clear' | 'unavailable'
export type SectionId = 'reception' | 'interventions' | 'clearsite' | 'directory' | 'health'
export type VisitState = 'received' | 'anomaly' | 'missing' | 'pending' | 'excused'
export type UrgentId = 'clearsiteMissing' | 'proofConflict' | 'sortOver2h' | 'reportOver24h' | 'quoteExpiring'

export type QueueId =
  | 'toSort'
  | 'proofConflict'
  | 'texts'
  | 'unknownNumbers'
  | 'emails'
  | 'reportsUntreated'
  | 'reportsInProgress'
  | 'noReport'
  | 'quoteDrafts'
  | 'quotesSent'
  | 'quotesExpiring'
  | 'proofsToAttach'
  | 'noPhone'
  | 'noAssignment'
  | 'errors7d'
  | 'stuck'
  | 'emailFailures'
  | 'oldestPending'

export type Queue = {
  id: QueueId
  /** null = le compteur n'a pas pu se charger */
  count: number | null
  oldestMin: number | null
  href: string
  sub?: boolean
  adminOnly?: boolean
  detail?: 'oldest' | 'expires' | 'age-value'
  expiresMin?: number
}

export type MissingVisit = { building: string; deadlineMin: number; lateMin: number; href: string }

export type Urgent = {
  id: UrgentId
  count: number | null
  href: string
  section: SectionId
  building?: string
  deadlineMin?: number
  lateMin?: number
  oldestMin?: number
  expiresMin?: number
}

export type Pulse = {
  received: number | null
  autoPct: number | null
  reportsSent: number | null
  proofsReceived: number | null
  proofsExpected: number | null
}

export type DashboardData = {
  queues: Record<QueueId, Queue>
  visits: Record<VisitState, number>
  notRequired: number
  missing: MissingVisit[]
  urgent: Urgent[]
  pulse: Pulse
}

export const SECTIONS: { id: Exclude<SectionId, 'clearsite'>; queueIds: QueueId[]; adminOnly?: boolean; href: string }[] = [
  { id: 'reception', href: '/boite-de-reception', queueIds: ['toSort', 'proofConflict', 'texts', 'unknownNumbers', 'emails'] },
  {
    id: 'interventions',
    href: '/interventions/journal',
    queueIds: ['reportsUntreated', 'reportsInProgress', 'noReport', 'quoteDrafts', 'quotesSent', 'quotesExpiring'],
  },
  { id: 'directory', href: '/repertoire', queueIds: ['noPhone', 'noAssignment'] },
  { id: 'health', href: '/parametres/sante', adminOnly: true, queueIds: ['errors7d', 'stuck', 'emailFailures', 'oldestPending'] },
]

export const CLEARSITE_HREF = '/clearsite?jour=aujourdhui'
export const CLEARSITE_MISSING_HREF = '/clearsite?jour=aujourdhui&etat=manquante'
export const INBOX_QUEUES: QueueId[] = ['toSort', 'texts', 'unknownNumbers', 'emails']

type QueueSeed = Omit<Queue, 'count' | 'oldestMin'>

const QUEUE_SEEDS: Record<QueueId, QueueSeed> = {
  toSort: { id: 'toSort', href: '/boite-de-reception?filtre=a-classer' },
  proofConflict: { id: 'proofConflict', sub: true, href: '/boite-de-reception?filtre=conflit-de-preuve' },
  texts: { id: 'texts', href: '/boite-de-reception/textos?filtre=a-traiter' },
  unknownNumbers: { id: 'unknownNumbers', href: '/boite-de-reception/numeros-inconnus' },
  emails: { id: 'emails', href: '/boite-de-reception/courriels?filtre=non-classes,echec' },
  reportsUntreated: { id: 'reportsUntreated', href: '/interventions/journal?etat=non-traite' },
  reportsInProgress: { id: 'reportsInProgress', href: '/interventions/journal?etat=en-traitement' },
  noReport: { id: 'noReport', href: '/interventions/journal?filtre=sans-rapport' },
  quoteDrafts: { id: 'quoteDrafts', href: '/interventions/soumissions?etat=brouillon' },
  quotesSent: { id: 'quotesSent', href: '/interventions/soumissions?etat=envoyee&reponse=aucune' },
  quotesExpiring: {
    id: 'quotesExpiring',
    sub: true,
    detail: 'expires',
    href: '/interventions/soumissions?etat=envoyee&expire=moins-3j',
  },
  proofsToAttach: { id: 'proofsToAttach', adminOnly: true, href: '/clearsite/preuves?filtre=a-rattacher' },
  noPhone: { id: 'noPhone', href: '/repertoire/employes?filtre=sans-telephone' },
  noAssignment: { id: 'noAssignment', href: '/repertoire/employes?filtre=sans-affectation' },
  errors7d: { id: 'errors7d', adminOnly: true, href: '/parametres/sante?vue=erreurs&periode=7j' },
  stuck: { id: 'stuck', adminOnly: true, href: '/parametres/sante?vue=bloques' },
  emailFailures: { id: 'emailFailures', adminOnly: true, href: '/boite-de-reception/courriels?filtre=echec' },
  oldestPending: { id: 'oldestPending', adminOnly: true, detail: 'age-value', href: '/boite-de-reception?tri=plus-ancien' },
}

// [count, oldest item age in minutes]
const NORMAL: Record<QueueId, [number, number | null]> = {
  toSort: [23, 130],
  proofConflict: [3, 48],
  texts: [6, 35],
  unknownNumbers: [2, 1560],
  emails: [4, 310],
  reportsUntreated: [11, 1800],
  reportsInProgress: [7, 540],
  noReport: [5, 2950],
  quoteDrafts: [3, 5800],
  quotesSent: [9, 17280],
  quotesExpiring: [2, null],
  proofsToAttach: [7, 190],
  noPhone: [4, 8640],
  noAssignment: [0, null],
  errors7d: [5, 4320],
  stuck: [0, null],
  emailFailures: [2, 310],
  oldestPending: [1, 130],
}

const MISSING: MissingVisit[] = [
  { building: 'TD (#4384) - 3662 St-Charles', deadlineMin: 8 * 60, lateMin: 162, href: '/clearsite/visites/td-4384' },
  { building: 'BMO (#0212) - 1205 Sainte-Catherine O.', deadlineMin: 8 * 60 + 30, lateMin: 132, href: '/clearsite/visites/bmo-0212' },
  { building: 'TD (#1127) - 5800 boul. Taschereau', deadlineMin: 9 * 60, lateMin: 102, href: '/clearsite/visites/td-1127' },
]

function buildQueues(values: Record<QueueId, [number, number | null]>, unavailable: QueueId[] = []) {
  const out = {} as Record<QueueId, Queue>
  for (const id of Object.keys(QUEUE_SEEDS) as QueueId[]) {
    const [count, oldestMin] = values[id]
    const isDown = unavailable.includes(id)
    out[id] = {
      ...QUEUE_SEEDS[id],
      count: isDown ? null : count,
      oldestMin: isDown || count === 0 ? null : oldestMin,
      expiresMin: id === 'quotesExpiring' && count > 0 ? 1680 : undefined,
    }
  }
  return out
}

function normalUrgent(reportsDown: boolean): Urgent[] {
  return [
    {
      id: 'clearsiteMissing',
      section: 'clearsite',
      count: 9,
      href: CLEARSITE_MISSING_HREF,
      building: MISSING[0].building,
      deadlineMin: MISSING[0].deadlineMin,
      lateMin: MISSING[0].lateMin,
    },
    { id: 'proofConflict', section: 'reception', count: 3, oldestMin: 48, href: QUEUE_SEEDS.proofConflict.href },
    { id: 'sortOver2h', section: 'reception', count: 4, oldestMin: 130, href: '/boite-de-reception?filtre=a-classer&age=plus-2h' },
    {
      id: 'reportOver24h',
      section: 'interventions',
      count: reportsDown ? null : 5,
      oldestMin: reportsDown ? undefined : 1800,
      href: '/interventions/journal?etat=non-traite&age=plus-24h',
    },
    { id: 'quoteExpiring', section: 'interventions', count: 2, expiresMin: 1680, href: QUEUE_SEEDS.quotesExpiring.href },
  ]
}

export function getDashboard(scenario: Scenario): DashboardData {
  if (scenario === 'clear') {
    const zero = Object.fromEntries(Object.keys(QUEUE_SEEDS).map((id) => [id, [0, null]])) as Record<
      QueueId,
      [number, number | null]
    >
    return {
      queues: buildQueues(zero),
      visits: { received: 178, anomaly: 0, missing: 0, pending: 0, excused: 4 },
      notRequired: 218,
      missing: [],
      urgent: normalUrgent(false).map((u) => ({ ...u, count: 0 })),
      pulse: { received: 318, autoPct: 84, reportsSent: 52, proofsReceived: 178, proofsExpected: 178 },
    }
  }

  const reportsDown = scenario === 'unavailable'
  return {
    queues: buildQueues(NORMAL, reportsDown ? ['reportsUntreated'] : []),
    visits: { received: 142, anomaly: 6, missing: 9, pending: 21, excused: 4 },
    notRequired: 218,
    missing: MISSING,
    urgent: normalUrgent(reportsDown),
    pulse: { received: 312, autoPct: 81, reportsSent: 47, proofsReceived: 142, proofsExpected: 178 },
  }
}

export function queuesFor(data: DashboardData, ids: QueueId[], role: Role) {
  return ids.map((id) => data.queues[id]).filter((q) => role === 'admin' || !q.adminOnly)
}

/** Total of work waiting for the team (sub-rows and system health excluded to avoid double counting). */
export function summarize(data: DashboardData, role: Role) {
  const counted: (number | null)[] = []
  for (const section of SECTIONS) {
    if (section.id === 'health') continue
    for (const q of queuesFor(data, section.queueIds, role)) if (!q.sub) counted.push(q.count)
  }
  if (role === 'admin') counted.push(data.queues.proofsToAttach.count)
  counted.push(data.visits.missing, data.visits.anomaly)

  const lateCounts = data.urgent.map((u) => u.count)
  const sum = (xs: (number | null)[]) => xs.reduce<number>((a, b) => a + (b ?? 0), 0)
  const partial = counted.includes(null) || lateCounts.includes(null)

  let healthIssues = 0
  if (role === 'admin') {
    healthIssues = sum(['errors7d', 'stuck', 'emailFailures'].map((id) => data.queues[id as QueueId].count))
  }

  return { total: sum(counted), late: sum(lateCounts), partial, allClear: sum(counted) === 0 && !partial && healthIssues === 0 }
}

export function inboxBadge(data: DashboardData) {
  const counts = INBOX_QUEUES.map((id) => data.queues[id].count)
  if (counts.includes(null)) return null
  return counts.reduce<number>((a, b) => a + (b ?? 0), 0)
}
