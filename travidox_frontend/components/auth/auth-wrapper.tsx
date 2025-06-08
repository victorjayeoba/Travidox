"use client"

import { useAuth } from "./auth-provider"
import { AuthModal } from "./auth-modal"

export function AuthWrapper() {
  const { isAuthModalOpen, closeAuthModal, authModalDefaultTab } = useAuth()

  return (
    <AuthModal
      isOpen={isAuthModalOpen}
      onOpenChange={closeAuthModal}
      defaultTab={authModalDefaultTab}
    />
  )
} 