"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CardSectionProps {
  title: string
  description: string
  image?: string
  linkText?: string
  linkUrl?: string
  backgroundColor?: string
  textColor?: string
  children?: React.ReactNode
}

export function CardSection({
  title,
  description,
  image,
  linkText = "Get Started",
  linkUrl = "#",
  backgroundColor = "bg-blue-600",
  textColor = "text-white",
  children
}: CardSectionProps) {
  return (
    <Card className={`overflow-hidden ${backgroundColor} ${textColor} border-0 shadow-md`}>
      <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
          
          <div className="pt-2">
            <Link href={linkUrl}>
              <Button 
                variant="ghost" 
                className={`p-0 hover:bg-transparent hover:underline ${textColor} flex items-center gap-2`}
              >
                {linkText}
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
        
        {image && (
          <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
            <img src={image} alt={title} className="w-full h-full object-contain" />
          </div>
        )}
        
        {children}
      </CardContent>
    </Card>
  )
} 