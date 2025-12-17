import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserRole } from '@/lib/types'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  const userRole = session?.user?.role as UserRole

  // Get stats
  const totalTasks = await prisma.task.count({
    where: userRole === UserRole.WORKER 
      ? { assignedToId: userId }
      : undefined
  })

  const inProgressTasks = await prisma.task.count({
    where: {
      status: 'IN_PROGRESS',
      ...(userRole === UserRole.WORKER && { assignedToId: userId })
    }
  })

  const overdueTasks = await prisma.task.count({
    where: {
      dueDate: { lt: new Date() },
      status: { not: 'DONE' },
      ...(userRole === UserRole.WORKER && { assignedToId: userId })
    }
  })

  const completedTasks = await prisma.task.count({
    where: {
      status: 'DONE',
      ...(userRole === UserRole.WORKER && { assignedToId: userId })
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {session?.user?.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Tasks</CardDescription>
            <CardTitle className="text-4xl">{totalTasks}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-4xl">{inProgressTasks}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Overdue</CardDescription>
            <CardTitle className="text-4xl text-red-600">{overdueTasks}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-4xl text-green-600">{completedTasks}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <a href="/kanban" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <h3 className="font-semibold">View Kanban Board</h3>
            <p className="text-sm text-gray-600">Manage your workflow</p>
          </a>
          {userRole !== UserRole.WORKER && (
            <a href="/admin" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="font-semibold">Administration</h3>
              <p className="text-sm text-gray-600">Manage users and settings</p>
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
