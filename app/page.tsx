import { AppShell } from '@/components/app-shell'
import { LangProvider } from '@/lib/i18n'

export default function Page() {
  return (
    <LangProvider>
      <AppShell />
    </LangProvider>
  )
}
