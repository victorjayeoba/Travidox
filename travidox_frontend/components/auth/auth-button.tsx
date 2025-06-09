"use client"

import { useState } from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { AuthModal } from "./auth-modal"
import { useAuth } from "./auth-provider"

interface AuthButtonProps extends ButtonProps {
  text?: string
}

export function AuthButton({ text = "Get Started", className, variant = "default", size = "default", ...props }: AuthButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useAuth()
  
  // If user is logged in, redirect to dashboard instead of showing modal
  const handleClick = () => {
    if (user) {
      window.location.href = "/dashboard"
    } else {
      setIsModalOpen(true)
    }
  }
  
  return (
    <>
      <Button 
        onClick={handleClick}
        className={className}
        variant={variant}
        size={size}
        {...props}
      >
        {text}
      </Button>
      
      <AuthModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </>
  )
} 