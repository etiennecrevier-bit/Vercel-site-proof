export type Building = {
  id: string
  /** street address, shown as the primary label */
  name: string
  city: string
  /** short code fed to the auto-classifier; null when the office hasn't set one */
  shortCode: string | null
  /** free-form spellings employees actually type in WhatsApp */
  aliases: string[]
  active: boolean
  /** how many employees are currently assigned to this building */
  employeesCount: number
}

export type Client = {
  id: string
  name: string
  buildings: Building[]
}

/**
 * Sample building directory grouped by client. Addresses and short codes are
 * drawn from the current Répertoire screen and the employees data, so the two
 * pages stay consistent. A few buildings are intentionally missing a short
 * code or set inactive to exercise those states.
 */
export const CLIENTS: Client[] = [
  {
    id: 'c-cogir',
    name: 'Cogir Immobilier',
    buildings: [
      {
        id: 'b-4080',
        name: '4080 Côte-Sainte-Catherine',
        city: 'Montréal',
        shortCode: '4080-CSC',
        aliases: ['4080 CSC', 'Cote Ste-Cath'],
        active: true,
        employeesCount: 3,
      },
      {
        id: 'b-4120',
        name: '4120 Chemin de la Côte-Sainte-Catherine',
        city: 'Montréal',
        shortCode: '4120-CSC',
        aliases: ['4120'],
        active: true,
        employeesCount: 2,
      },
    ],
  },
  {
    id: 'c-ivanhoe',
    name: 'Ivanhoé Cambridge',
    buildings: [
      {
        id: 'b-2200',
        name: '2200 McGill College',
        city: 'Montréal',
        shortCode: '2200-MCG',
        aliases: ['2200 McGill', 'Tour McGill'],
        active: true,
        employeesCount: 4,
      },
      {
        id: 'b-1801',
        name: '1801 McGill College',
        city: 'Montréal',
        shortCode: '1801-MCG',
        aliases: [],
        active: true,
        employeesCount: 3,
      },
    ],
  },
  {
    id: 'c-cominar',
    name: 'Cominar',
    buildings: [
      {
        id: 'b-4855',
        name: '4855 Avenue Papineau',
        city: 'Montréal',
        shortCode: '4855-PAP',
        aliases: ['Papineau', '4855'],
        active: true,
        employeesCount: 3,
      },
    ],
  },
  {
    id: 'c-petra',
    name: 'Groupe Petra',
    buildings: [
      {
        id: 'b-700',
        name: '700 De La Gauchetière Ouest',
        city: 'Montréal',
        shortCode: '700-DLG',
        aliases: ['700 Gauchetiere', 'DLG 700'],
        active: true,
        employeesCount: 2,
      },
      {
        id: 'b-750',
        name: '750 De La Gauchetière Ouest',
        city: 'Montréal',
        shortCode: '750-DLG',
        aliases: [],
        active: true,
        employeesCount: 1,
      },
      {
        id: 'b-800',
        name: '800 De La Gauchetière Ouest',
        city: 'Montréal',
        // volontairement sans code court : bloque le classement automatique
        shortCode: null,
        aliases: ['800 Gauchetiere'],
        active: true,
        employeesCount: 2,
      },
    ],
  },
  {
    id: 'c-rachel-julien',
    name: 'Rachel-Julien',
    buildings: [
      {
        id: 'b-1250',
        name: '1250 Rue Rachel Est',
        city: 'Montréal',
        shortCode: '1250-RL',
        aliases: ['Rachel 1250'],
        active: true,
        employeesCount: 3,
      },
      {
        id: 'b-1255',
        name: '1255 Rue Rachel Est',
        city: 'Montréal',
        shortCode: '1255-RL',
        aliases: [],
        active: true,
        employeesCount: 1,
      },
    ],
  },
  {
    id: 'c-morguard',
    name: 'Morguard',
    buildings: [
      {
        id: 'b-1355',
        name: '1355 Banks Street',
        city: 'Ottawa',
        // sans code court
        shortCode: null,
        aliases: ['1355BankSt'],
        active: true,
        employeesCount: 1,
      },
      {
        id: 'b-320',
        name: '320 Queen Street',
        city: 'Ottawa',
        shortCode: '320-QUEEN',
        aliases: [],
        // ancien contrat, conservé pour l'historique
        active: false,
        employeesCount: 0,
      },
    ],
  },
]

export function clientNeedsCode(c: Client): number {
  return c.buildings.filter((b) => b.shortCode === null).length
}
