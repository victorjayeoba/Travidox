"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"
import { SocialAuthButton } from "./social-auth-button"

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type SignInValues = z.infer<typeof signInSchema>

interface SignInFormProps {
  onSuccess?: () => void
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { switchToSignUp, login, signInWithGoogle, isLoading: authLoading } = useAuth()
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
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Google sign-in error:", error)
    }
  }

  return (
    <div className="space-y-6 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="you@example.com" 
                    {...field} 
                    disabled={isLoading || authLoading}
                    className="bg-white/80"
                  />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading || authLoading}
                      className="bg-white/80 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading || authLoading}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              variant="link"
              className="h-auto p-0 text-sm text-green-600"
              onClick={() => console.log("Forgot password")}
              disabled={isLoading || authLoading}
            >
              Forgot your password?
            </Button>
          </div>
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading || authLoading}
          >
            {isLoading || authLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 flex-shrink text-xs text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

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
      />

      <div className="text-center">
        <span className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Button
            variant="link"
            className="h-auto p-0 text-green-600 hover:text-green-500 font-medium"
            onClick={switchToSignUp}
            disabled={isLoading || authLoading}
          >
            Sign Up
          </Button>
        </span>
      </div>
    </div>
  )
} 