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

  buildingsPageTitle: string
  buildingsPageSubtitle: string
  bSearchPlaceholder: string
  addBuilding: string
  shortCode: string
  shortCodePlaceholder: string
  aliasLabel: string
  addAlias: string
  active: string
  inactive: string
  save: string
  saved: string
  assignedCount: (n: number) => string
  missingCode: string
  toCodeCount: (n: number) => string
  filterActive: string
  filterInactive: string
  filterMissingCode: string
  bEmptyBody: string

  navHealth: string
  healthTitle: string
  healthSubtitle: string
  healthReadOnly: string
  healthAdminOnly: string
  healthAsOf: string
  healthAllGood: string
  healthNeedAction: (n: number) => string
  healthOldest: string
  healthAndMore: (n: number) => string
  healthClearGroup: string
  healthWindowNote: string
  hOpenNoReport: string
  hInboxPhotos: string
  hErrors7d: string
  hStuck: string
  hReportsNotSent: string
  hEmailsFailed: string
  ago: (min: number) => string

  navHealthNav: string
  ivTitle: string
  ivSubtitle: string
  ivTabList: string
  ivTabReports: string
  ivTabByDate: string
  ivMerge: string
  ivNewCapture: string
  ivSearchList: string
  ivSearchReports: string
  ivAllClients: string
  ivAllTypes: string
  ivWithPhotosOnly: string
  ivShownCount: (shown: number, total: number) => string
  ivLastVisit: string
  ivPhotos: (n: number) => string
  ivReports: (n: number) => string
  ivToSendChip: (n: number) => string
  ivAllCaughtUp: string
  ivFilterToSend: string
  ivFilterAll: string
  ivToSendInline: (n: number) => string
  ivStatusToSend: string
  ivStatusSent: string
  ivSentVia: (channel: 'email' | 'link') => string
  ivSendNow: string
  ivResend: string
  ivRegenerate: string
  ivIntervention: string
  ivSharedReport: string
  ivReportsN: (n: number) => string
  ivDay: string
  ivWeek: string
  ivPrev: string
  ivToday: string
  ivNext: string
  ivRangeSummary: (r: number, p: number) => string
  ivEmptyDay: string
  ivDelete: string
  ivNoResults: string
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

    buildingsPageTitle: 'Bâtiments',
    buildingsPageSubtitle:
      'Regroupés par client. Le code court et les alias de chaque bâtiment permettent au système de reconnaître le site à partir du message de l’employé.',
    bSearchPlaceholder: 'Rechercher une adresse, un code, un alias…',
    addBuilding: 'Ajouter un bâtiment',
    shortCode: 'Code court',
    shortCodePlaceholder: 'ex. 4080-CSC',
    aliasLabel: 'Alias',
    addAlias: 'Ajouter un alias',
    active: 'Actif',
    inactive: 'Inactif',
    save: 'Enregistrer',
    saved: 'Enregistré',
    assignedCount: (n) => (n > 1 ? `${n} employés affectés` : n === 1 ? '1 employé affecté' : 'Aucun employé affecté'),
    missingCode: 'Aucun code court',
    toCodeCount: (n) => `${n} à coder`,
    filterActive: 'Actifs',
    filterInactive: 'Inactifs',
    filterMissingCode: 'Sans code court',
    bEmptyBody: 'Aucun bâtiment ne correspond à cette recherche. Vérifiez l’orthographe ou effacez la recherche.',

    navHealth: 'Santé',
    healthTitle: 'Santé du système',
    healthSubtitle:
      'Ce qui empêche une photo de devenir un rapport client. Lecture seule — chaque anomalie mène directement à l’élément à corriger.',
    healthReadOnly: 'Lecture seule',
    healthAdminOnly: 'Admin',
    healthAsOf: 'Relevé à l’instant',
    healthAllGood: 'Tout est à jour',
    healthNeedAction: (n) => (n > 1 ? `${n} indicateurs demandent une action` : `${n} indicateur demande une action`),
    healthOldest: 'Les plus anciens d’abord',
    healthAndMore: (n) => `+ ${n} autres à traiter`,
    healthClearGroup: 'Rien à signaler',
    healthWindowNote: 'Total estimé sur les 200 interventions ouvertes les plus anciennes.',
    hOpenNoReport: 'Interventions avec photos, sans rapport',
    hInboxPhotos: 'Messages avec photos, non classés',
    hErrors7d: 'Messages en erreur (7 derniers jours)',
    hStuck: 'Messages bloqués en traitement',
    hReportsNotSent: 'Rapports prêts, jamais transmis',
    hEmailsFailed: 'Courriels entrants en échec',
    ago: (m) => (m < 60 ? `il y a ${m} min` : m < 1440 ? `il y a ${Math.round(m / 60)} h` : `il y a ${Math.round(m / 1440)} j`),

    navHealthNav: 'Santé',
    ivTitle: 'Journal des interventions',
    ivSubtitle: 'Chaque visite, ses preuves photo et les rapports envoyés au client.',
    ivTabList: 'Liste des interventions',
    ivTabReports: 'Rapports',
    ivTabByDate: 'Par date',
    ivMerge: 'Fusionner',
    ivNewCapture: 'Nouvelle capture',
    ivSearchList: 'Rechercher un immeuble, un code, un client ou un bon de travail',
    ivSearchReports: 'Chercher un client, un site ou une date',
    ivAllClients: 'Tous les clients',
    ivAllTypes: 'Tout',
    ivWithPhotosOnly: 'Avec photos seulement',
    ivShownCount: (s, t) => `${s} immeubles sur ${t}`,
    ivLastVisit: 'Dernière visite',
    ivPhotos: (n) => (n > 1 ? `${n} photos` : `${n} photo`),
    ivReports: (n) => (n > 1 ? `${n} rapports` : `${n} rapport`),
    ivToSendChip: (n) => (n > 1 ? `${n} rapports à envoyer` : `${n} rapport à envoyer`),
    ivAllCaughtUp: 'Tous les rapports sont envoyés',
    ivFilterToSend: 'À envoyer',
    ivFilterAll: 'Tous',
    ivToSendInline: (n) => (n > 1 ? `${n} à envoyer` : `${n} à envoyer`),
    ivStatusToSend: 'À envoyer',
    ivStatusSent: 'Envoyé',
    ivSentVia: (c) => (c === 'email' ? 'Envoyé par courriel' : 'Envoyé par lien'),
    ivSendNow: 'Envoyer au client',
    ivResend: 'Renvoyer',
    ivRegenerate: 'Régénérer',
    ivIntervention: 'Intervention',
    ivSharedReport: 'Rapport partagé',
    ivReportsN: (n) => (n > 1 ? `${n} rapports` : `${n} rapport`),
    ivDay: 'Jour',
    ivWeek: 'Semaine',
    ivPrev: 'Précédent',
    ivToday: "Aujourd'hui",
    ivNext: 'Suivant',
    ivRangeSummary: (r, p) => `${r} rapports · ${p} photos`,
    ivEmptyDay: 'Aucun rapport ce jour-là.',
    ivDelete: 'Supprimer la visite',
    ivNoResults: 'Aucune intervention ne correspond à cette recherche.',
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

    buildingsPageTitle: 'Buildings',
    buildingsPageSubtitle:
      'Grouped by client. Each building’s short code and aliases let the system recognize the site from the employee’s message.',
    bSearchPlaceholder: 'Search an address, a code, an alias…',
    addBuilding: 'Add building',
    shortCode: 'Short code',
    shortCodePlaceholder: 'e.g. 4080-CSC',
    aliasLabel: 'Aliases',
    addAlias: 'Add alias',
    active: 'Active',
    inactive: 'Inactive',
    save: 'Save',
    saved: 'Saved',
    assignedCount: (n) => (n > 1 ? `${n} employees assigned` : n === 1 ? '1 employee assigned' : 'No employee assigned'),
    missingCode: 'No short code',
    toCodeCount: (n) => `${n} to code`,
    filterActive: 'Active',
    filterInactive: 'Inactive',
    filterMissingCode: 'No short code',
    bEmptyBody: 'No building matches this search. Check the spelling or clear the search.',

    navHealth: 'Health',
    healthTitle: 'System health',
    healthSubtitle:
      'What is stopping a photo from becoming a client report. Read-only — each anomaly links straight to the item to fix.',
    healthReadOnly: 'Read-only',
    healthAdminOnly: 'Admin',
    healthAsOf: 'As of just now',
    healthAllGood: 'Everything is up to date',
    healthNeedAction: (n) => (n > 1 ? `${n} indicators need action` : `${n} indicator needs action`),
    healthOldest: 'Oldest first',
    healthAndMore: (n) => `+ ${n} more to handle`,
    healthClearGroup: 'Nothing to report',
    healthWindowNote: 'Total estimated over the 200 oldest open jobs.',
    hOpenNoReport: 'Jobs with photos, no report',
    hInboxPhotos: 'Messages with photos, unfiled',
    hErrors7d: 'Messages in error (last 7 days)',
    hStuck: 'Messages stuck processing',
    hReportsNotSent: 'Reports ready, never sent',
    hEmailsFailed: 'Inbound emails failed',
    ago: (m) => (m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`),

    navHealthNav: 'Health',
    ivTitle: 'Job log',
    ivSubtitle: 'Every visit, its photo proof and the reports sent to the client.',
    ivTabList: 'Job list',
    ivTabReports: 'Reports',
    ivTabByDate: 'By date',
    ivMerge: 'Merge',
    ivNewCapture: 'New capture',
    ivSearchList: 'Search a building, a code, a client or a work order',
    ivSearchReports: 'Search a client, a site or a date',
    ivAllClients: 'All clients',
    ivAllTypes: 'All',
    ivWithPhotosOnly: 'With photos only',
    ivShownCount: (s, t) => `${s} of ${t} buildings`,
    ivLastVisit: 'Last visit',
    ivPhotos: (n) => (n > 1 ? `${n} photos` : `${n} photo`),
    ivReports: (n) => (n > 1 ? `${n} reports` : `${n} report`),
    ivToSendChip: (n) => (n > 1 ? `${n} reports to send` : `${n} report to send`),
    ivAllCaughtUp: 'All reports have been sent',
    ivFilterToSend: 'To send',
    ivFilterAll: 'All',
    ivToSendInline: (n) => `${n} to send`,
    ivStatusToSend: 'To send',
    ivStatusSent: 'Sent',
    ivSentVia: (c) => (c === 'email' ? 'Sent by email' : 'Sent by link'),
    ivSendNow: 'Send to client',
    ivResend: 'Resend',
    ivRegenerate: 'Regenerate',
    ivIntervention: 'Job',
    ivSharedReport: 'Shared report',
    ivReportsN: (n) => (n > 1 ? `${n} reports` : `${n} report`),
    ivDay: 'Day',
    ivWeek: 'Week',
    ivPrev: 'Previous',
    ivToday: 'Today',
    ivNext: 'Next',
    ivRangeSummary: (r, p) => `${r} reports · ${p} photos`,
    ivEmptyDay: 'No report on that day.',
    ivDelete: 'Delete visit',
    ivNoResults: 'No job matches this search.',
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

    buildingsPageTitle: 'Edificios',
    buildingsPageSubtitle:
      'Agrupados por cliente. El código corto y los alias de cada edificio permiten que el sistema reconozca el sitio a partir del mensaje del empleado.',
    bSearchPlaceholder: 'Buscar una dirección, un código, un alias…',
    addBuilding: 'Agregar un edificio',
    shortCode: 'Código corto',
    shortCodePlaceholder: 'ej. 4080-CSC',
    aliasLabel: 'Alias',
    addAlias: 'Agregar un alias',
    active: 'Activo',
    inactive: 'Inactivo',
    save: 'Guardar',
    saved: 'Guardado',
    assignedCount: (n) => (n > 1 ? `${n} empleados asignados` : n === 1 ? '1 empleado asignado' : 'Ningún empleado asignado'),
    missingCode: 'Sin código corto',
    toCodeCount: (n) => `${n} por codificar`,
    filterActive: 'Activos',
    filterInactive: 'Inactivos',
    filterMissingCode: 'Sin código corto',
    bEmptyBody: 'Ningún edificio coincide con esta búsqueda. Verifique la ortografía o borre la búsqueda.',

    navHealth: 'Estado',
    healthTitle: 'Estado del sistema',
    healthSubtitle:
      'Lo que impide que una foto se convierta en un informe para el cliente. Solo lectura — cada anomalía enlaza directamente con el elemento que hay que corregir.',
    healthReadOnly: 'Solo lectura',
    healthAdminOnly: 'Administrador',
    healthAsOf: 'Consultado ahora mismo',
    healthAllGood: 'Todo está al día',
    healthNeedAction: (n) => (n > 1 ? `${n} indicadores requieren acción` : `${n} indicador requiere acción`),
    healthOldest: 'Los más antiguos primero',
    healthAndMore: (n) => `+ ${n} más por tratar`,
    healthClearGroup: 'Nada que señalar',
    healthWindowNote: 'Total estimado sobre las 200 intervenciones abiertas más antiguas.',
    hOpenNoReport: 'Intervenciones con fotos, sin informe',
    hInboxPhotos: 'Mensajes con fotos, sin clasificar',
    hErrors7d: 'Mensajes con error (últimos 7 días)',
    hStuck: 'Mensajes bloqueados en procesamiento',
    hReportsNotSent: 'Informes listos, nunca enviados',
    hEmailsFailed: 'Correos entrantes fallidos',
    ago: (m) => (m < 60 ? `hace ${m} min` : m < 1440 ? `hace ${Math.round(m / 60)} h` : `hace ${Math.round(m / 1440)} d`),

    navHealthNav: 'Estado',
    ivTitle: 'Registro de intervenciones',
    ivSubtitle: 'Cada visita, sus pruebas fotográficas y los informes enviados al cliente.',
    ivTabList: 'Lista de intervenciones',
    ivTabReports: 'Informes',
    ivTabByDate: 'Por fecha',
    ivMerge: 'Combinar',
    ivNewCapture: 'Nueva captura',
    ivSearchList: 'Buscar un edificio, un código, un cliente o una orden de trabajo',
    ivSearchReports: 'Buscar un cliente, un sitio o una fecha',
    ivAllClients: 'Todos los clientes',
    ivAllTypes: 'Todo',
    ivWithPhotosOnly: 'Solo con fotos',
    ivShownCount: (s, t) => `${s} de ${t} edificios`,
    ivLastVisit: 'Última visita',
    ivPhotos: (n) => (n > 1 ? `${n} fotos` : `${n} foto`),
    ivReports: (n) => (n > 1 ? `${n} informes` : `${n} informe`),
    ivToSendChip: (n) => (n > 1 ? `${n} informes por enviar` : `${n} informe por enviar`),
    ivAllCaughtUp: 'Todos los informes fueron enviados',
    ivFilterToSend: 'Por enviar',
    ivFilterAll: 'Todos',
    ivToSendInline: (n) => `${n} por enviar`,
    ivStatusToSend: 'Por enviar',
    ivStatusSent: 'Enviado',
    ivSentVia: (c) => (c === 'email' ? 'Enviado por correo' : 'Enviado por enlace'),
    ivSendNow: 'Enviar al cliente',
    ivResend: 'Reenviar',
    ivRegenerate: 'Regenerar',
    ivIntervention: 'Intervención',
    ivSharedReport: 'Informe compartido',
    ivReportsN: (n) => (n > 1 ? `${n} informes` : `${n} informe`),
    ivDay: 'Día',
    ivWeek: 'Semana',
    ivPrev: 'Anterior',
    ivToday: 'Hoy',
    ivNext: 'Siguiente',
    ivRangeSummary: (r, p) => `${r} informes · ${p} fotos`,
    ivEmptyDay: 'Ningún informe ese día.',
    ivDelete: 'Eliminar la visita',
    ivNoResults: 'Ninguna intervención coincide con esta búsqueda.',
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
