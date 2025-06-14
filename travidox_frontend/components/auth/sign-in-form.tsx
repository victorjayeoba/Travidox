"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { EyeIcon, EyeOffIcon, Loader2, Mail, Lock, LogIn } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"
import { SocialAuthButton } from "./social-auth-button"
import { ForgotPasswordForm } from "./forgot-password-form"
import { toast } from "sonner"
import Link from "next/link"

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type SignInValues = z.infer<typeof signInSchema>

interface SignInFormProps {
  onSuccess?: () => void
  onSwitchToSignUp?: () => void
}

export function SignInForm({ onSuccess, onSwitchToSignUp }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { login, signInWithGoogle, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: SignInValues) {
    setIsLoading(true)
    
    try {
      await login(data.email, data.password)
      toast.success("Welcome back! Redirecting to dashboard...")
      
      if (onSuccess) {
        onSuccess()
      }
      
    } catch (error: any) {
      console.error("Sign in error:", error)
      toast.error(error.message || "Failed to sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      toast.success("Welcome back! Redirecting to dashboard...")
      
      if (onSuccess) {
        onSuccess()
      }
      
    } catch (error: any) {
      console.error("Google sign-in error:", error)
      toast.error(error.message || "Failed to sign in with Google. Please try again.")
    }
  }

  if (showForgotPassword) {
    return (
      <ForgotPasswordForm 
        onBack={() => setShowForgotPassword(false)}
        onSuccess={() => setShowForgotPassword(false)}
      />
    )
  }

  return (
    <div className="space-y-4 w-full">
      {/* Header */}
      <div className="text-center space-y-2">
        {/* <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
          <LogIn className="w-6 h-6 text-green-600" />
        </div> */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 text-sm">Sign in to your account to continue</p>
      </div>

      {/* Google Sign In */}
      <SocialAuthButton
        icon={
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        }
        provider="Google"
        onClick={handleGoogleSignIn}
        isLoading={authLoading}
        disabled={isLoading || authLoading}
        className="h-11 sm:h-12 font-medium"
      />

      {/* Divider */}
      <div className="relative flex items-center py-2 sm:py-3">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="mx-4 flex-shrink text-xs text-gray-500 bg-white px-2">OR</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* Email/Password Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <Input 
                      placeholder="you@example.com" 
                      {...field} 
                      disabled={isLoading || authLoading}
                      className="h-11 sm:h-12 pl-10 sm:pl-12 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors text-gray-900 text-base"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading || authLoading}
                      className="h-11 sm:h-12 pl-10 sm:pl-12 pr-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors text-gray-900 text-base"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading || authLoading}
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
          
          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-sm text-green-600 hover:text-green-500 font-medium"
              onClick={() => setShowForgotPassword(true)}
              disabled={isLoading || authLoading}
            >
              Forgot your password?
            </Button>
          </div>
          
          {/* Sign In Button */}
          <Button
            type="submit"
            className="w-full h-11 sm:h-12 bg-green-600 hover:bg-green-700 font-medium transition-colors text-base"
            disabled={isLoading || authLoading}
          >
            {isLoading || authLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> 
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Sign In
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Mobile Sign Up Link */}
      <div className="text-center text-sm text-gray-600 sm:hidden mt-4">
        Don't have an account?{" "}
        <Link href="/signup" className="text-green-600 hover:text-green-500 font-medium">
          Sign up
        </Link>
      </div>
    </div>
  )
} 