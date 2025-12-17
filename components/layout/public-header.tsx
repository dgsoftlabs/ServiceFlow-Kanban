'use client'

import Link from 'next/link'

export default function PublicHeader() {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-primary">
            ServiceFlow Kanban
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-primary">
              Login
            </Link>
            <Link 
              href="/login" 
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
