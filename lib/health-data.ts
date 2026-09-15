export type IndicatorKey =
  | 'openNoReport'
  | 'inboxPhotos'
  | 'errors7d'
  | 'stuck'
  | 'reportsNotSent'
  | 'emailsFailed'

export type HealthRow = {
  id: string
  primary: string
  secondary: string
  ageMin: number
  jobId?: string
}

export type Indicator = {
  key: IndicatorKey
  total: number
  /** total is estimated over a bounded window (see healthWindowNote) */
  windowed?: boolean
  /** oldest slice, at most ten */
  rows: HealthRow[]
}

/**
 * Chiffres de référence relevés en lecture seule :
 * 1 intervention ouverte, 1 036 messages à photos non classés,
 * 56 rapports non transmis, 0 courriel en échec.
 */
export const INDICATORS: Indicator[] = [
  {
    key: 'openNoReport',
    total: 1,
    windowed: true,
    rows: [
      {
        id: 'j1',
        primary: '4080 Côte-Sainte-Catherine',
        secondary: 'Intervention du 12 sept · 14 photos',
        ageMin: 4320,
        jobId: 'JOB-4080-0912',
      },
    ],
  },
  {
    key: 'inboxPhotos',
    total: 1036,
    rows: [
      { id: 'm1', primary: 'Jorge Ramirez', secondary: '12 photos', ageMin: 12960 },
      { id: 'm2', primary: '+1 514 713 4220 · non reconnu', secondary: '5 photos', ageMin: 11520 },
      { id: 'm3', primary: 'Edicson Vigil', secondary: '28 photos', ageMin: 11520 },
      { id: 'm4', primary: 'Katherine Vittini', secondary: '3 photos', ageMin: 10080 },
      { id: 'm5', primary: 'Douha Bousbia Salah', secondary: '41 photos', ageMin: 10080 },
      { id: 'm6', primary: '+1 438 334 3031 · non reconnu', secondary: '7 photos', ageMin: 8640 },
    ],
  },
  {
    key: 'errors7d',
    total: 3,
    rows: [
      { id: 'e1', primary: '+1 514 226 6114', secondary: 'Média illisible', ageMin: 7200 },
      { id: 'e2', primary: 'Antoine Bégin', secondary: 'Format non pris en charge', ageMin: 4320 },
      { id: 'e3', primary: '+1 514 835 3468', secondary: 'Téléchargement expiré', ageMin: 1440 },
    ],
  },
  {
    key: 'stuck',
    total: 2,
    rows: [
      { id: 's1', primary: 'Jean Benchimy', secondary: 'Réclamé, sans progrès', ageMin: 42 },
      { id: 's2', primary: 'Cindy', secondary: 'Réclamé, sans progrès', ageMin: 26 },
    ],
  },
  {
    key: 'reportsNotSent',
    total: 56,
    rows: [
      { id: 'r1', primary: '2200 McGill College', secondary: 'Rapport du 28 août', ageMin: 25920, jobId: 'JOB-2200-0828' },
      { id: 'r2', primary: '700 De La Gauchetière O.', secondary: 'Rapport du 30 août', ageMin: 23040, jobId: 'JOB-0700-0830' },
      { id: 'r3', primary: '1355 Banks Street, Ottawa', secondary: 'Rapport du 2 sept', ageMin: 18720, jobId: 'JOB-1355-0902' },
      { id: 'r4', primary: '4855 Papineau', secondary: 'Rapport du 3 sept', ageMin: 17280, jobId: 'JOB-4855-0903' },
      { id: 'r5', primary: '800 Boul. René-Lévesque O.', secondary: 'Rapport du 5 sept', ageMin: 14400, jobId: 'JOB-0800-0905' },
      { id: 'r6', primary: '4120 Ch. de la Côte-Sainte-Catherine', secondary: 'Rapport du 6 sept', ageMin: 12960, jobId: 'JOB-4120-0906' },
    ],
  },
  {
    key: 'emailsFailed',
    total: 0,
    rows: [],
  },
]
