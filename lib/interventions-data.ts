export type SendStatus = 'not_sent' | 'sent_email' | 'sent_link'

export type Report = {
  id: string
  photoCount: number
  status: SendStatus
  /** ISO datetime when the report was sent to the client */
  sentAt?: string
}

export type Visit = {
  id: string
  /** yyyy-mm-dd */
  date: string
  employee: string
  photoCount: number
  reports: Report[]
}

export type BuildingLog = {
  id: string
  /** site / building label, shown as the primary title */
  name: string
  clientName: string
  city?: string
  visits: Visit[]
}

/** A single report lifted out of its building/visit, for the report-centric views. */
export type FlatReport = Report & {
  buildingId: string
  site: string
  clientName: string
  city?: string
  date: string
  employee: string
}

/**
 * Sample intervention log. Buildings, clients, cities, employees and photo
 * counts are drawn from the real Interventions screens so the redesign reads
 * against believable data. Most reports are intentionally `not_sent` — the
 * real pain point is reports that are ready but never delivered to the client.
 */
export const BUILDINGS: BuildingLog[] = [
  {
    id: 'b-kirkland',
    name: 'Centre Kirkland',
    clientName: 'First Capital Asset Management',
    city: 'Kirkland',
    visits: [
      {
        id: 'v-kirkland-1',
        date: '2026-09-15',
        employee: 'Jorge Ramirez',
        photoCount: 23,
        reports: [{ id: 'r-kirkland-1', photoCount: 23, status: 'not_sent' }],
      },
    ],
  },
  {
    id: 'b-herron',
    name: 'TD 890 Herron — Rénovation',
    clientName: 'Bee-Clean',
    city: 'Dorval',
    visits: [
      {
        id: 'v-herron-1',
        date: '2026-09-15',
        employee: 'Douha Bousbia Salah',
        photoCount: 10,
        reports: [{ id: 'r-herron-1', photoCount: 10, status: 'not_sent' }],
      },
    ],
  },
  {
    id: 'b-claude-audy',
    name: '20 Rue Claude-Audy',
    clientName: 'Côté Construction',
    city: 'Saint-Jérôme',
    visits: [
      {
        id: 'v-audy-1',
        date: '2026-09-15',
        employee: 'Antoine Bégin',
        photoCount: 59,
        reports: [
          { id: 'r-audy-1', photoCount: 34, status: 'sent_email', sentAt: '2026-09-15T16:10' },
          { id: 'r-audy-2', photoCount: 25, status: 'not_sent' },
        ],
      },
    ],
  },
  {
    id: 'b-drummond',
    name: 'Parking — Drummondville',
    clientName: 'Choice Properties',
    city: 'Drummondville',
    visits: [
      {
        id: 'v-drummond-1',
        date: '2026-09-15',
        employee: 'Edicson Vigil',
        photoCount: 76,
        reports: [
          { id: 'r-drummond-1', photoCount: 40, status: 'not_sent' },
          { id: 'r-drummond-2', photoCount: 36, status: 'not_sent' },
        ],
      },
      {
        id: 'v-drummond-2',
        date: '2026-09-14',
        employee: 'Edicson Vigil',
        photoCount: 95,
        reports: [
          { id: 'r-drummond-3', photoCount: 41, status: 'sent_email', sentAt: '2026-09-14T18:02' },
          { id: 'r-drummond-4', photoCount: 30, status: 'not_sent' },
          { id: 'r-drummond-5', photoCount: 24, status: 'not_sent' },
        ],
      },
    ],
  },
  {
    id: 'b-stjean',
    name: 'Parking — Saint-Jean-sur-Richelieu',
    clientName: 'Choice Properties',
    city: 'Saint-Jean-sur-Richelieu',
    visits: [
      {
        id: 'v-stjean-1',
        date: '2026-09-14',
        employee: 'Jean Benchimy',
        photoCount: 150,
        reports: [{ id: 'r-stjean-1', photoCount: 150, status: 'sent_email', sentAt: '2026-09-14T20:41' }],
      },
      {
        id: 'v-stjean-2',
        date: '2026-09-15',
        employee: 'Jean Benchimy',
        photoCount: 220,
        reports: [
          { id: 'r-stjean-2', photoCount: 120, status: 'not_sent' },
          { id: 'r-stjean-3', photoCount: 100, status: 'not_sent' },
        ],
      },
    ],
  },
  {
    id: 'b-longueuil',
    name: 'Parking — Longueuil',
    clientName: 'Choice Properties',
    city: 'Longueuil',
    visits: [
      {
        id: 'v-longueuil-1',
        date: '2026-09-15',
        employee: 'Jean Benchimy',
        photoCount: 200,
        reports: [
          { id: 'r-longueuil-1', photoCount: 110, status: 'not_sent' },
          { id: 'r-longueuil-2', photoCount: 90, status: 'not_sent' },
        ],
      },
      {
        id: 'v-longueuil-2',
        date: '2026-09-14',
        employee: 'Katherine Vittini',
        photoCount: 51,
        reports: [{ id: 'r-longueuil-3', photoCount: 51, status: 'not_sent' }],
      },
    ],
  },
  {
    id: 'b-abram',
    name: 'Abram — Salle électrique',
    clientName: 'Skyline',
    city: 'Montréal',
    visits: [
      {
        id: 'v-abram-1',
        date: '2026-09-15',
        employee: 'Antoine Bégin',
        photoCount: 7,
        reports: [{ id: 'r-abram-1', photoCount: 7, status: 'not_sent' }],
      },
    ],
  },
  {
    id: 'b-pvm',
    name: 'Place Ville Marie — Mario étage #41',
    clientName: 'Bee-Clean',
    city: 'Montréal',
    visits: [
      {
        id: 'v-pvm-1',
        date: '2026-09-14',
        employee: 'Antoine Bégin',
        photoCount: 7,
        reports: [{ id: 'r-pvm-1', photoCount: 7, status: 'not_sent' }],
      },
    ],
  },
  {
    id: 'b-sherwin-chambly',
    name: 'Sherwin-Williams (3042 Chambly)',
    clientName: 'Sherwin-Williams',
    city: 'Longueuil',
    visits: [
      {
        id: 'v-sherwin-1',
        date: '2026-09-14',
        employee: 'Katherine Vittini',
        photoCount: 99,
        reports: [{ id: 'r-sherwin-1', photoCount: 99, status: 'not_sent' }],
      },
    ],
  },
  {
    id: 'b-sherwin-jeantalon',
    name: 'Sherwin-Williams (5030 rue Jean-Talon Est)',
    clientName: 'Sherwin-Williams',
    city: 'Montréal',
    visits: [
      {
        id: 'v-sherwin-2',
        date: '2026-09-14',
        employee: 'Katherine Vittini',
        photoCount: 70,
        reports: [{ id: 'r-sherwin-2', photoCount: 70, status: 'not_sent' }],
      },
    ],
  },
  {
    id: 'b-ottawa-cancer',
    name: 'The Ottawa Cancer Foundation',
    clientName: 'The Ottawa Cancer Foundation',
    city: 'Ottawa',
    visits: [
      {
        id: 'v-ottawa-1',
        date: '2026-09-15',
        employee: 'Jorge Ramirez',
        photoCount: 198,
        reports: [
          { id: 'r-ottawa-1', photoCount: 76, status: 'not_sent' },
          { id: 'r-ottawa-2', photoCount: 64, status: 'not_sent' },
          { id: 'r-ottawa-3', photoCount: 58, status: 'not_sent' },
        ],
      },
    ],
  },
  {
    id: 'b-henri-bourassa',
    name: '6130 Boul Henri-Bourassa E, Montréal',
    clientName: 'The Ottawa Cancer Foundation',
    city: 'Montréal',
    visits: [
      {
        id: 'v-hb-1',
        date: '2026-09-03',
        employee: 'Jorge Ramirez',
        photoCount: 2,
        reports: [{ id: 'r-hb-1', photoCount: 2, status: 'not_sent' }],
      },
    ],
  },
  {
    id: 'b-td-4350',
    name: 'TD (#4350) — 3720 Des Sources',
    clientName: 'Bee-Clean',
    city: 'Dollard-des-Ormeaux',
    visits: [
      {
        id: 'v-td4350-1',
        date: '2026-09-02',
        employee: 'Douha Bousbia Salah',
        photoCount: 11,
        reports: [{ id: 'r-td4350-1', photoCount: 11, status: 'sent_link', sentAt: '2026-09-02T11:15' }],
      },
    ],
  },
]

/** Total number of buildings in the account — the list shows a filtered subset. */
export const TOTAL_BUILDINGS = 30

export function buildingPhotos(b: BuildingLog): number {
  return b.visits.reduce((sum, v) => sum + v.photoCount, 0)
}

export function buildingReports(b: BuildingLog): Report[] {
  return b.visits.flatMap((v) => v.reports)
}

export function buildingLastVisit(b: BuildingLog): string {
  return b.visits.reduce((latest, v) => (v.date > latest ? v.date : latest), b.visits[0]?.date ?? '')
}

export function unsentCount(reports: Report[]): number {
  return reports.filter((r) => r.status === 'not_sent').length
}

export function flattenReports(buildings: BuildingLog[] = BUILDINGS): FlatReport[] {
  const out: FlatReport[] = []
  for (const b of buildings) {
    for (const v of b.visits) {
      for (const r of v.reports) {
        out.push({
          ...r,
          buildingId: b.id,
          site: b.name,
          clientName: b.clientName,
          city: b.city,
          date: v.date,
          employee: v.employee,
        })
      }
    }
  }
  return out
}

export const TOTAL_TO_SEND = unsentCount(flattenReports())
