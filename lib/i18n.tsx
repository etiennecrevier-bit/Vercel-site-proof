'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'fr' | 'en' | 'es'

type Dict = {
  appName: string
  inboxTitle: string
  dateToday: string
  received: string
  toConfirm: string
  toCheck: string
  confirmed: string
  filterToProcess: string
  filterConfirmed: string
  filterAll: string
  state: string
  stateData: string
  stateLoading: string
  stateEmpty: string
  stateError: string
  photos: (n: number) => string
  receivedAt: string
  detected: string
  confidenceHigh: string
  confidenceLow: string
  confirm: string
  correct: string
  isConfirmed: string
  isCorrected: string
  undo: string
  unrecognized: string
  unrecognizedHint: string
  chooseBuilding: string
  cancel: string
  save: string
  keyboard: string
  keyMove: string
  keyConfirm: string
  keyCorrect: string
  allDoneTitle: string
  allDoneBody: string
  emptyTitle: string
  emptyBody: string
  loadingLabel: string
  errorTitle: string
  errorBody: string
  retry: string
  morePhotos: (n: number) => string
  correctedFrom: string
}

const DICTS: Record<Lang, Dict> = {
  fr: {
    appName: 'Site Proof',
    inboxTitle: 'Boîte de réception',
    dateToday: "Aujourd'hui — jeudi 9 septembre",
    received: 'envois reçus',
    toConfirm: 'à confirmer',
    toCheck: 'à vérifier',
    confirmed: 'confirmés',
    filterToProcess: 'À traiter',
    filterConfirmed: 'Confirmés',
    filterAll: 'Tous',
    state: 'État',
    stateData: 'Données',
    stateLoading: 'Chargement',
    stateEmpty: 'Vide',
    stateError: 'Erreur',
    photos: (n) => (n > 1 ? `${n} photos` : `${n} photo`),
    receivedAt: 'reçu à',
    detected: 'Bâtiment détecté',
    confidenceHigh: 'Confiance élevée',
    confidenceLow: 'Confiance faible',
    confirm: 'Confirmer',
    correct: 'Corriger',
    isConfirmed: 'Confirmé',
    isCorrected: 'Corrigé',
    undo: 'Annuler',
    unrecognized: 'Employé non reconnu',
    unrecognizedHint: 'Numéro absent du répertoire — à associer manuellement',
    chooseBuilding: 'Choisir le bon bâtiment',
    cancel: 'Annuler',
    save: 'Enregistrer',
    keyboard: 'Clavier',
    keyMove: 'naviguer',
    keyConfirm: 'confirmer',
    keyCorrect: 'corriger',
    allDoneTitle: 'Tout est traité',
    allDoneBody: "Aucun envoi n'attend de décision. Les envois confirmés restent consultables via le filtre « Confirmés ».",
    emptyTitle: 'Boîte de réception vide',
    emptyBody: "Aucun envoi reçu pour l'instant aujourd'hui. Les nouvelles photos WhatsApp apparaîtront ici automatiquement.",
    loadingLabel: 'Réception des envois du jour…',
    errorTitle: 'Impossible de charger les envois',
    errorBody: 'La connexion à la passerelle WhatsApp a échoué. Les envois sont conservés et seront affichés dès le rétablissement.',
    retry: 'Réessayer',
    morePhotos: (n) => `+${n}`,
    correctedFrom: 'Détecté',
  },
  en: {
    appName: 'Site Proof',
    inboxTitle: 'Inbox',
    dateToday: 'Today — Thursday, September 9',
    received: 'submissions received',
    toConfirm: 'to confirm',
    toCheck: 'to check',
    confirmed: 'confirmed',
    filterToProcess: 'To process',
    filterConfirmed: 'Confirmed',
    filterAll: 'All',
    state: 'State',
    stateData: 'Data',
    stateLoading: 'Loading',
    stateEmpty: 'Empty',
    stateError: 'Error',
    photos: (n) => (n > 1 ? `${n} photos` : `${n} photo`),
    receivedAt: 'received at',
    detected: 'Detected building',
    confidenceHigh: 'High confidence',
    confidenceLow: 'Low confidence',
    confirm: 'Confirm',
    correct: 'Correct',
    isConfirmed: 'Confirmed',
    isCorrected: 'Corrected',
    undo: 'Undo',
    unrecognized: 'Unrecognized employee',
    unrecognizedHint: 'Number not in directory — assign manually',
    chooseBuilding: 'Choose the right building',
    cancel: 'Cancel',
    save: 'Save',
    keyboard: 'Keyboard',
    keyMove: 'move',
    keyConfirm: 'confirm',
    keyCorrect: 'correct',
    allDoneTitle: 'All caught up',
    allDoneBody: 'No submission is waiting for a decision. Confirmed submissions stay available under the “Confirmed” filter.',
    emptyTitle: 'Inbox is empty',
    emptyBody: 'No submissions received yet today. New WhatsApp photos will appear here automatically.',
    loadingLabel: 'Loading today’s submissions…',
    errorTitle: 'Could not load submissions',
    errorBody: 'The connection to the WhatsApp gateway failed. Submissions are kept and will appear once the connection is restored.',
    retry: 'Try again',
    morePhotos: (n) => `+${n}`,
    correctedFrom: 'Detected',
  },
  es: {
    appName: 'Site Proof',
    inboxTitle: 'Bandeja de entrada',
    dateToday: 'Hoy — jueves 9 de septiembre',
    received: 'envíos recibidos',
    toConfirm: 'por confirmar',
    toCheck: 'por verificar',
    confirmed: 'confirmados',
    filterToProcess: 'Por procesar',
    filterConfirmed: 'Confirmados',
    filterAll: 'Todos',
    state: 'Estado',
    stateData: 'Datos',
    stateLoading: 'Cargando',
    stateEmpty: 'Vacío',
    stateError: 'Error',
    photos: (n) => (n > 1 ? `${n} fotografías` : `${n} fotografía`),
    receivedAt: 'recibido a las',
    detected: 'Edificio detectado',
    confidenceHigh: 'Confianza alta',
    confidenceLow: 'Confianza baja',
    confirm: 'Confirmar',
    correct: 'Corregir',
    isConfirmed: 'Confirmado',
    isCorrected: 'Corregido',
    undo: 'Deshacer',
    unrecognized: 'Empleado no reconocido',
    unrecognizedHint: 'Número ausente del directorio — asignar manualmente',
    chooseBuilding: 'Seleccionar el edificio correcto',
    cancel: 'Cancelar',
    save: 'Guardar',
    keyboard: 'Teclado',
    keyMove: 'navegar',
    keyConfirm: 'confirmar',
    keyCorrect: 'corregir',
    allDoneTitle: 'Todo procesado',
    allDoneBody: 'Ningún envío está esperando una decisión. Los envíos confirmados permanecen disponibles en el filtro «Confirmados».',
    emptyTitle: 'La bandeja de entrada está vacía',
    emptyBody: 'Todavía no se ha recibido ningún envío hoy. Las nuevas fotografías de WhatsApp aparecerán aquí automáticamente.',
    loadingLabel: 'Recibiendo los envíos del día…',
    errorTitle: 'No se pudieron cargar los envíos',
    errorBody: 'Falló la conexión con la pasarela de WhatsApp. Los envíos se conservan y aparecerán en cuanto se restablezca la conexión.',
    retry: 'Reintentar',
    morePhotos: (n) => `+${n}`,
    correctedFrom: 'Detectado',
  },
}

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: 'fr',
  setLang: () => {},
  t: DICTS.fr,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr')
  return <LangContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>{children}</LangContext.Provider>
}

export function useI18n() {
  return useContext(LangContext)
}

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
]
