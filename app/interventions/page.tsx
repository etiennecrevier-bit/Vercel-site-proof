import { AppShell } from '@/components/directory/app-shell'
import { InterventionsLog } from '@/components/interventions/interventions-log'
import { DirectoryLangProvider } from '@/lib/directory-i18n'

export default function InterventionsPage() {
  return (
    <DirectoryLangProvider>
      <AppShell active="interventions">
        <InterventionsLog />
      </AppShell>
    </DirectoryLangProvider>
  )
}
