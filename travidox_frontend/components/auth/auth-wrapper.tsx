"use client"

import { useAuth } from "./auth-provider"
import { AuthDialog } from "./auth-dialog"

export function AuthWrapper() {
  const { isAuthDialogOpen, setIsAuthDialogOpen } = useAuth()
  
  return (
    <AuthDialog 
      isOpen={isAuthDialogOpen} 
      onOpenChange={setIsAuthDialogOpen}
    />
  )
} 