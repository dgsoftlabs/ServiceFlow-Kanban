'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { Column as ColumnType, Task, User } from '@prisma/client'
import { UserRole } from '@/lib/types'
import KanbanColumn from './kanban-column'
import TaskCard from './task-card'

type TaskWithRelations = Task & {
  assignedTo: { id: string; name: string; email: string } | null
  createdBy: { id: string; name: string }
  column: ColumnType
}

interface KanbanBoardProps {
  columns: ColumnType[]
  initialTasks: TaskWithRelations[]
  users: Pick<User, 'id' | 'name' | 'email' | 'role'>[]
  currentUserId: string
  userRole: UserRole
}

export default function KanbanBoard({
  columns,
  initialTasks,
  users,
  currentUserId,
  userRole,
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [activeTask, setActiveTask] = useState<TaskWithRelations | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    let newColumnId = over.id as string

    // Check if dropped over a task instead of a column
    const isOverTask = tasks.some(t => t.id === newColumnId)
    if (isOverTask) {
      const overTask = tasks.find(t => t.id === newColumnId)
      if (overTask) {
        newColumnId = overTask.columnId
      }
    }

    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    if (task.columnId === newColumnId) return

    // Update task locally
    const updatedTasks = tasks.map((t) =>
      t.id === taskId
        ? { ...t, columnId: newColumnId, status: columns.find(c => c.id === newColumnId)?.status || t.status }
        : t
    )
    setTasks(updatedTasks)

    // Update on server
    try {
      const response = await fetch('/api/tasks/' + taskId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columnId: newColumnId }),
      })

      if (!response.ok) {
        // Revert on error
        setTasks(tasks)
      }
    } catch (error) {
      // Revert on error
      setTasks(tasks)
      console.error('Failed to update task:', error)
    }
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory px-4 md:px-0">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.columnId === column.id)
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
              userRole={userRole}
            />
          )
        })}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  )
}
