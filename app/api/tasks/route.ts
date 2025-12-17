import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@/lib/types'
import { canCreateTask, canViewAllTasks } from '@/lib/permissions'
import { createTaskSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = session.user.role as UserRole
    const userId = session.user.id

    const tasks = await prisma.task.findMany({
      where: !canViewAllTasks(userRole)
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

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = session.user.role as UserRole
    if (!canCreateTask(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validation = createTaskSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 })
    }

    const { title, description, priority, dueDate, assignedToId, columnId } = validation.data

    // Get max position in column
    const maxPosition = await prisma.task.aggregate({
      where: { columnId },
      _max: { position: true },
    })

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedToId,
        columnId,
        createdById: session.user.id,
        position: (maxPosition._max.position ?? -1) + 1,
        status: (await prisma.column.findUnique({ where: { id: columnId } }))?.status || 'BACKLOG',
      },
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
        action: 'CREATE',
        entity: 'TASK',
        entityId: task.id,
        userId: session.user.id,
        taskId: task.id,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
