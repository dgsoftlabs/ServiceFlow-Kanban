import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { UserRole, TaskPriority, TaskStatus } from '../lib/types'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.auditLog.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.task.deleteMany()
  await prisma.column.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@serviceflow.com',
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  })

  const manager = await prisma.user.create({
    data: {
      email: 'manager@serviceflow.com',
      name: 'Manager User',
      password: hashedPassword,
      role: UserRole.MANAGER,
    },
  })

  const worker1 = await prisma.user.create({
    data: {
      email: 'worker1@serviceflow.com',
      name: 'Worker One',
      password: hashedPassword,
      role: UserRole.WORKER,
    },
  })

  const worker2 = await prisma.user.create({
    data: {
      email: 'worker2@serviceflow.com',
      name: 'Worker Two',
      password: hashedPassword,
      role: UserRole.WORKER,
    },
  })

  console.log('✅ Users created')

  // Create columns
  const backlog = await prisma.column.create({
    data: {
      name: 'Backlog',
      position: 0,
      status: TaskStatus.BACKLOG,
      color: '#6B7280',
    },
  })

  const todo = await prisma.column.create({
    data: {
      name: 'To Do',
      position: 1,
      status: TaskStatus.TODO,
      wipLimit: 5,
      color: '#3B82F6',
    },
  })

  const inProgress = await prisma.column.create({
    data: {
      name: 'In Progress',
      position: 2,
      status: TaskStatus.IN_PROGRESS,
      wipLimit: 3,
      color: '#F59E0B',
    },
  })

  const review = await prisma.column.create({
    data: {
      name: 'Review',
      position: 3,
      status: TaskStatus.REVIEW,
      wipLimit: 2,
      color: '#8B5CF6',
    },
  })

  const done = await prisma.column.create({
    data: {
      name: 'Done',
      position: 4,
      status: TaskStatus.DONE,
      color: '#10B981',
    },
  })

  console.log('✅ Columns created')

  // Create tasks
  const tasks = [
    {
      title: 'Setup production line monitoring',
      description: 'Install sensors on production line A',
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO,
      columnId: todo.id,
      assignedToId: worker1.id,
      createdById: manager.id,
      position: 0,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Quality check machinery',
      description: 'Perform monthly quality inspection',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.IN_PROGRESS,
      columnId: inProgress.id,
      assignedToId: worker2.id,
      createdById: manager.id,
      position: 0,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Repair conveyor belt',
      description: 'Fix damaged section of conveyor belt in zone B',
      priority: TaskPriority.URGENT,
      status: TaskStatus.TODO,
      columnId: todo.id,
      assignedToId: worker1.id,
      createdById: manager.id,
      position: 1,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Update inventory system',
      description: 'Migrate to new inventory tracking software',
      priority: TaskPriority.LOW,
      status: TaskStatus.BACKLOG,
      columnId: backlog.id,
      createdById: manager.id,
      position: 0,
    },
    {
      title: 'Safety training session',
      description: 'Conduct quarterly safety training for all workers',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.REVIEW,
      columnId: review.id,
      assignedToId: worker2.id,
      createdById: admin.id,
      position: 0,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Calibrate measurement tools',
      description: 'Annual calibration of precision measurement equipment',
      priority: TaskPriority.HIGH,
      status: TaskStatus.DONE,
      columnId: done.id,
      assignedToId: worker1.id,
      createdById: manager.id,
      position: 0,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ]

  for (const taskData of tasks) {
    await prisma.task.create({ data: taskData })
  }

  console.log('✅ Tasks created')

  // Create some comments
  const task1 = await prisma.task.findFirst({ where: { title: 'Setup production line monitoring' } })
  if (task1) {
    await prisma.comment.create({
      data: {
        content: 'Started working on sensor installation',
        taskId: task1.id,
        authorId: worker1.id,
      },
    })
  }

  console.log('✅ Comments created')
  console.log('🎉 Seed completed!')
  console.log('\n📧 Demo credentials:')
  console.log('Admin: admin@serviceflow.com / password123')
  console.log('Manager: manager@serviceflow.com / password123')
  console.log('Worker: worker1@serviceflow.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
