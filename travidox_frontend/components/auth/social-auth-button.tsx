"use client"

import { ButtonHTMLAttributes, ReactNode } from "react"
import { Loader2 } from "lucide-react"
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
        "relative flex w-full items-center justify-center gap-2 sm:gap-3 rounded-lg border border-gray-200 bg-white px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:shadow-sm active:scale-[0.98] touch-manipulation",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
      ) : (
        icon
      )}
      <span>
        {isLoading ? "Please wait..." : `Continue with ${provider}`}
      </span>
    </button>
  )
} 