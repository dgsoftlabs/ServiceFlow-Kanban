import { canCreateTask, canEditTask, canDeleteTask, canManageUsers, canViewAllTasks } from '@/lib/permissions'
import { UserRole } from '@/lib/types'

describe('permissions', () => {
  describe('canCreateTask', () => {
    it('should allow ADMIN to create task', () => {
      expect(canCreateTask(UserRole.ADMIN)).toBe(true)
    })

    it('should allow MANAGER to create task', () => {
      expect(canCreateTask(UserRole.MANAGER)).toBe(true)
    })

    it('should not allow WORKER to create task', () => {
      expect(canCreateTask(UserRole.WORKER)).toBe(false)
    })
  })

  describe('canEditTask', () => {
    it('should allow ADMIN to edit any task', () => {
      expect(canEditTask(UserRole.ADMIN, false)).toBe(true)
    })

    it('should allow MANAGER to edit any task', () => {
      expect(canEditTask(UserRole.MANAGER, false)).toBe(true)
    })

    it('should allow WORKER to edit assigned task', () => {
      expect(canEditTask(UserRole.WORKER, true)).toBe(true)
    })

    it('should not allow WORKER to edit unassigned task', () => {
      expect(canEditTask(UserRole.WORKER, false)).toBe(false)
    })
  })

  describe('canDeleteTask', () => {
    it('should allow ADMIN to delete task', () => {
      expect(canDeleteTask(UserRole.ADMIN)).toBe(true)
    })

    it('should allow MANAGER to delete task', () => {
      expect(canDeleteTask(UserRole.MANAGER)).toBe(true)
    })

    it('should not allow WORKER to delete task', () => {
      expect(canDeleteTask(UserRole.WORKER)).toBe(false)
    })
  })

  describe('canManageUsers', () => {
    it('should allow ADMIN to manage users', () => {
      expect(canManageUsers(UserRole.ADMIN)).toBe(true)
    })

    it('should not allow MANAGER to manage users', () => {
      expect(canManageUsers(UserRole.MANAGER)).toBe(false)
    })

    it('should not allow WORKER to manage users', () => {
      expect(canManageUsers(UserRole.WORKER)).toBe(false)
    })
  })

  describe('canViewAllTasks', () => {
    it('should allow ADMIN to view all tasks', () => {
      expect(canViewAllTasks(UserRole.ADMIN)).toBe(true)
    })

    it('should allow MANAGER to view all tasks', () => {
      expect(canViewAllTasks(UserRole.MANAGER)).toBe(true)
    })

    it('should not allow WORKER to view all tasks (implicitly)', () => {
      // Note: The function returns false for WORKER, implying they might have restricted view
      expect(canViewAllTasks(UserRole.WORKER)).toBe(false)
    })
  })
})
