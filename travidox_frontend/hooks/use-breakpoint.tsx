import { useState, useEffect } from 'react'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const breakpointValues = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs')
  const [width, setWidth] = useState<number>(0)
  
  useEffect(() => {
    // Set initial values
    const handleResize = () => {
      const currentWidth = window.innerWidth
      setWidth(currentWidth)
      
      if (currentWidth >= breakpointValues['2xl']) {
        setBreakpoint('2xl')
      } else if (currentWidth >= breakpointValues.xl) {
        setBreakpoint('xl')
      } else if (currentWidth >= breakpointValues.lg) {
        setBreakpoint('lg')
      } else if (currentWidth >= breakpointValues.md) {
        setBreakpoint('md')
      } else if (currentWidth >= breakpointValues.sm) {
        setBreakpoint('sm')
      } else {
        setBreakpoint('xs')
      }
    }
    
    // Initial calculation
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const isAbove = (bp: Breakpoint) => width >= breakpointValues[bp]
  const isBelow = (bp: Breakpoint) => width < breakpointValues[bp]
  
  return {
    breakpoint,
    width,
    isAbove,
    isBelow,
    isMobile: isBelow('md'),
    isTablet: isAbove('md') && isBelow('lg'),
    isDesktop: isAbove('lg')
  }
} 