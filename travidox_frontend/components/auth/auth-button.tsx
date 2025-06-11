"use client"

import { useRouter } from "next/navigation"
import { Button, ButtonProps } from "@/components/ui/button"
import { useAuth } from "./auth-provider"

interface AuthButtonProps extends ButtonProps {
  text?: string
  defaultRoute?: 'login' | 'signup'
}

export function AuthButton({ text = "Get Started", defaultRoute = "signup", className, variant = "default", size = "default", ...props }: AuthButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  
  // If user is logged in, redirect to dashboard instead of showing modal
  const handleClick = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push(`/${defaultRoute}`)
    }
  }
  
  return (
    <Button 
      onClick={handleClick}
      className={className}
      variant={variant}
      size={size}
      {...props}
    >
      {text}
    </Button>
  )
} 