"use client"

import { X, ArrowLeft } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogOverlay
} from "@/components/ui/dialog"
import { SignUpForm } from "./sign-up-form"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"

interface SignUpDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function SignUpDialog({ isOpen, onOpenChange }: SignUpDialogProps) {
  const { switchToSignIn } = useAuth()
  
  const handleSignUpSuccess = () => {
    onOpenChange(false)
  }
  
  const handleBackToSignIn = () => {
    onOpenChange(false)
    switchToSignIn()
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-[480px] bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <div className="absolute top-4 left-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleBackToSignIn}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <DialogHeader className="mt-4">
          <DialogTitle className="text-2xl font-bold text-center">Create Your Account</DialogTitle>
          <DialogDescription className="text-center">
            Join thousands of investors building wealth together
          </DialogDescription>
        </DialogHeader>
        <SignUpForm onSuccess={handleSignUpSuccess} switchToSignIn={handleBackToSignIn} />
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