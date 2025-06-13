"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ArrowLeft, Mail, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "./auth-provider"
import { getAuthErrorMessage, canMakeRequest, getTimeUntilNextRequest } from "@/lib/auth-config"

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

interface ForgotPasswordFormProps {
  onBack?: () => void
  onSuccess?: () => void
}

export function ForgotPasswordForm({ onBack, onSuccess }: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")
  const [lastSubmitTime, setLastSubmitTime] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { resetPassword } = useAuth()

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  // Rate limiting using configuration
  const canSubmit = () => canMakeRequest(lastSubmitTime)
  const getTimeUntilNextSubmit = () => getTimeUntilNextRequest(lastSubmitTime)

  async function onSubmit(data: ForgotPasswordValues) {
    if (!canSubmit()) {
      const waitTime = getTimeUntilNextSubmit()
      toast.error(`Please wait ${waitTime} seconds before requesting another reset email.`)
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      await resetPassword(data.email)
      
      setSubmittedEmail(data.email)
      setIsSuccess(true)
      setLastSubmitTime(Date.now())
      
      toast.success("Password reset email sent successfully!")
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 5000) // Give more time to read the success message
      }
    } catch (error: any) {
      console.error("Forgot password error:", error)
      
      const errorMessage = getAuthErrorMessage(error.code || 'default')
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (!canSubmit()) {
      const waitTime = getTimeUntilNextSubmit()
      toast.error(`Please wait ${waitTime} seconds before requesting another reset email.`)
      return
    }

    if (submittedEmail) {
      await onSubmit({ email: submittedEmail })
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-6 py-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Check your email</h3>
            <p className="text-gray-600 text-sm max-w-sm mx-auto">
              We've sent a password reset link to <strong>{submittedEmail}</strong>. 
              Please check your inbox and follow the instructions.
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
          
          <Button
            onClick={handleResendEmail}
            variant="ghost"
            className="w-full text-green-600 hover:text-green-700"
            disabled={isLoading || !canSubmit()}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : !canSubmit() ? (
              <>Resend email in {getTimeUntilNextSubmit()}s</>
            ) : (
              <>Resend email</>
            )}
          </Button>
          
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>Didn't receive the email? Check your spam folder.</p>
            <p>The reset link will expire in 1 hour for security.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full">
      <div className="space-y-2 text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Forgot your password?</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          No worries! Enter your email address and we'll send you a secure link to reset your password.
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
                    disabled={isLoading}
                      className="h-11 sm:h-12 pl-10 sm:pl-12 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500 text-gray-900 text-base"
                      autoComplete="email"
                      type="email"
                  />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              className="w-full h-11 sm:h-12 bg-green-600 hover:bg-green-700 font-medium text-base"
              disabled={isLoading || !canSubmit()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> 
                  Sending Reset Link...
                </>
              ) : !canSubmit() ? (
                <>Wait {getTimeUntilNextSubmit()}s to resend</>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Send Reset Link
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="w-full text-gray-600 hover:text-gray-900"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </div>
        </form>
      </Form>

      <div className="text-xs text-gray-500 text-center">
        <p>For security, reset links expire after 1 hour.</p>
      </div>
    </div>
  )
} 