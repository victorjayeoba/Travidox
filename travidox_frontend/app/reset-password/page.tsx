"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { EyeIcon, EyeOffIcon, Loader2, Lock, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { getAuthErrorMessage, validatePasswordStrength } from "@/lib/auth-config"

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .refine((password) => {
      const validation = validatePasswordStrength(password)
      return validation.isValid
    }, {
      message: "Password does not meet security requirements"
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isValidCode, setIsValidCode] = useState<boolean | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const oobCode = searchParams.get('oobCode')
  const mode = searchParams.get('mode')

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode || mode !== 'resetPassword') {
        setIsValidCode(false)
        setError("Invalid or missing reset code. Please request a new password reset.")
        return
      }

      try {
        setIsLoading(true)
        const email = await verifyPasswordResetCode(auth, oobCode)
        setUserEmail(email)
        setIsValidCode(true)
      } catch (error: any) {
        console.error("Error verifying reset code:", error)
        setIsValidCode(false)
        
        const errorMessage = getAuthErrorMessage(error.code || 'auth/invalid-action-code')
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    verifyCode()
  }, [oobCode, mode])

  async function onSubmit(data: ResetPasswordValues) {
    if (!oobCode) {
      toast.error("Missing reset code")
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      await confirmPasswordReset(auth, oobCode, data.password)
      setIsSuccess(true)
      toast.success("Password reset successful! You can now sign in with your new password.")
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      console.error("Error resetting password:", error)
      
      const errorMessage = getAuthErrorMessage(error.code || 'default')
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state while verifying code
  if (isValidCode === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600" />
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-16">
              <Logo href="/" size="md" />
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Password Reset Successful!</h2>
                <p className="text-gray-600">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
              </div>
              <Button
                onClick={() => router.push('/login')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Continue to Sign In
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Error state - invalid or expired code
  if (!isValidCode) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-16">
              <Logo href="/" size="md" />
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Reset Link Invalid</h2>
                <p className="text-gray-600">
                  {error || "This password reset link is invalid or has expired."}
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Request New Reset Link
                </Button>
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-full"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Main reset password form
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/login')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Logo href="/" size="md" />
            </div>
            <div className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/login" className="text-green-600 hover:text-green-500 font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Reset Your Password</h2>
                <p className="text-gray-600 text-sm">
                  Enter a new password for <strong>{userEmail}</strong>
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                              disabled={isLoading}
                              className="h-11 sm:h-12 pl-10 sm:pl-12 pr-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors text-gray-900 text-base"
                              autoComplete="new-password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isLoading}
                            >
                              {showPassword ? (
                                <EyeOffIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                              ) : (
                                <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                              disabled={isLoading}
                              className="h-11 sm:h-12 pl-10 sm:pl-12 pr-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors text-gray-900 text-base"
                              autoComplete="new-password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              disabled={isLoading}
                            >
                              {showConfirmPassword ? (
                                <EyeOffIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                              ) : (
                                <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full h-11 sm:h-12 bg-green-600 hover:bg-green-700 font-medium transition-colors text-base"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                          Resetting Password...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                          Reset Password
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>

              <div className="text-xs text-gray-500 text-center">
                <p>Make sure to choose a strong password with at least 8 characters.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 