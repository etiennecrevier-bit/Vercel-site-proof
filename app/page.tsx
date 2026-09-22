import { Messaging } from '@/components/messaging'
import { LangProvider } from '@/lib/i18n'

export default function Page() {
  return (
    <LangProvider>
      <main className="min-h-svh bg-background">
        <Messaging />
      </main>
    </LangProvider>
  )
}
