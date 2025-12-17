'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { UserRole } from '@/lib/types'
import { LayoutDashboard, Kanban, Users, LogOut } from 'lucide-react'

interface DashboardNavProps {
  user: {
    name?: string | null
    email?: string | null
  }
  role: UserRole
}

export default function DashboardNav({ user, role }: DashboardNavProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/kanban', label: 'Kanban', icon: Kanban },
  ]

  if (role === UserRole.ADMIN) {
    navItems.push({ href: '/admin', label: 'Admin', icon: Users })
  }

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              ServiceFlow
            </Link>
            
            <div className="flex space-x-1">
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
              className="text-slate-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
