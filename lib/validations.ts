import { z } from 'zod'
import { UserRole } from './types'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.string().optional().nullable(),
  assignedToId: z.string().optional().nullable(),
  columnId: z.string().min(1, 'Column is required'),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().optional().nullable(),
  assignedToId: z.string().optional().nullable(),
  columnId: z.string().optional(),
  isBlocked: z.boolean().optional(),
  blockReason: z.string().optional().nullable(),
})

// Worker can only update status (column) and maybe block status
export const workerUpdateTaskSchema = z.object({
  columnId: z.string().optional(),
  isBlocked: z.boolean().optional(),
  blockReason: z.string().optional().nullable(),
})
