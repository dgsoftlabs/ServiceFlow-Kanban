'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { UserRole } from '@/lib/types'
import { LayoutDashboard, Kanban, Users, LogOut, Menu, X } from 'lucide-react'

interface DashboardNavProps {
  user: {
    name?: string | null
    email?: string | null
  }
  role: UserRole
}

export default function DashboardNav({ user, role }: DashboardNavProps) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/kanban', label: 'Kanban', icon: Kanban },
  ]

  if (role === UserRole.ADMIN) {
    navItems.push({ href: '/admin', label: 'Admin', icon: Users })
  }

  return (
    <nav className="bg-white border-b relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 md:gap-8">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/dashboard" className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="hidden sm:inline">ServiceFlow</span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium text-slate-900">{user.name}</div>
              <div className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-0.5">{role}</div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 hidden md:flex"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white absolute w-full left-0 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
          <div className="border-t px-4 py-4 bg-slate-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                {user.name?.[0] || 'U'}
              </div>
              <div>
                <div className="font-medium text-slate-900">{user.name}</div>
                <div className="text-xs text-slate-500">{user.email}</div>
                <div className="text-xs font-medium text-slate-500 mt-1">{role}</div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start text-slate-600"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
