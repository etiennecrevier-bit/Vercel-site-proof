import type { Metadata } from 'next'
import { INTERVENTION } from '@/lib/intervention'
import { InterventionView } from '@/components/intervention/intervention-view'

export const metadata: Metadata = {
  title: `${INTERVENTION.code} (${INTERVENTION.number}) — ${INTERVENTION.siteName}`,
  description: "Lecture d'une intervention : rapport, galerie photo et notes internes.",
}

export default function InterventionPage() {
  return (
    <main className="min-h-svh bg-background">
      <InterventionView intervention={INTERVENTION} />
    </main>
  )
}
