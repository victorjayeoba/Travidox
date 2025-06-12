"use client"

import { useState } from "react"
import { X } from "lucide-react"
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
import { Logo } from "@/components/ui/logo"

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
      <DialogOverlay className="bg-black/60 backdrop-blur-sm fixed inset-0 transition-all duration-300" />
      <DialogContent className="w-[95vw] sm:w-[500px] md:w-[550px] max-h-[95vh] bg-white backdrop-blur-md border-0 shadow-2xl overflow-y-auto p-0 gap-0 rounded-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full h-full"
        >
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
          <div className="pt-6 pb-4 flex justify-center">
            <Logo href="/" size="md" />
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as AuthTab)}
            className="w-full"
          >
            <div className="px-6 sm:px-8">
              <TabsList className="grid grid-cols-2 w-full mb-4 shadow-sm h-10">
                <TabsTrigger 
                  value="signin"
                  className="rounded-l-lg data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all duration-200"
                  disabled={isLoading}
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="rounded-r-lg data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all duration-200"
                  disabled={isLoading}
                >
                  Join Us
                </TabsTrigger>
              </TabsList>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="signin" className="p-6 sm:p-8 pt-0 pb-6 m-0">
                  <SignInForm onSuccess={handleSuccess} />
                </TabsContent>
                
                <TabsContent value="signup" className="p-6 sm:p-8 pt-0 pb-6 m-0">
                  <SignUpForm 
                    onSuccess={handleSuccess} 
                    switchToSignIn={() => setActiveTab('signin')} 
                  />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
          
          {/* Footer */}
          <div className="bg-gray-50/80 p-3 text-center border-t border-gray-100 text-xs text-gray-500 rounded-b-xl">
            By continuing, you agree to our{" "}
            <Link href="/legal/terms" className="text-green-600 hover:text-green-500 transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="text-green-600 hover:text-green-500 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
} 