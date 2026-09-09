export type SubmissionState = 'high' | 'low' | 'unrecognized' | 'confirmed' | 'corrected'

export type Submission = {
  id: string
  /** null quand le système ne reconnaît pas l'employé */
  employeeName: string | null
  /** identifiant WhatsApp de repli, toujours présent */
  waHandle: string
  city: string
  /** heure de réception, format 24h */
  time: string
  photoCount: number
  thumbnails: string[]
  /** bâtiment deviné par le système (peut rester affiché après correction) */
  guessedBuilding: string
  /** 0–100, confiance de la détection */
  confidence: number
  state: SubmissionState
  /** bâtiment retenu après correction manuelle */
  correctedBuilding?: string
}

/** Parc de bâtiments — sert de liste de correction. Aucune donnée nouvelle. */
export const BUILDINGS: string[] = [
  'Tour de la Bourse — 800, place Victoria, Montréal',
  'Complexe Desjardins — 150, rue Sainte-Catherine O., Montréal',
  'Édifice Sun Life — 1155, rue Metcalfe, Montréal',
  'Place Ville Marie — 1, place Ville Marie, Montréal',
  'Cité du Multimédia — 87, rue Prince, Montréal',
  'Marché Central — 1150, rue du Marché-Central, Montréal',
  'Place Bonaventure — 800, rue De La Gauchetière O., Montréal',
  'Technoparc — 7150, rue Alexander-Fleming, Saint-Laurent',
  'Gare Windsor — 1100, av. des Canadiens-de-Montréal, Montréal',
]

const P = {
  lobby: '/photos/lobby-floor.png',
  glass: '/photos/glass-entrance.png',
  scrubber: '/photos/floor-scrubber.png',
  restroom: '/photos/restroom.png',
  corridor: '/photos/corridor.png',
  parking: '/photos/parking.png',
}

function strip(...set: string[]) {
  return set
}

export const SUBMISSIONS: Submission[] = [
  {
    id: 'WA-4471',
    employeeName: 'Jean-François Tremblay',
    waHandle: '+1 514 555 0148',
    city: 'Montréal',
    time: '06:42',
    photoCount: 12,
    thumbnails: strip(P.lobby, P.glass, P.corridor, P.restroom),
    guessedBuilding: 'Tour de la Bourse — 800, place Victoria, Montréal',
    confidence: 96,
    state: 'high',
  },
  {
    id: 'WA-4472',
    employeeName: 'María Fernanda Rojas',
    waHandle: '+1 438 555 0102',
    city: 'Montréal',
    time: '07:15',
    photoCount: 8,
    thumbnails: strip(P.restroom, P.corridor, P.glass),
    guessedBuilding: 'Complexe Desjardins — 150, rue Sainte-Catherine O., Montréal',
    confidence: 94,
    state: 'high',
  },
  {
    id: 'WA-4473',
    employeeName: 'José Martínez',
    waHandle: '+1 514 555 0177',
    city: 'Montréal',
    time: '07:58',
    photoCount: 24,
    thumbnails: strip(P.scrubber, P.parking, P.corridor, P.lobby),
    guessedBuilding: 'Place Ville Marie — 1, place Ville Marie, Montréal',
    confidence: 58,
    state: 'low',
  },
  {
    id: 'WA-4474',
    employeeName: null,
    waHandle: '+1 873 555 0219',
    city: 'Québec',
    time: '08:10',
    photoCount: 3,
    thumbnails: strip(P.glass, P.lobby),
    guessedBuilding: 'Cité du Multimédia — 87, rue Prince, Montréal',
    confidence: 41,
    state: 'unrecognized',
  },
  {
    id: 'WA-4475',
    employeeName: 'Guillaume Bédard',
    waHandle: '+1 514 555 0163',
    city: 'Montréal',
    time: '08:33',
    photoCount: 41,
    thumbnails: strip(P.parking, P.scrubber, P.corridor, P.lobby),
    guessedBuilding: 'Marché Central — 1150, rue du Marché-Central, Montréal',
    confidence: 91,
    state: 'high',
  },
  {
    id: 'WA-4476',
    employeeName: 'Sophie Lévesque',
    waHandle: '+1 450 555 0134',
    city: 'Montréal',
    time: '09:05',
    photoCount: 6,
    thumbnails: strip(P.restroom, P.glass, P.corridor),
    guessedBuilding: 'Édifice Sun Life — 1155, rue Metcalfe, Montréal',
    confidence: 97,
    state: 'high',
  },
  {
    id: 'WA-4477',
    employeeName: 'Luis Hernández',
    waHandle: '+1 514 555 0195',
    city: 'Montréal',
    time: '09:41',
    photoCount: 60,
    thumbnails: strip(P.scrubber, P.parking, P.corridor, P.lobby),
    guessedBuilding: 'Technoparc — 7150, rue Alexander-Fleming, Saint-Laurent',
    confidence: 47,
    state: 'low',
  },
  {
    id: 'WA-4478',
    employeeName: 'Marie-Claude Gagné',
    waHandle: '+1 514 555 0111',
    city: 'Montréal',
    time: '10:12',
    photoCount: 15,
    thumbnails: strip(P.lobby, P.corridor, P.glass, P.restroom),
    guessedBuilding: 'Place Bonaventure — 800, rue De La Gauchetière O., Montréal',
    confidence: 93,
    state: 'confirmed',
  },
  {
    id: 'WA-4479',
    employeeName: 'Carlos Mendoza',
    waHandle: '+1 438 555 0188',
    city: 'Montréal',
    time: '10:48',
    photoCount: 9,
    thumbnails: strip(P.glass, P.lobby, P.corridor),
    guessedBuilding: 'Place Ville Marie — 1, place Ville Marie, Montréal',
    confidence: 62,
    state: 'corrected',
    correctedBuilding: 'Gare Windsor — 1100, av. des Canadiens-de-Montréal, Montréal',
  },
]
