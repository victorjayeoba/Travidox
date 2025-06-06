"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogOverlay
} from "@/components/ui/dialog"
import { SignInForm } from "./sign-in-form"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"

interface AuthDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {
  const { switchToSignUp } = useAuth()
  
  const handleSuccess = () => {
    onOpenChange(false)
  }
  
  const handleSwitchToSignUp = () => {
    onOpenChange(false)
    switchToSignUp()
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome Back</DialogTitle>
          <DialogDescription className="text-center">
            Sign in to your account to continue your investment journey
          </DialogDescription>
        </DialogHeader>
        <SignInForm onSuccess={handleSuccess} />
        <div className="absolute top-2 right-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full" 
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 