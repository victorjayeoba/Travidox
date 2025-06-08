import React from 'react'
import { cn } from '@/lib/utils'

interface DashboardCardProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  className?: string
  contentClassName?: string
  children: React.ReactNode
  fullWidth?: boolean
}

export function DashboardCard({
  title,
  description,
  icon,
  actions,
  className,
  contentClassName,
  children,
  fullWidth = false,
}: DashboardCardProps) {
  return (
    <div className={cn(
      'bg-white rounded-lg border border-gray-200 shadow-sm',
      fullWidth ? 'w-full' : '',
      className
    )}>
      {(title || description || icon || actions) && (
        <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex-shrink-0 text-gray-500">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex-shrink-0 flex items-center ml-4">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className={cn('p-4 sm:p-5', contentClassName)}>
        {children}
      </div>
    </div>
  )
}

export function DashboardCardGrid({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
      className
    )}>
      {children}
    </div>
  )
} 