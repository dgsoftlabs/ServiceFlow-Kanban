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
    <div className="flex-shrink-0 w-[85vw] md:w-80 flex flex-col h-full snap-center">
      <div className="bg-slate-100/80 rounded-xl p-3 flex flex-col h-full border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2.5">
            <div
              className="w-3.5 h-3.5 rounded-full ring-2 ring-white shadow-sm"
              style={{ backgroundColor: column.color }}
            />
            <h3 className="font-semibold text-slate-800 text-sm tracking-tight">{column.name}</h3>
            <span className="bg-slate-200 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full">
              {tasks.length}
              {column.wipLimit && ` / ${column.wipLimit}`}
            </span>
          </div>
        </div>

        {isAtWipLimit && (
          <div className="mb-3 text-xs font-medium text-orange-700 bg-orange-50 p-2.5 rounded-md border border-orange-100 flex items-center justify-center shadow-sm">
            ⚠️ WIP limit reached
          </div>
        )}

        <div
          ref={setNodeRef}
          className={`flex-1 min-h-[150px] space-y-2.5 transition-colors duration-200 rounded-lg p-1 ${
            isOver ? 'bg-blue-50/50 ring-2 ring-blue-400/30 ring-inset' : ''
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
