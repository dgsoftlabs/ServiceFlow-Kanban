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
    LOW: 'bg-slate-500',
    MEDIUM: 'bg-blue-500',
    HIGH: 'bg-orange-500',
    URGENT: 'bg-red-500',
  }

  const priorityLabels: Record<string, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    URGENT: 'Urgent',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className={`group relative cursor-move hover:shadow-lg transition-all duration-200 border-l-4 ${
        overdue ? 'border-red-500' : 'border-l-transparent'
      } ${isDragging ? 'shadow-xl rotate-2 scale-105' : ''}`}>
        
        {/* Priority Indicator Strip */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-md ${priorityColors[task.priority]}`} />

        <CardHeader className="p-3 pb-0">
          <div className="flex items-start justify-between gap-2 pl-2">
            <h4 className="font-medium text-sm text-gray-900 leading-tight">{task.title}</h4>
          </div>
        </CardHeader>
        <CardContent className="p-3 space-y-3 pl-5">
          {task.description && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{task.description}</p>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              {task.assignedTo ? (
                <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                  <User className="w-3 h-3" />
                  <span className="font-medium">{task.assignedTo.name}</span>
                </div>
              ) : (
                <div className="text-xs text-gray-400 italic px-1">Unassigned</div>
              )}
            </div>

            {task.dueDate && (
              <div className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full border ${
                overdue 
                  ? 'text-red-700 bg-red-50 border-red-100' 
                  : daysUntil !== null && daysUntil <= 2 
                    ? 'text-orange-700 bg-orange-50 border-orange-100'
                    : 'text-gray-600 bg-gray-50 border-gray-100'
              }`}>
                <Calendar className="w-3 h-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>

          {task.isBlocked && (
            <div className="flex items-center gap-1.5 text-xs text-red-700 bg-red-50 p-2 rounded-md border border-red-100">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="font-medium">Blocked</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
