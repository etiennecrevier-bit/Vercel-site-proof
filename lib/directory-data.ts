export type EmployeeType = 'employe' | 'sous_traitant'

export type Member = {
  id: string
  name: string
  /** displayed when the recognized WhatsApp profile name differs from the legal name */
  alias?: string
  email: string | null
  phone: string | null
  type: EmployeeType
  buildingsCount: number
  /** a few representative building short-codes, for the hover/summary line */
  buildings: string[]
}

export type LeadRole = 'superviseur' | 'sous_traitant'

export type Team = {
  id: string
  lead: {
    name: string
    role: LeadRole
    /** organisation for subcontractors, zone/shift label for supervisors */
    org: string
  }
  members: Member[]
}

/**
 * Sample directory. Names are Québécois and Hispanic, buildings are real
 * Montréal / Ottawa addresses drawn from the current Répertoire screen.
 * The hierarchy (supervisors and subcontractors with their people) is the
 * level of detail the flat list is missing today.
 */
export const TEAMS: Team[] = [
  {
    id: 'sup-begin',
    lead: { name: 'Antoine Bégin', role: 'superviseur', org: 'Équipe de jour · Montréal centre' },
    members: [
      {
        id: 'e-douha',
        name: 'Douha Bousbia Salah',
        email: null,
        phone: '+1 514 222-6114',
        type: 'employe',
        buildingsCount: 3,
        buildings: ['4080-CSC', '4120-CSC', '4855-PAP'],
      },
      {
        id: 'e-etienne',
        name: 'Étienne Crevier',
        email: null,
        phone: '+1 514 952-6798',
        type: 'employe',
        buildingsCount: 2,
        buildings: ['4080-CSC', '1355-BANKS'],
      },
      {
        id: 'e-cindy',
        name: 'Cindy Tremblay',
        email: null,
        phone: '+1 514 913-7708',
        type: 'employe',
        buildingsCount: 4,
        buildings: ['4855-PAP', '4120-CSC', '2200-MCG', '1801-MCG'],
      },
      {
        id: 'e-marco',
        name: 'Marc-Olivier Gagnon',
        email: 'mo.gagnon@allstarsmaintenance.com',
        phone: '+1 438 334-9051',
        type: 'employe',
        buildingsCount: 2,
        buildings: ['1801-MCG', '2200-MCG'],
      },
    ],
  },
  {
    id: 'st-vittini',
    lead: { name: 'Katherine Vittini', role: 'sous_traitant', org: 'Gestion Vittini inc.' },
    members: [
      {
        id: 'e-edicson',
        name: 'Edicson Vigil',
        email: 'edicson_vigil@hotmail.com',
        phone: '+1 514 773-0451',
        type: 'employe',
        buildingsCount: 1,
        buildings: ['4080-CSC'],
      },
      {
        id: 'e-jorge',
        name: 'Jorge Ramírez',
        email: 'jorgeramirez066@gmail.com',
        phone: '+1 514 835-3468',
        type: 'employe',
        buildingsCount: 3,
        buildings: ['700-DLG', '750-DLG', '800-DLG'],
      },
      {
        id: 'e-luisa',
        name: 'Luisa Fernanda Moreno',
        email: 'lf.moreno@gmail.com',
        phone: '+1 438 771-2290',
        type: 'employe',
        buildingsCount: 2,
        buildings: ['700-DLG', '4855-PAP'],
      },
      {
        id: 'e-diego',
        name: 'Diego Alejandro Castaño',
        email: null,
        phone: '+1 438 555-1042',
        type: 'employe',
        buildingsCount: 0,
        buildings: [],
      },
    ],
  },
  {
    id: 'st-sabourin',
    lead: { name: 'Mario Sabourin', role: 'sous_traitant', org: 'Entretien M.S. enr.' },
    members: [
      {
        id: 'e-jose',
        name: 'José Antonio Guzmán',
        email: 'ja.guzman@gmail.com',
        phone: '+1 514 448-7731',
        type: 'employe',
        buildingsCount: 5,
        buildings: ['1250-RL', '1255-RL', '1801-MCG', '2200-MCG', '4855-PAP'],
      },
      {
        id: 'e-wilson',
        name: 'Wilson Paredes',
        email: null,
        phone: '+1 514 601-3388',
        type: 'employe',
        buildingsCount: 2,
        buildings: ['1250-RL', '1255-RL'],
      },
      {
        id: 'e-franklin',
        name: 'Franklin Estévez',
        email: null,
        phone: '+1 438 209-7745',
        type: 'employe',
        buildingsCount: 1,
        buildings: ['1250-RL'],
      },
    ],
  },
  {
    id: 'sup-bouchard',
    lead: { name: 'Nadia Bouchard', role: 'superviseur', org: 'Équipe de soir · Rive-Sud' },
    members: [
      {
        id: 'e-jean',
        name: 'Jean Benchimy',
        alias: 'Benjamin',
        email: 'benchimyjean026@gmail.com',
        phone: '+1 438 334-3031',
        type: 'employe',
        buildingsCount: 2,
        buildings: ['2200-MCG', '1801-MCG'],
      },
      {
        id: 'e-patrick',
        name: 'Patrick Ouellet',
        email: 'p.ouellet@allstarsmaintenance.com',
        phone: '+1 450 332-9910',
        type: 'employe',
        buildingsCount: 3,
        buildings: ['700-DLG', '750-DLG', '800-DLG'],
      },
      {
        id: 'e-rosa',
        name: 'Rosa María Delgado',
        email: 'rm.delgado@gmail.com',
        phone: '+1 450 778-6620',
        type: 'employe',
        buildingsCount: 1,
        buildings: ['800-DLG'],
      },
    ],
  },
]

/** Employees with no supervisor and no subcontractor — the group that needs triage. */
export const UNASSIGNED: Member[] = [
  {
    id: 'e-antoine-b',
    name: 'Antoine Bélanger',
    email: 'antoine@allstarsmaintenance.com',
    phone: '+1 514 713-4220',
    type: 'employe',
    buildingsCount: 0,
    buildings: [],
  },
  {
    id: 'e-carlos',
    name: 'Carlos Mendoza',
    email: null,
    phone: '+1 514 990-2277',
    type: 'employe',
    buildingsCount: 0,
    buildings: [],
  },
]

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** A member needs attention when the office is missing data the resolver relies on. */
export function memberFlags(m: Member): { noEmail: boolean; noBuilding: boolean } {
  return { noEmail: m.email === null, noBuilding: m.buildingsCount === 0 }
}
