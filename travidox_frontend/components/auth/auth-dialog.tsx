"use client"

import { X, ArrowLeft } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogOverlay
} from "@/components/ui/dialog"
import { SignInForm } from "./sign-in-form"
import { Button } from "@/components/ui/button"

interface AuthDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false)
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent className="w-[95vw] max-w-[420px] max-h-[95vh] bg-white backdrop-blur-md border-0 shadow-2xl overflow-y-auto p-0 gap-0">
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
          <SignInForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  )
} 