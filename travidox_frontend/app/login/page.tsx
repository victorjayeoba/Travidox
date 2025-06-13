"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/auth/auth-provider'
import { SignInForm } from '@/components/auth/sign-in-form'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleLoginSuccess = () => {
    // Navigation is handled in the auth provider
  }

  const switchToSignUp = () => {
    router.push('/signup')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Logo href="/" size="md" />
            </div>
            <div className="text-sm text-gray-600 hidden sm:block">
              Don't have an account?{" "}
              <Link href="/signup" className="text-green-600 hover:text-green-500 font-medium">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <SignInForm 
              onSuccess={handleLoginSuccess} 
              onSwitchToSignUp={switchToSignUp}
            />
          </div>
          
          {/* Footer Links */}
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-green-600 hover:text-green-500">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-green-600 hover:text-green-500">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 