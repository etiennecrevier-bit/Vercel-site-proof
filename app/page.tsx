import { Dashboard } from '@/components/dashboard/dashboard'
import { DashboardLangProvider } from '@/lib/dashboard-i18n'

export default function Page() {
  return (
    <DashboardLangProvider>
      <div className="min-h-svh bg-background">
        <Dashboard />
      </div>
    </DashboardLangProvider>
  )
}
