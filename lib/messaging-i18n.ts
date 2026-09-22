import type { Lang } from '@/lib/i18n'

export type MessagingDict = {
  title: string
  subtitle: string
  searchPlaceholder: string
  conversations: string
  unrecognized: string
  today: string
  yesterday: string
  automated: string
  supervisor: string
  photosReceived: (n: number) => string
  statusSent: string
  statusDelivered: string
  statusRead: string
  statusReceived: string
  reportReady: string
  composerPlaceholder: string
  send: string
  quickReplies: string
  quickConfirm: string
  quickThanks: string
  emptyTitle: string
  emptyBody: string
  inbound: string
  outbound: string
  lastActivity: string
  viewSite: string
}

const DICTS: Record<Lang, MessagingDict> = {
  fr: {
    title: 'Messagerie',
    subtitle: 'Échanges avec les employés sur le terrain',
    searchPlaceholder: 'Rechercher un employé ou un numéro',
    conversations: 'Conversations',
    unrecognized: 'Numéro non reconnu',
    today: "Aujourd'hui",
    yesterday: 'Hier',
    automated: 'Automatique',
    supervisor: 'Superviseur',
    photosReceived: (n) => (n > 1 ? `${n} photos reçues` : `${n} photo reçue`),
    statusSent: 'Envoyé',
    statusDelivered: 'Distribué',
    statusRead: 'Lu',
    statusReceived: 'Reçu',
    reportReady: 'Rapport prêt',
    composerPlaceholder: 'Écrire une réponse…',
    send: 'Envoyer',
    quickReplies: 'Réponses rapides',
    quickConfirm: 'Accusé de réception',
    quickThanks: 'Remerciement',
    emptyTitle: 'Choisissez une conversation',
    emptyBody: 'Sélectionnez un employé à gauche pour consulter les échanges et répondre.',
    inbound: 'Entrant',
    outbound: 'Sortant',
    lastActivity: 'Dernière activité',
    viewSite: 'Site',
  },
  en: {
    title: 'Messaging',
    subtitle: 'Exchanges with field employees',
    searchPlaceholder: 'Search an employee or number',
    conversations: 'Conversations',
    unrecognized: 'Unknown number',
    today: 'Today',
    yesterday: 'Yesterday',
    automated: 'Automated',
    supervisor: 'Supervisor',
    photosReceived: (n) => (n > 1 ? `${n} photos received` : `${n} photo received`),
    statusSent: 'Sent',
    statusDelivered: 'Delivered',
    statusRead: 'Read',
    statusReceived: 'Received',
    reportReady: 'Report ready',
    composerPlaceholder: 'Write a reply…',
    send: 'Send',
    quickReplies: 'Quick replies',
    quickConfirm: 'Acknowledgement',
    quickThanks: 'Thank you',
    emptyTitle: 'Choose a conversation',
    emptyBody: 'Select an employee on the left to review the exchange and reply.',
    inbound: 'Inbound',
    outbound: 'Outbound',
    lastActivity: 'Last activity',
    viewSite: 'Site',
  },
  es: {
    title: 'Mensajería',
    subtitle: 'Intercambios con los empleados en el terreno',
    searchPlaceholder: 'Buscar un empleado o número',
    conversations: 'Conversaciones',
    unrecognized: 'Número no reconocido',
    today: 'Hoy',
    yesterday: 'Ayer',
    automated: 'Automático',
    supervisor: 'Supervisor',
    photosReceived: (n) => (n > 1 ? `${n} fotos recibidas` : `${n} foto recibida`),
    statusSent: 'Enviado',
    statusDelivered: 'Entregado',
    statusRead: 'Leído',
    statusReceived: 'Recibido',
    reportReady: 'Informe listo',
    composerPlaceholder: 'Escribir una respuesta…',
    send: 'Enviar',
    quickReplies: 'Respuestas rápidas',
    quickConfirm: 'Acuse de recibo',
    quickThanks: 'Agradecimiento',
    emptyTitle: 'Elige una conversación',
    emptyBody: 'Selecciona un empleado a la izquierda para consultar los intercambios y responder.',
    inbound: 'Entrante',
    outbound: 'Saliente',
    lastActivity: 'Última actividad',
    viewSite: 'Sitio',
  },
}

export function messagingDict(lang: Lang): MessagingDict {
  return DICTS[lang]
}
