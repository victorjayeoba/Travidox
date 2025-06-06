"use client"

import { Button, ButtonProps } from "@/components/ui/button"
import { useAuth } from "./auth-provider"

interface AuthButtonProps extends ButtonProps {
  label?: string;
}

export function AuthButton({ label = "Get Started", className, ...props }: AuthButtonProps) {
  const { isAuthenticated, openAuthDialog, logout } = useAuth()
  
  if (isAuthenticated) {
    return (
      <Button
        onClick={logout}
        className={className}
        {...props}
      >
        Sign Out
      </Button>
    )
  }
  
  return (
    <Button
      onClick={openAuthDialog}
      className={className}
      {...props}
    >
      {label}
    </Button>
  )
} 