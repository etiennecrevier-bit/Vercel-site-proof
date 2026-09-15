import { HealthDashboard } from '@/components/directory/health-dashboard'
import { DirectoryLangProvider } from '@/lib/directory-i18n'

export default function SantePage() {
  return (
    <DirectoryLangProvider>
      <HealthDashboard />
    </DirectoryLangProvider>
  )
}
