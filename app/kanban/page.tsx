import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import KanbanBoard from '@/components/kanban/kanban-board'
import { UserRole } from '@/lib/types'

export default async function KanbanPage() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  const userRole = session?.user?.role as UserRole

  // Get columns
  const columns = await prisma.column.findMany({
    orderBy: { position: 'asc' },
  })

  // Get tasks
  const tasks = await prisma.task.findMany({
    where: userRole === UserRole.WORKER 
      ? { assignedToId: userId }
      : undefined,
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
      createdBy: {
        select: { id: true, name: true },
      },
      column: true,
    },
    orderBy: { position: 'asc' },
  })

  // Get all users for assignment
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 md:p-6 rounded-lg shadow-sm border gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Kanban Board</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Manage your manufacturing tasks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{tasks.length}</span> total tasks
          </div>
          {userRole !== UserRole.WORKER && (
            <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90">
              + New Task
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <KanbanBoard 
          columns={columns} 
          initialTasks={tasks} 
          users={users}
          currentUserId={userId!}
          userRole={userRole}
        />
      </div>
    </div>
  )
}
