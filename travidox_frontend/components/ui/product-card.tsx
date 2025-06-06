"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  title: string
  description: string
  icon: React.ReactNode
  buttonText: string
  className?: string
  onButtonClick?: () => void
}

export function ProductCard({ title, description, icon, buttonText, className, onButtonClick }: ProductCardProps) {
  return (
    <Card className={cn("h-full border-0 shadow-lg hover:shadow-xl transition-shadow", className)}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-600">{description}</p>
        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={onButtonClick}>
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  )
}
