export type ReportState = 'draft' | 'sent' | 'archived'

export type Photo = {
  index: number
  src: string
  source: string
  takenAt: string
  site: string
  sender: string
  filename: string
  sizeKb: number
}

export type Report = {
  createdAt: string
  photoCount: number
  url: string
}

export type InternalNote = {
  id: string
  author: string
  at: string
  body: string
}

export type Intervention = {
  code: string
  number: string
  siteName: string
  client: string
  date: string
  address: string
  photosSentBy: string
  reportState: ReportState
  lastChange: { action: string; by: string; at: string }
  workOrder: string
  notes: InternalNote[]
  report: Report
  photos: Photo[]
}

const POOL = [
  '/photos/lobby-floor.png',
  '/photos/glass-entrance.png',
  '/photos/corridor.png',
  '/photos/restroom.png',
  '/photos/floor-scrubber.png',
  '/photos/parking.png',
]

const SIZES = [307, 285, 199, 305, 322, 190, 248, 211, 276, 233, 298, 181, 264]

function buildPhotos(count: number): Photo[] {
  return Array.from({ length: count }, (_, i) => ({
    index: i + 1,
    src: POOL[i % POOL.length],
    source: 'WhatsApp',
    takenAt: '2026-09-22, 08 h 46',
    site: 'TD (#4350) - 3720 DES SOURCES (site)',
    sender: 'Gabriel Cordova',
    filename: `whatsapp-17900811${(68768 + i * 213).toString().slice(0, 5)}-0.jpeg`,
    sizeKb: SIZES[i % SIZES.length],
  }))
}

export const INTERVENTION: Intervention = {
  code: 'TD',
  number: '#4350',
  siteName: '3720 DES SOURCES',
  client: 'BEE-CLEAN',
  date: '2026-09-22',
  address: '3720 BOUL DES SOURCES, DOLLARD DES ORMEAUX, Québec, H9B1Z9',
  photosSentBy: 'Gabriel Cordova',
  reportState: 'archived',
  lastChange: {
    action: 'Archivé',
    by: 'etienne@allstarsmaintenance.com',
    at: '22 sept., 21 h 54',
  },
  workOrder: '',
  notes: [],
  report: {
    createdAt: '22 septembre 2026, 15 h 26',
    photoCount: 13,
    url: 'https://proof.allstarsmaintenance.com/r/a4a8bc6dff7125cbc2a6644d34fe1590',
  },
  photos: buildPhotos(13),
}
