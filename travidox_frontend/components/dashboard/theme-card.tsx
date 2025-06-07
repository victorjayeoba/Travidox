"use client"

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

interface ThemeCardProps {
  title: string
  description: string
  href: string
  icon?: string
}

export function ThemeCard({
  title,
  description,
  href,
  icon
}: ThemeCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow h-full">
        <CardContent className="p-4 flex items-start space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
            {icon ? (
              <img src={icon} alt={title} className="w-8 h-8 object-contain" />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
            )}
          </div>
          
          <div className="space-y-1 flex-1">
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 