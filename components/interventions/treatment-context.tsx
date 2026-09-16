'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { BUILDINGS, type BuildingLog, type Disposition } from '@/lib/interventions-data'

/** The signed-in team member — their name is stamped on every report they process. */
const CURRENT_USER = 'Antoine Bégin'

type TreatmentContextValue = {
  buildings: BuildingLog[]
  currentUser: string
  setDisposition: (reportId: string, disposition: Disposition) => void
}

const TreatmentContext = createContext<TreatmentContextValue | null>(null)

function cloneBuildings(source: BuildingLog[]): BuildingLog[] {
  return source.map((b) => ({
    ...b,
    visits: b.visits.map((v) => ({ ...v, reports: v.reports.map((r) => ({ ...r })) })),
  }))
}

export function TreatmentProvider({ children }: { children: ReactNode }) {
  const [buildings, setBuildings] = useState<BuildingLog[]>(() => cloneBuildings(BUILDINGS))

  const setDisposition = useCallback((reportId: string, disposition: Disposition) => {
    setBuildings((prev) =>
      prev.map((b) => ({
        ...b,
        visits: b.visits.map((v) => ({
          ...v,
          reports: v.reports.map((r) => {
            if (r.id !== reportId) return r
            if (disposition === 'a_traiter') {
              return { ...r, disposition, signature: undefined }
            }
            return {
              ...r,
              disposition,
              signature: { employee: CURRENT_USER, at: new Date().toISOString() },
            }
          }),
        })),
      })),
    )
  }, [])

  const value = useMemo<TreatmentContextValue>(
    () => ({ buildings, currentUser: CURRENT_USER, setDisposition }),
    [buildings, setDisposition],
  )

  return <TreatmentContext.Provider value={value}>{children}</TreatmentContext.Provider>
}

export function useTreatment(): TreatmentContextValue {
  const ctx = useContext(TreatmentContext)
  if (!ctx) throw new Error('useTreatment must be used within a TreatmentProvider')
  return ctx
}
