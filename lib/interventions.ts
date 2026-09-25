export type InterventionStatus =
  | 'non-traite'
  | 'en-traitement'
  | 'envoye-client'
  | 'envoye-soumission'
  | 'archive'

export type Intervention = {
  id: string
  /** Code de bon de travail, ex. « TD (#4594) ». Null pour les sites sans code. */
  code: string | null
  /** Nom du site / immeuble, ex. « 4840 Saint-Jean » ou « PARKING - LONGUEUIL ». */
  site: string
  client: string
  city: string
  /** Date de la visite, format ISO (YYYY-MM-DD). */
  date: string
  technician: string
  photoCount: number
  thumbnails: string[]
  /** Nombre de rapports PDF rattachés à la visite. */
  reportCount: number
  status: InterventionStatus
  hasSharedReport: boolean
}

/** Jour de référence du prototype (aligné sur les données ci-dessous). */
export const TODAY = '2026-09-24'

type StatusMeta = {
  label: string
  /** Regroupement de triage. */
  group: 'a-gerer' | 'envoye' | 'archive'
}

export const STATUS_META: Record<InterventionStatus, StatusMeta> = {
  'non-traite': { label: 'Non traité', group: 'a-gerer' },
  'en-traitement': { label: 'En traitement', group: 'a-gerer' },
  'envoye-client': { label: 'Envoyé au client', group: 'envoye' },
  'envoye-soumission': { label: 'Envoyé en soumission', group: 'envoye' },
  archive: { label: 'Archivé', group: 'archive' },
}

export const STATUS_ORDER: InterventionStatus[] = [
  'non-traite',
  'en-traitement',
  'envoye-client',
  'envoye-soumission',
  'archive',
]

const P = {
  lobby: '/photos/lobby-floor.png',
  glass: '/photos/glass-entrance.png',
  scrubber: '/photos/floor-scrubber.png',
  restroom: '/photos/restroom.png',
  corridor: '/photos/corridor.png',
  parking: '/photos/parking.png',
}

export const INTERVENTIONS: Intervention[] = [
  // --- Aujourd'hui : la file « à gérer » ---
  {
    id: 'IV-5501',
    code: null,
    site: 'PLACE PROVENCHER',
    client: 'FIRST CAPITAL ASSET MANAGEMENT',
    city: 'Longueuil',
    date: '2026-09-24',
    technician: 'Miguel Olivares',
    photoCount: 2,
    thumbnails: [P.glass, P.lobby],
    reportCount: 1,
    status: 'non-traite',
    hasSharedReport: true,
  },
  {
    id: 'IV-5502',
    code: 'TD (#4444)',
    site: '2942 Remembrance',
    client: 'BEE-CLEAN',
    city: 'Montréal',
    date: '2026-09-24',
    technician: 'Percy Vallejos',
    photoCount: 46,
    thumbnails: [P.parking, P.scrubber, P.corridor, P.lobby, P.glass],
    reportCount: 1,
    status: 'non-traite',
    hasSharedReport: true,
  },
  {
    id: 'IV-5503',
    code: null,
    site: 'GALERIES DES CHESNAYE',
    client: 'FIRST CAPITAL ASSET MANAGEMENT',
    city: 'Laval',
    date: '2026-09-24',
    technician: 'Oscar Vargas',
    photoCount: 17,
    thumbnails: [P.corridor, P.lobby, P.glass, P.restroom],
    reportCount: 1,
    status: 'en-traitement',
    hasSharedReport: true,
  },
  {
    id: 'IV-5504',
    code: 'TELUS (#6458)',
    site: 'STE-CATHERINE',
    client: 'BEE-CLEAN',
    city: 'Montréal',
    date: '2026-09-24',
    technician: 'Jose Ibarra',
    photoCount: 9,
    thumbnails: [P.glass, P.corridor, P.lobby],
    reportCount: 1,
    status: 'en-traitement',
    hasSharedReport: true,
  },
  {
    id: 'IV-5505',
    code: 'TD (#4482)',
    site: '9065 Maurice-Duplessis',
    client: 'BEE-CLEAN',
    city: 'Montréal',
    date: '2026-09-24',
    technician: 'Percy Vallejos',
    photoCount: 12,
    thumbnails: [P.lobby, P.corridor, P.glass, P.restroom],
    reportCount: 1,
    status: 'envoye-client',
    hasSharedReport: true,
  },
  {
    id: 'IV-5506',
    code: 'TD (#4594)',
    site: '4840 Saint-Jean',
    client: 'BEE-CLEAN',
    city: 'Montréal',
    date: '2026-09-24',
    technician: 'Cesar Sanchez Hernandez',
    photoCount: 5,
    thumbnails: [P.lobby, P.glass, P.corridor, P.restroom, P.scrubber],
    reportCount: 2,
    status: 'envoye-soumission',
    hasSharedReport: true,
  },
  {
    id: 'IV-5507',
    code: 'PARKING',
    site: 'PARKING - LONGUEUIL',
    client: 'CHOICE PROPERTIES',
    city: 'Longueuil',
    date: '2026-09-24',
    technician: 'Miguel Olivares',
    photoCount: 55,
    thumbnails: [P.parking, P.scrubber, P.corridor, P.lobby, P.glass],
    reportCount: 1,
    status: 'archive',
    hasSharedReport: true,
  },
  {
    id: 'IV-5508',
    code: 'TD (#4382)',
    site: '317 Brunswick',
    client: 'BEE-CLEAN',
    city: 'Pointe-Claire',
    date: '2026-09-24',
    technician: 'Cesar Sanchez Hernandez',
    photoCount: 4,
    thumbnails: [P.corridor, P.lobby, P.glass],
    reportCount: 1,
    status: 'archive',
    hasSharedReport: true,
  },
  {
    id: 'IV-5509',
    code: null,
    site: 'Mitsubishi Brossard',
    client: 'BEE-CLEAN',
    city: 'Brossard',
    date: '2026-09-24',
    technician: 'Etienne Crevier',
    photoCount: 2,
    thumbnails: [P.glass, P.lobby],
    reportCount: 1,
    status: 'archive',
    hasSharedReport: true,
  },

  // --- 23 septembre ---
  {
    id: 'IV-5410',
    code: 'TD (#4736)',
    site: '2065 Saint-Louis',
    client: 'BEE-CLEAN',
    city: 'Lachine',
    date: '2026-09-23',
    technician: 'Jose Ibarra',
    photoCount: 5,
    thumbnails: [P.lobby, P.corridor, P.glass, P.restroom],
    reportCount: 1,
    status: 'non-traite',
    hasSharedReport: true,
  },
  {
    id: 'IV-5411',
    code: 'TD (#4384)',
    site: '3662 St-Charles',
    client: 'BEE-CLEAN',
    city: 'Kirkland',
    date: '2026-09-23',
    technician: 'Oscar Vargas',
    photoCount: 16,
    thumbnails: [P.corridor, P.lobby, P.glass, P.restroom, P.scrubber],
    reportCount: 1,
    status: 'envoye-client',
    hasSharedReport: true,
  },
  {
    id: 'IV-5412',
    code: 'TD (#4309)',
    site: '5060 Arthur-Sauvé',
    client: 'BEE-CLEAN',
    city: 'Laval',
    date: '2026-09-23',
    technician: 'Miguel Olivares',
    photoCount: 21,
    thumbnails: [P.parking, P.corridor, P.lobby, P.glass],
    reportCount: 1,
    status: 'archive',
    hasSharedReport: true,
  },

  // --- 22 septembre ---
  {
    id: 'IV-5320',
    code: 'TD (#4280)',
    site: '433 Chabanel',
    client: 'BEE-CLEAN',
    city: 'Montréal',
    date: '2026-09-22',
    technician: 'Percy Vallejos',
    photoCount: 25,
    thumbnails: [P.corridor, P.restroom, P.lobby, P.glass],
    reportCount: 1,
    status: 'en-traitement',
    hasSharedReport: true,
  },
  {
    id: 'IV-5321',
    code: 'PARKING',
    site: 'PARKING - DRUMMONDVILLE',
    client: 'CHOICE PROPERTIES',
    city: 'Drummondville',
    date: '2026-09-22',
    technician: 'Oscar Vargas',
    photoCount: 100,
    thumbnails: [P.parking, P.scrubber, P.corridor, P.lobby, P.glass],
    reportCount: 1,
    status: 'archive',
    hasSharedReport: true,
  },
  {
    id: 'IV-5322',
    code: 'TD (#4484)',
    site: '5700 Grande Allée',
    client: 'BEE-CLEAN',
    city: 'Longueuil',
    date: '2026-09-22',
    technician: 'Cesar Sanchez Hernandez',
    photoCount: 5,
    thumbnails: [P.lobby, P.glass, P.corridor],
    reportCount: 1,
    status: 'envoye-soumission',
    hasSharedReport: true,
  },

  // --- 21 septembre ---
  {
    id: 'IV-5230',
    code: 'TD (#4481)',
    site: '9780 Leduc',
    client: 'BEE-CLEAN',
    city: 'Brossard',
    date: '2026-09-21',
    technician: 'Jose Ibarra',
    photoCount: 13,
    thumbnails: [P.corridor, P.lobby, P.glass, P.restroom],
    reportCount: 1,
    status: 'archive',
    hasSharedReport: true,
  },
  {
    id: 'IV-5231',
    code: 'TD (#4443)',
    site: '680 Arthur-Sauvé',
    client: 'BEE-CLEAN',
    city: 'Laval',
    date: '2026-09-21',
    technician: 'Miguel Olivares',
    photoCount: 7,
    thumbnails: [P.corridor, P.lobby, P.glass],
    reportCount: 1,
    status: 'archive',
    hasSharedReport: true,
  },
]

/** Liste des clients présents, pour le filtre. */
export const CLIENTS: string[] = Array.from(new Set(INTERVENTIONS.map((i) => i.client))).sort()
