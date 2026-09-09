import { Inbox } from '@/components/inbox'
import { LangProvider } from '@/lib/i18n'

export default function Page() {
  return (
    <LangProvider>
      <main className="min-h-svh bg-background">
        <Inbox />
      </main>
    </LangProvider>
  )
}
