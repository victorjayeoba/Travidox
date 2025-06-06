"use client"

import { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SocialAuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  provider: string
  isLoading?: boolean
}

export function SocialAuthButton({
  icon,
  provider,
  isLoading = false,
  className,
  disabled,
  ...props
}: SocialAuthButtonProps) {
  return (
    <button
      className={cn(
        "relative flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {icon}
      <span>Continue with {provider}</span>
    </button>
  )
} 