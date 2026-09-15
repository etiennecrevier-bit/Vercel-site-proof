'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'fr' | 'en' | 'es'

type Dict = {
  appName: string
  navCapture: string
  navInbox: string
  navInterventions: string
  navDirectory: string
  logout: string

  title: string
  subtitle: string

  tabClients: string
  tabEmployees: string
  tabBuildings: string
  tabAssignments: string
  tabTeam: string

  searchPlaceholder: string
  viewByTeam: string
  viewAlpha: string
  addEmployee: string
  expandAll: string
  collapseAll: string

  filterAll: string
  filterEmployees: string
  filterSubcontractors: string

  roleSupervisor: string
  roleSubcontractor: string
  typeEmployee: string
  typeSubcontractor: string

  members: (n: number) => string
  buildings: (n: number) => string
  peopleCount: (n: number) => string

  unassignedTitle: string
  unassignedHint: string

  attention: string
  noEmail: string
  noBuilding: string
  recognizedAs: string
  openProfile: string

  emptyTitle: string
  emptyBody: string
  clearSearch: string
  loadingLabel: string
}

const DICTS: Record<Lang, Dict> = {
  fr: {
    appName: 'Site Proof',
    navCapture: 'Capture',
    navInbox: 'Boîte de réception',
    navInterventions: 'Interventions',
    navDirectory: 'Répertoire',
    logout: 'Se déconnecter',

    title: 'Employés',
    subtitle: 'Regroupés par responsable. Les affectations de chacun alimentent le classement automatique des photos.',

    tabClients: 'Clients',
    tabEmployees: 'Employés',
    tabBuildings: 'Bâtiments',
    tabAssignments: 'Affectations',
    tabTeam: 'Équipe',

    searchPlaceholder: 'Rechercher un employé, un responsable, un numéro…',
    viewByTeam: 'Par équipe',
    viewAlpha: 'Alphabétique',
    addEmployee: 'Ajouter un employé',
    expandAll: 'Tout déplier',
    collapseAll: 'Tout replier',

    filterAll: 'Tous',
    filterEmployees: 'Employés',
    filterSubcontractors: 'Sous-traitants',

    roleSupervisor: 'Superviseur',
    roleSubcontractor: 'Sous-traitant',
    typeEmployee: 'Employé',
    typeSubcontractor: 'Sous-traitant',

    members: (n) => (n > 1 ? `${n} personnes` : `${n} personne`),
    buildings: (n) => (n > 1 ? `${n} bâtiments` : `${n} bâtiment`),
    peopleCount: (n) => (n > 1 ? `${n} employés` : `${n} employé`),

    unassignedTitle: 'Non affectés',
    unassignedHint: 'Aucun responsable ni affectation — à rattacher pour activer le classement automatique.',

    attention: 'À compléter',
    noEmail: 'Aucun courriel',
    noBuilding: 'Aucune affectation',
    recognizedAs: 'reconnu comme',
    openProfile: 'Ouvrir la fiche de',

    emptyTitle: 'Aucun résultat',
    emptyBody: 'Aucun employé ne correspond à cette recherche. Vérifiez l’orthographe ou effacez la recherche.',
    clearSearch: 'Effacer la recherche',
    loadingLabel: 'Chargement du répertoire…',
  },
  en: {
    appName: 'Site Proof',
    navCapture: 'Capture',
    navInbox: 'Inbox',
    navInterventions: 'Jobs',
    navDirectory: 'Directory',
    logout: 'Sign out',

    title: 'Employees',
    subtitle: 'Grouped by lead. Each person’s assignments feed the automatic sorting of incoming photos.',

    tabClients: 'Clients',
    tabEmployees: 'Employees',
    tabBuildings: 'Buildings',
    tabAssignments: 'Assignments',
    tabTeam: 'Team',

    searchPlaceholder: 'Search an employee, a lead, a number…',
    viewByTeam: 'By team',
    viewAlpha: 'Alphabetical',
    addEmployee: 'Add employee',
    expandAll: 'Expand all',
    collapseAll: 'Collapse all',

    filterAll: 'All',
    filterEmployees: 'Employees',
    filterSubcontractors: 'Subcontractors',

    roleSupervisor: 'Supervisor',
    roleSubcontractor: 'Subcontractor',
    typeEmployee: 'Employee',
    typeSubcontractor: 'Subcontractor',

    members: (n) => (n > 1 ? `${n} people` : `${n} person`),
    buildings: (n) => (n > 1 ? `${n} buildings` : `${n} building`),
    peopleCount: (n) => (n > 1 ? `${n} employees` : `${n} employee`),

    unassignedTitle: 'Unassigned',
    unassignedHint: 'No lead and no assignment — link them to enable automatic sorting.',

    attention: 'Needs info',
    noEmail: 'No email',
    noBuilding: 'No assignment',
    recognizedAs: 'recognized as',
    openProfile: 'Open profile of',

    emptyTitle: 'No results',
    emptyBody: 'No employee matches this search. Check the spelling or clear the search.',
    clearSearch: 'Clear search',
    loadingLabel: 'Loading directory…',
  },
  es: {
    appName: 'Site Proof',
    navCapture: 'Captura',
    navInbox: 'Bandeja de entrada',
    navInterventions: 'Intervenciones',
    navDirectory: 'Directorio',
    logout: 'Cerrar sesión',

    title: 'Empleados',
    subtitle: 'Agrupados por responsable. Las asignaciones de cada persona alimentan la clasificación automática de las fotografías.',

    tabClients: 'Clientes',
    tabEmployees: 'Empleados',
    tabBuildings: 'Edificios',
    tabAssignments: 'Asignaciones',
    tabTeam: 'Equipo',

    searchPlaceholder: 'Buscar un empleado, un responsable, un número…',
    viewByTeam: 'Por equipo',
    viewAlpha: 'Alfabético',
    addEmployee: 'Agregar un empleado',
    expandAll: 'Desplegar todo',
    collapseAll: 'Contraer todo',

    filterAll: 'Todos',
    filterEmployees: 'Empleados',
    filterSubcontractors: 'Subcontratistas',

    roleSupervisor: 'Supervisor',
    roleSubcontractor: 'Subcontratista',
    typeEmployee: 'Empleado',
    typeSubcontractor: 'Subcontratista',

    members: (n) => (n > 1 ? `${n} personas` : `${n} persona`),
    buildings: (n) => (n > 1 ? `${n} edificios` : `${n} edificio`),
    peopleCount: (n) => (n > 1 ? `${n} empleados` : `${n} empleado`),

    unassignedTitle: 'Sin asignar',
    unassignedHint: 'Sin responsable ni asignación — vincúlelos para activar la clasificación automática.',

    attention: 'Falta información',
    noEmail: 'Sin correo',
    noBuilding: 'Sin asignación',
    recognizedAs: 'reconocido como',
    openProfile: 'Abrir la ficha de',

    emptyTitle: 'Sin resultados',
    emptyBody: 'Ningún empleado coincide con esta búsqueda. Verifique la ortografía o borre la búsqueda.',
    clearSearch: 'Borrar la búsqueda',
    loadingLabel: 'Cargando el directorio…',
  },
}

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: 'fr',
  setLang: () => {},
  t: DICTS.fr,
})

export function DirectoryLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr')
  return <LangContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>{children}</LangContext.Provider>
}

export function useDir() {
  return useContext(LangContext)
}

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
]
