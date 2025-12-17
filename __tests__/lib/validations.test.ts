import { createTaskSchema, updateTaskSchema, workerUpdateTaskSchema } from '@/lib/validations'

describe('validations', () => {
  describe('createTaskSchema', () => {
    it('should validate valid task data', () => {
      const validData = {
        title: 'New Task',
        description: 'Description',
        priority: 'HIGH',
        columnId: 'col-1',
      }
      const result = createTaskSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should fail if title is missing', () => {
      const invalidData = {
        description: 'Description',
        priority: 'HIGH',
        columnId: 'col-1',
      }
      const result = createTaskSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should fail if columnId is missing', () => {
      const invalidData = {
        title: 'New Task',
        priority: 'HIGH',
      }
      const result = createTaskSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('updateTaskSchema', () => {
    it('should validate partial updates', () => {
      const validData = {
        title: 'Updated Title',
      }
      const result = updateTaskSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('workerUpdateTaskSchema', () => {
    it('should allow columnId update', () => {
      const validData = {
        columnId: 'col-2',
      }
      const result = workerUpdateTaskSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should allow isBlocked update', () => {
      const validData = {
        isBlocked: true,
        blockReason: 'Waiting for parts',
      }
      const result = workerUpdateTaskSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
    
    // Note: Zod by default strips unknown keys if not configured otherwise, 
    // but strict() would make it fail. The schema definition doesn't use strict().
    // However, we can check if the parsed output contains the extra fields if we were using strict,
    // or just rely on the fact that the schema defines what is allowed.
    // Since we are testing the schema definition, we can check if valid inputs pass.
  })
})
