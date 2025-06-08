import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  action?: {
    label: string
    href?: string
    onClick?: () => void
    icon?: React.ReactNode
    variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive'
  }
  className?: string
}

export function PageHeader({
  title,
  description,
  children,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between",
      className
    )}>
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      
      {children && (
        <div className="mt-2 sm:mt-0">
          {children}
        </div>
      )}
      
      {action && (
        <div className="mt-2 sm:mt-0">
          <Button
            variant={action.variant || 'default'}
            onClick={action.onClick}
            className="w-full sm:w-auto"
            size="sm"
            asChild={!!action.href}
          >
            {action.href ? (
              <a href={action.href} className="flex items-center">
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </a>
            ) : (
              <>
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
} 