import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'
import DashboardNav from '@/components/dashboard/dashboard-nav'
import Footer from '@/components/layout/footer'
import { UserRole } from '@/lib/types'

export default async function KanbanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardNav 
        user={session.user} 
        role={session.user.role as UserRole}
      />
      <main className="container mx-auto px-4 py-6 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
