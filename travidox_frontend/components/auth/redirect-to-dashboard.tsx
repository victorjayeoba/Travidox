"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function RedirectToDashboard() {
  const router = useRouter()

  useEffect(() => {
    console.log('🎯 Redirect component mounted, navigating to dashboard...')
    
    // Try multiple navigation approaches
    const navigate = () => {
      try {
        router.push('/dashboard')
        console.log('✅ Router.push executed')
      } catch (error) {
        console.error('❌ Router.push failed:', error)
        // Fallback to window.location
        window.location.href = '/dashboard'
        console.log('✅ Window.location fallback executed')
      }
    }

    // Immediate navigation
    navigate()

    // Backup navigation after 500ms
    const timeout = setTimeout(navigate, 500)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        <p className="text-gray-600">Taking you to your dashboard...</p>
      </div>
    </div>
  )
} 