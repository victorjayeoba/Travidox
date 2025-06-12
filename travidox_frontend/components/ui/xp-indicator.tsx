"use client"

import { useState, useEffect, useRef } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUserProfile, XP_BALANCE_UPDATE_EVENT } from '@/hooks/useUserProfile'
import { useAuth } from '@/components/auth/auth-provider'

interface XpChangePopup {
  id: number;
  value: number;
}

interface XpIndicatorProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export function XpIndicator({ className, variant = 'default' }: XpIndicatorProps) {
  const { user } = useAuth()
  const { profile } = useUserProfile()
  const [xpValue, setXpValue] = useState(0)
  const [animateStar, setAnimateStar] = useState(false)
  const [animateValue, setAnimateValue] = useState(false)
  const [popups, setPopups] = useState<XpChangePopup[]>([])
  const prevXpRef = useRef<number | null>(null)
  const popupIdCounter = useRef(0)
  
  // Initialize XP from profile and listen for updates
  useEffect(() => {
    if (profile && typeof profile.xp === 'number') {
      // Only set initial value if we don't have one yet
      if (prevXpRef.current === null) {
        setXpValue(profile.xp)
        prevXpRef.current = profile.xp
      } else if (profile.xp !== prevXpRef.current) {
        // Handle XP change
        const diff = profile.xp - prevXpRef.current
        handleXpChange(profile.xp, diff)
        prevXpRef.current = profile.xp
      }
    }
    
    // Create a handler for XP update events
    const handleXpUpdate = () => {
      if (user) {
        const storedProfile = localStorage.getItem(`userProfile_${user.uid}`)
        if (storedProfile) {
          try {
            const parsedProfile = JSON.parse(storedProfile)
            if (parsedProfile && typeof parsedProfile.xp === 'number') {
              // Calculate difference for animation
              const oldXp = prevXpRef.current !== null ? prevXpRef.current : 0
              const diff = parsedProfile.xp - oldXp
              handleXpChange(parsedProfile.xp, diff)
              prevXpRef.current = parsedProfile.xp
            }
          } catch (error) {
            console.error('Error parsing stored profile:', error)
          }
        }
      }
    }
    
    // Listen for XP update events
    window.addEventListener(XP_BALANCE_UPDATE_EVENT, handleXpUpdate)
    
    // Cleanup
    return () => {
      window.removeEventListener(XP_BALANCE_UPDATE_EVENT, handleXpUpdate)
    }
  }, [profile, user])
  
  // Handle XP change with animations
  const handleXpChange = (newValue: number, diff: number) => {
    // Don't animate if this is the first value set (initial load)
    if (prevXpRef.current === null) {
      setXpValue(newValue)
      return
    }
    
    // Update the XP value
    setXpValue(newValue)
    
    // Only animate if there's an actual change
    if (diff === 0) return
    
    // Animate star
    setAnimateStar(true)
    setTimeout(() => setAnimateStar(false), 1000)
    
    // Animate value
    setAnimateValue(true)
    setTimeout(() => setAnimateValue(false), 800)
    
    // Add popup notification
    const newPopup = {
      id: popupIdCounter.current++,
      value: diff
    }
    
    setPopups(prev => [...prev, newPopup])
    
    // Remove popup after animation completes
    setTimeout(() => {
      setPopups(prev => prev.filter(popup => popup.id !== newPopup.id))
    }, 1500)
  }
  
  return (
    <div 
      className={cn(
        "xp-container flex items-center gap-1.5 text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-full",
        variant === 'compact' && "px-2 py-0.5",
        className
      )}
    >
      <Star 
        size={variant === 'compact' ? 14 : 16} 
        className={cn(
          "fill-yellow-500 text-yellow-500",
          animateStar && "xp-star-animated"
        )} 
      />
      <span 
        className={cn(
          "font-medium",
          variant === 'compact' ? "text-xs" : "text-sm",
          animateValue && "xp-updated"
        )}
      >
        {xpValue.toFixed(2)} XP
      </span>
      
      {/* XP Change Popups */}
      {popups.map(popup => (
        <div 
          key={popup.id} 
          className={cn(
            "xp-popup",
            popup.value > 0 ? "increase" : "decrease"
          )}
        >
          {popup.value > 0 ? `+${popup.value.toFixed(2)}` : popup.value.toFixed(2)}
        </div>
      ))}
    </div>
  )
} 