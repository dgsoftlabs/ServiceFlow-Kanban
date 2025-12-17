import { UserRole } from './types'

export function canCreateTask(role: UserRole): boolean {
  return role === UserRole.ADMIN || role === UserRole.MANAGER
}

export function canEditTask(role: UserRole, isAssignedUser: boolean): boolean {
  if (role === UserRole.ADMIN || role === UserRole.MANAGER) return true
  if (role === UserRole.WORKER && isAssignedUser) return true
  return false
}

export function canDeleteTask(role: UserRole): boolean {
  return role === UserRole.ADMIN || role === UserRole.MANAGER
}

export function canManageUsers(role: UserRole): boolean {
  return role === UserRole.ADMIN
}

export function canViewAllTasks(role: UserRole): boolean {
  return role === UserRole.ADMIN || role === UserRole.MANAGER
}
