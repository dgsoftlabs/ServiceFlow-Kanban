'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task, Column } from '@prisma/client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { AlertCircle, Calendar, User } from 'lucide-react'
import { formatDate, isOverdue, getDaysUntilDue } from '@/lib/utils'

type TaskWithRelations = Task & {
  assignedTo: { id: string; name: string; email: string } | null
  createdBy: { id: string; name: string }
  column: Column
}

interface TaskCardProps {
  task: TaskWithRelations
  isDragging?: boolean
}

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  }

  const overdue = isOverdue(task.dueDate)
  const daysUntil = getDaysUntilDue(task.dueDate)

  const priorityColors: Record<string, string> = {
    LOW: 'bg-gray-200 text-gray-800',
    MEDIUM: 'bg-blue-200 text-blue-800',
    HIGH: 'bg-orange-200 text-orange-800',
    URGENT: 'bg-red-200 text-red-800',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className={`cursor-move hover:shadow-md transition-shadow ${
        overdue ? 'border-red-400 border-2' : ''
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm">{task.title}</h4>
            <span
              className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                priorityColors[task.priority] || priorityColors.MEDIUM
              }`}
            >
              {task.priority}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {task.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
          )}

          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${
              overdue ? 'text-red-600 font-medium' : 'text-gray-500'
            }`}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.dueDate)}</span>
              {daysUntil !== null && (
                <span className="ml-1">
                  ({daysUntil > 0 ? `${daysUntil}d left` : 'overdue'})
                </span>
              )}
            </div>
          )}

          {task.assignedTo && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <User className="w-3 h-3" />
              <span>{task.assignedTo.name}</span>
            </div>
          )}

          {task.isBlocked && (
            <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 p-2 rounded">
              <AlertCircle className="w-3 h-3" />
              <span>Blocked</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
