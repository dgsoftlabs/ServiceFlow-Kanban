import { cn, formatDate, isOverdue } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('c1', 'c2')).toBe('c1 c2')
      expect(cn('c1', { c2: true, c3: false })).toBe('c1 c2')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-01-01')
      expect(formatDate(date)).toBe('Jan 1, 2023')
    })
  })

  describe('isOverdue', () => {
    it('should return true for past dates', () => {
      const pastDate = new Date('2000-01-01')
      expect(isOverdue(pastDate)).toBe(true)
    })

    it('should return false for future dates', () => {
      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)
      expect(isOverdue(futureDate)).toBe(false)
    })

    it('should return false for null', () => {
      expect(isOverdue(null)).toBe(false)
    })
  })
})
