import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'
import LoginForm from '@/components/auth/login-form'
import PublicHeader from '@/components/layout/public-header'
import Footer from '@/components/layout/footer'

export default async function LoginPage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl border border-slate-100">
          <div>
            <h2 className="mt-2 text-center text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600">
              Sign in to access your manufacturing dashboard
            </p>
          </div>
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
