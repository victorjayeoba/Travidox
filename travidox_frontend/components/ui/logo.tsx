"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  variant?: "default" | "white" | "dark"
  className?: string
  href?: string
  showText?: boolean
  textClassName?: string
}

const sizeClasses = {
  xs: "w-5 h-5",
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
  xl: "w-12 h-12"
}

const textSizeClasses = {
  xs: "text-sm",
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl"
}

export function Logo({ 
  size = "md", 
  variant = "default",
  className,
  href,
  showText = true,
  textClassName
}: LogoProps) {
  const logoElement = (
    <div className={cn("flex items-center space-x-3 sm:space-x-2", className)}>
      <div className="relative">
        <Image
          src="/logo.png"
          alt="Travidox Logo"
          width={48}
          height={48}
          className={cn(
            sizeClasses[size],
            "object-contain transition-transform duration-200",
            variant === "white" && "brightness-0 invert",
            variant === "dark" && "brightness-0"
          )}
          priority
        />
      </div>
      {showText && (
        <span 
          className={cn(
            "font-bold",
            textSizeClasses[size],
            variant === "white" ? "text-white" : 
            variant === "dark" ? "text-gray-900" : "text-gray-900",
            textClassName
          )}
        >
          Travidox
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="transition-transform hover:scale-105">
        {logoElement}
      </Link>
    )
  }

  return logoElement
} 