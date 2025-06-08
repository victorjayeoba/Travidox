"use client"

import { useState } from "react"
import { X, TrendingUp } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogOverlay
} from "@/components/ui/dialog"
import { SignInForm } from "./sign-in-form"
import { SignUpForm } from "./sign-up-form"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "./auth-provider"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

type AuthTab = 'signin' | 'signup'

interface AuthModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: AuthTab
}

export function AuthModal({ isOpen, onOpenChange, defaultTab = 'signin' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab)
  const { isLoading } = useAuth()
  
  const handleSuccess = () => {
    onOpenChange(false)
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent className="w-[95vw] max-w-[450px] max-h-[95vh] bg-white backdrop-blur-md border-0 shadow-2xl overflow-y-auto p-0 gap-0 rounded-2xl">
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
        
        {/* Logo and header */}
        <div className="pt-8 pb-2 flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">travidox</span>
          </Link>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as AuthTab)}
          className="w-full"
        >
          <div className="px-6">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger 
                value="signin"
                className="rounded-l-lg data-[state=active]:bg-green-600 data-[state=active]:text-white"
                disabled={isLoading}
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="rounded-r-lg data-[state=active]:bg-green-600 data-[state=active]:text-white"
                disabled={isLoading}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="signin" className="p-6 pt-0 pb-8 m-0">
                <SignInForm onSuccess={handleSuccess} />
              </TabsContent>
              
              <TabsContent value="signup" className="p-6 pt-0 pb-8 m-0">
                <SignUpForm 
                  onSuccess={handleSuccess} 
                  switchToSignIn={() => setActiveTab('signin')} 
                />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
        
        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100 text-xs text-gray-500 rounded-b-2xl">
          By continuing, you agree to our{" "}
          <Link href="/legal/terms" className="text-green-600 hover:text-green-500">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="text-green-600 hover:text-green-500">
            Privacy Policy
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
} 