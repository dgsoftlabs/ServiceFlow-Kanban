'use client'

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-2">ServiceFlow Kanban</h3>
            <p className="text-sm text-gray-600">
              Manufacturing workflow management system
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li><a href="/dashboard" className="hover:text-primary">Dashboard</a></li>
              <li><a href="/kanban" className="hover:text-primary">Kanban Board</a></li>
              <li><a href="#" className="hover:text-primary">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary">Help Center</a></li>
              <li><a href="#" className="hover:text-primary">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-6 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} ServiceFlow Kanban. Built with ❤️ by <a href="https://github.com/dgsoftlabs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DgSoftLabs</a></p>
        </div>
      </div>
    </footer>
  )
}
