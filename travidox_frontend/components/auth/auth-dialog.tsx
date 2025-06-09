"use client"

import { useState } from "react"
import { X, ArrowLeft } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogOverlay
} from "@/components/ui/dialog"
import { SignInForm } from "./sign-in-form"
import { SignUpForm } from "./sign-up-form"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"

interface AuthDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {
  const { authMode, switchToSignIn, switchToSignUp } = useAuth()
  
  const handleSuccess = () => {
    onOpenChange(false)
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm fixed inset-0 transition-all duration-300" />
      <DialogContent className="w-[95vw] max-w-[420px] max-h-[95vh] bg-white backdrop-blur-md border-0 shadow-2xl overflow-y-auto p-0 gap-0 rounded-2xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300">
        <div className="absolute top-3 right-3 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-gray-100/80 hover:bg-gray-200/80 transition-colors" 
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6 pb-8">
          {authMode === 'signIn' ? (
            <SignInForm 
              onSuccess={handleSuccess} 
              onSwitchToSignUp={switchToSignUp} 
            />
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 -ml-2 transition-all duration-200 hover:bg-gray-100"
                onClick={switchToSignIn}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to login
              </Button>
              <SignUpForm 
                onSuccess={handleSuccess} 
                onSwitchToSignIn={switchToSignIn} 
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 