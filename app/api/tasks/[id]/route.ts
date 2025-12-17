import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@/lib/types'
import { canEditTask, canDeleteTask } from '@/lib/permissions'
import { updateTaskSchema, workerUpdateTaskSchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true },
        },
        column: true,
        comments: {
          include: {
            author: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Check permissions
    const userRole = session.user.role as UserRole
    if (userRole === UserRole.WORKER && task.assignedToId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const task = await prisma.task.findUnique({
      where: { id },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Check permissions
    const userRole = session.user.role as UserRole
    const isAssigned = task.assignedToId === session.user.id
    
    if (!canEditTask(userRole, isAssigned)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    
    // Validate body based on role
    let validation
    if (userRole === UserRole.WORKER) {
      validation = workerUpdateTaskSchema.safeParse(body)
    } else {
      validation = updateTaskSchema.safeParse(body)
    }

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 })
    }

    const updates: any = {}
    const data = validation.data

    if (data.columnId !== undefined) {
      const newColumn = await prisma.column.findUnique({
        where: { id: data.columnId },
      })
      updates.columnId = data.columnId
      updates.status = newColumn?.status
    }
    
    // Only apply other updates if they exist in the validated data
    if ('title' in data) updates.title = data.title
    if ('description' in data) updates.description = data.description
    if ('priority' in data) updates.priority = data.priority
    if ('dueDate' in data) updates.dueDate = data.dueDate ? new Date(data.dueDate) : null
    if ('assignedToId' in data) updates.assignedToId = data.assignedToId
    if ('isBlocked' in data) updates.isBlocked = data.isBlocked
    if ('blockReason' in data) updates.blockReason = data.blockReason

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updates,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true },
        },
        column: true,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'TASK',
        entityId: task.id,
        userId: session.user.id,
        taskId: task.id,
        changes: JSON.stringify(updates),
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const userRole = session.user.role as UserRole
    if (!canDeleteTask(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.task.delete({
      where: { id },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        entity: 'TASK',
        entityId: id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
