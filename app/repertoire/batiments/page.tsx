import { DirectoryLangProvider } from '@/lib/directory-i18n'
import { BuildingsDirectory } from '@/components/directory/buildings-directory'

export default function Page() {
  return (
    <DirectoryLangProvider>
      <BuildingsDirectory />
    </DirectoryLangProvider>
  )
}
