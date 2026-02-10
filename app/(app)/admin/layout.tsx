import { getCurrentUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  // Require authentication
  if (!user) {
    redirect('/login')
  }

  // Require admin role
  if (!user.is_admin) {
    redirect('/saved')
  }

  return <>{children}</>
}
