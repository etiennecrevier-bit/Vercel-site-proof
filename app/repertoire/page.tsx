import { EmployeesDirectory } from '@/components/directory/employees-directory'
import { DirectoryLangProvider } from '@/lib/directory-i18n'

export default function RepertoirePage() {
  return (
    <DirectoryLangProvider>
      <EmployeesDirectory />
    </DirectoryLangProvider>
  )
}
