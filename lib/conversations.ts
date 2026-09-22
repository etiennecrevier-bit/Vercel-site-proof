export type Direction = 'in' | 'out'

/** nature du message — pilote l'affichage et l'icône */
export type MessageKind =
  | 'photos' // envoi de photos par l'employé (entrant)
  | 'text' // texte libre de l'employé (entrant)
  | 'confirmation' // accusé de réception automatique (sortant)
  | 'report' // rapport prêt / preuve de présence (sortant, auto)
  | 'thanks' // remerciement rédigé par un superviseur (sortant, manuel)

/** état de livraison, calqué sur la passerelle WhatsApp */
export type DeliveryStatus = 'sent' | 'delivered' | 'read' | 'received'

export type Message = {
  id: string
  direction: Direction
  kind: MessageKind
  /** ISO 8601 — sert au tri, aux séparateurs de date et à l'affichage de l'heure */
  at: string
  text: string
  channel: 'whatsapp'
  /** présent pour les messages sortants (automatiques ou manuels) */
  status?: DeliveryStatus
  /** vrai quand le message a été généré par la plateforme, non par un humain */
  automated?: boolean
  photoCount?: number
  thumbnails?: string[]
  /** référence du bon de travail rattaché, si connue */
  site?: string
}

export type Conversation = {
  id: string
  /** null quand le numéro n'est pas au répertoire */
  employeeName: string | null
  waHandle: string
  /** langue de correspondance de l'employé */
  lang: 'fr' | 'es'
  /** dernier site rapporté — sert d'accroche sous le nom */
  lastSite?: string
  /** messages triés du plus ancien au plus récent */
  messages: Message[]
}

const P = {
  lobby: '/photos/lobby-floor.png',
  glass: '/photos/glass-entrance.png',
  scrubber: '/photos/floor-scrubber.png',
  restroom: '/photos/restroom.png',
  corridor: '/photos/corridor.png',
  parking: '/photos/parking.png',
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'c-gabriel',
    employeeName: 'Gabriel Cordova',
    waHandle: '+1 514 924 1777',
    lang: 'fr',
    lastSite: 'TD (#4350) — 3720 des Sources',
    messages: [
      {
        id: 'm-g1',
        direction: 'in',
        kind: 'text',
        at: '2026-09-22T08:44:00',
        channel: 'whatsapp',
        text: 'Bonjour, je commence le nettoyage au 3720 des Sources.',
      },
      {
        id: 'm-g2',
        direction: 'in',
        kind: 'photos',
        at: '2026-09-22T08:46:00',
        channel: 'whatsapp',
        text: '[TD (#4350) — 3720 DES SOURCES]',
        site: 'TD (#4350) — 3720 des Sources',
        photoCount: 13,
        thumbnails: [P.lobby, P.glass, P.corridor, P.restroom],
      },
      {
        id: 'm-g3',
        direction: 'out',
        kind: 'report',
        at: '2026-09-22T08:46:30',
        channel: 'whatsapp',
        status: 'read',
        automated: true,
        text: '1 capture ClearSite reçue comme preuve de présence.',
      },
      {
        id: 'm-g4',
        direction: 'out',
        kind: 'confirmation',
        at: '2026-09-22T08:47:00',
        channel: 'whatsapp',
        status: 'delivered',
        automated: true,
        text: '13 photos reçues.',
      },
    ],
  },
  {
    id: 'c-cesar',
    employeeName: 'Cesar Sanchez Hernandez',
    waHandle: '+1 514 883 3846',
    lang: 'es',
    lastSite: 'TD (#4384) — Boul. St-Charles',
    messages: [
      {
        id: 'm-c1',
        direction: 'in',
        kind: 'text',
        at: '2026-09-21T22:04:00',
        channel: 'whatsapp',
        text: 'Empecé la limpieza en TD (#4384) - Boul. St-Charles.',
      },
      {
        id: 'm-c2',
        direction: 'in',
        kind: 'photos',
        at: '2026-09-21T22:06:00',
        channel: 'whatsapp',
        text: '[TD (#4384) — Boul. St-Charles]',
        site: 'TD (#4384) — Boul. St-Charles',
        photoCount: 5,
        thumbnails: [P.glass, P.lobby, P.corridor],
      },
      {
        id: 'm-c3',
        direction: 'out',
        kind: 'report',
        at: '2026-09-21T22:07:00',
        channel: 'whatsapp',
        status: 'read',
        automated: true,
        text: '1 captura ClearSite recibida como prueba de presencia.',
      },
      {
        id: 'm-c4',
        direction: 'out',
        kind: 'confirmation',
        at: '2026-09-21T22:08:00',
        channel: 'whatsapp',
        status: 'read',
        automated: true,
        text: '5 fotos recibidas para TD (#4384) - Boul. St-Charles.',
      },
      {
        id: 'm-c5',
        direction: 'in',
        kind: 'photos',
        at: '2026-09-21T23:08:00',
        channel: 'whatsapp',
        text: '[TD (#4384) — Boul. St-Charles] Segundo piso terminado.',
        site: 'TD (#4384) — Boul. St-Charles',
        photoCount: 3,
        thumbnails: [P.scrubber, P.parking],
      },
      {
        id: 'm-c6',
        direction: 'out',
        kind: 'confirmation',
        at: '2026-09-21T23:10:00',
        channel: 'whatsapp',
        status: 'delivered',
        automated: true,
        text: '3 fotos recibidas para TD (#4384) - Boul. St-Charles.',
      },
      {
        id: 'm-c7',
        direction: 'out',
        kind: 'thanks',
        at: '2026-09-21T23:15:00',
        channel: 'whatsapp',
        status: 'read',
        text: 'Gracias por tu trabajo de hoy, se aprecia.',
      },
    ],
  },
  {
    id: 'c-miguel',
    employeeName: 'Miguel Olivares',
    waHandle: '+1 438 555 0188',
    lang: 'es',
    lastSite: 'TD (#4362) — Place Longueuil',
    messages: [
      {
        id: 'm-m1',
        direction: 'in',
        kind: 'photos',
        at: '2026-09-21T21:56:00',
        channel: 'whatsapp',
        text: '[TD (#4362) — Place Longueuil] Estacionamiento nivel 1.',
        site: 'TD (#4362) — Place Longueuil',
        photoCount: 41,
        thumbnails: [P.parking, P.scrubber, P.corridor, P.lobby],
      },
      {
        id: 'm-m2',
        direction: 'out',
        kind: 'confirmation',
        at: '2026-09-21T21:57:00',
        channel: 'whatsapp',
        status: 'read',
        automated: true,
        text: '41 fotos recibidas.',
      },
      {
        id: 'm-m3',
        direction: 'in',
        kind: 'photos',
        at: '2026-09-22T00:05:00',
        channel: 'whatsapp',
        text: '[TD (#4362) — Place Longueuil] Terminado.',
        site: 'TD (#4362) — Place Longueuil',
        photoCount: 27,
        thumbnails: [P.restroom, P.corridor, P.glass],
      },
      {
        id: 'm-m4',
        direction: 'out',
        kind: 'confirmation',
        at: '2026-09-22T00:07:00',
        channel: 'whatsapp',
        status: 'delivered',
        automated: true,
        text: '27 fotos recibidas.',
      },
      {
        id: 'm-m5',
        direction: 'out',
        kind: 'thanks',
        at: '2026-09-22T00:10:00',
        channel: 'whatsapp',
        status: 'delivered',
        text: 'Bien hecho, el trabajo está bien realizado y bien documentado.',
      },
    ],
  },
  {
    id: 'c-karen',
    employeeName: 'Karen Jordan',
    waHandle: '+1 514 555 0111',
    lang: 'fr',
    lastSite: 'TD (#4390) — Carré Angrignon',
    messages: [
      {
        id: 'm-k1',
        direction: 'in',
        kind: 'photos',
        at: '2026-09-21T21:40:00',
        channel: 'whatsapp',
        text: '[TD (#4390) — Carré Angrignon] Hall principal fait.',
        site: 'TD (#4390) — Carré Angrignon',
        photoCount: 9,
        thumbnails: [P.lobby, P.glass, P.corridor],
      },
      {
        id: 'm-k2',
        direction: 'out',
        kind: 'confirmation',
        at: '2026-09-21T21:41:00',
        channel: 'whatsapp',
        status: 'read',
        automated: true,
        text: '9 photos reçues.',
      },
      {
        id: 'm-k3',
        direction: 'out',
        kind: 'thanks',
        at: '2026-09-21T22:19:00',
        channel: 'whatsapp',
        status: 'read',
        text: "Merci pour ton travail aujourd'hui, c'est apprécié.",
      },
    ],
  },
  {
    id: 'c-unknown',
    employeeName: null,
    waHandle: '+1 514 777 9194',
    lang: 'fr',
    lastSite: undefined,
    messages: [
      {
        id: 'm-u1',
        direction: 'in',
        kind: 'photos',
        at: '2026-09-21T21:28:00',
        channel: 'whatsapp',
        text: 'Photos du site de ce soir.',
        photoCount: 6,
        thumbnails: [P.corridor, P.restroom],
      },
      {
        id: 'm-u2',
        direction: 'out',
        kind: 'confirmation',
        at: '2026-09-21T21:29:00',
        channel: 'whatsapp',
        status: 'delivered',
        automated: true,
        text: '6 photos reçues.',
      },
    ],
  },
]
