import React from 'react'
import { cn } from '@/lib/utils'

interface StatItemProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  change?: {
    value: string | number
    positive?: boolean
  }
  className?: string
}

export function StatItem({ title, value, icon, change, className }: StatItemProps) {
  return (
    <div className={cn(
      "flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow-sm",
      className
    )}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        {icon && (
          <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-2">
        <span className="text-2xl font-semibold text-gray-900">{value}</span>
        {change && (
          <span className={cn(
            "ml-2 text-sm font-medium",
            change.positive ? "text-green-600" : "text-red-600"
          )}>
            {change.positive && '+'}{change.value}
          </span>
        )}
      </div>
    </div>
  )
}

interface StatsGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

export function StatsGrid({ children, columns = 4, className }: StatsGridProps) {
  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={cn(
      `grid gap-4 ${colClasses[columns]}`,
      className
    )}>
      {children}
    </div>
  )
} 