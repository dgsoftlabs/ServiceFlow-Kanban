'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Column, Task, User } from '@prisma/client'
import { UserRole } from '@/lib/types'
import TaskCard from './task-card'

type TaskWithRelations = Task & {
  assignedTo: { id: string; name: string; email: string } | null
  createdBy: { id: string; name: string }
  column: Column
}

interface KanbanColumnProps {
  column: Column
  tasks: TaskWithRelations[]
  userRole: UserRole
}

export default function KanbanColumn({ column, tasks, userRole }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  const taskIds = tasks.map((task) => task.id)

  const isAtWipLimit = column.wipLimit && tasks.length >= column.wipLimit

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: column.color }}
            />
            <h3 className="font-semibold text-gray-900">{column.name}</h3>
            <span className="text-sm text-gray-500">
              {tasks.length}
              {column.wipLimit && ` / ${column.wipLimit}`}
            </span>
          </div>
        </div>

        {isAtWipLimit && (
          <div className="mb-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
            WIP limit reached
          </div>
        )}

        <div
          ref={setNodeRef}
          className={`min-h-[200px] space-y-2 ${
            isOver ? 'bg-blue-50 border-2 border-blue-400 border-dashed rounded-lg' : ''
          }`}
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  )
}
