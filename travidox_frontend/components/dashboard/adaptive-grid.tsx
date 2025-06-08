import React from 'react'
import { cn } from '@/lib/utils'

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6

interface AdaptiveGridProps {
  children: React.ReactNode
  mobileColumns?: GridColumns
  tabletColumns?: GridColumns 
  desktopColumns?: GridColumns
  largeDesktopColumns?: GridColumns
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function AdaptiveGrid({
  children,
  mobileColumns = 1,
  tabletColumns = 2,
  desktopColumns = 3,
  largeDesktopColumns = desktopColumns,
  gap = 'md',
  className
}: AdaptiveGridProps) {
  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }

  const generateGridCols = (cols: GridColumns) => {
    return {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6'
    }[cols]
  }

  return (
    <div className={cn(
      'grid',
      generateGridCols(mobileColumns),
      tabletColumns && `sm:${generateGridCols(tabletColumns)}`,
      desktopColumns && `md:${generateGridCols(desktopColumns)}`,
      largeDesktopColumns && `lg:${generateGridCols(largeDesktopColumns)}`,
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

interface GridItemProps {
  children: React.ReactNode
  colSpan?: {
    mobile?: GridColumns
    tablet?: GridColumns
    desktop?: GridColumns
    largeDesktop?: GridColumns
  }
  className?: string
}

export function GridItem({
  children,
  colSpan = {},
  className
}: GridItemProps) {
  const { mobile, tablet, desktop, largeDesktop } = colSpan

  const generateColSpan = (cols?: GridColumns) => {
    if (!cols) return ''
    return {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      5: 'col-span-5',
      6: 'col-span-6'
    }[cols]
  }

  return (
    <div className={cn(
      mobile && generateColSpan(mobile),
      tablet && `sm:${generateColSpan(tablet)}`,
      desktop && `md:${generateColSpan(desktop)}`,
      largeDesktop && `lg:${generateColSpan(largeDesktop)}`,
      className
    )}>
      {children}
    </div>
  )
} 