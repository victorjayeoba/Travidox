"use client"

import React from 'react'

interface SignatureProps {
  name: string
  style?: 'formal' | 'elegant' | 'modern'
  className?: string
}

export const Signature: React.FC<SignatureProps> = ({ 
  name, 
  style = 'elegant', 
  className = "" 
}) => {
  // Generate signature paths based on the name and style
  const generateSignaturePath = (text: string, styleType: string) => {
    const baseHeight = 60
    const baseWidth = Math.max(200, text.length * 12)
    
    if (styleType === 'elegant') {
      // Elegant flowing signature style
      if (text.toLowerCase().includes('sarah')) {
        return {
          width: 220,
          height: 80,
          path: "M15,50 Q25,30 40,45 Q55,60 70,40 Q85,20 100,50 Q115,70 130,45 Q145,25 160,50 Q175,65 190,45 Q200,35 210,50",
          underline: "M15,65 Q110,70 210,60"
        }
      } else if (text.toLowerCase().includes('michael')) {
        return {
          width: 240,
          height: 80,
          path: "M20,45 Q30,25 45,50 Q60,70 80,35 Q100,15 120,55 Q140,75 160,40 Q180,20 200,50 Q215,65 230,45",
          underline: "M20,68 Q125,72 230,62"
        }
      } else {
        // Generic elegant signature for "Travidox"
        return {
          width: 260,
          height: 90,
          path: "M25,55 Q35,25 55,50 Q70,75 90,35 Q110,15 135,60 Q155,80 180,30 Q200,10 225,55 Q240,75 255,45",
          underline: "M25,75 Q140,82 255,70",
          flourish: "M20,50 Q15,40 25,35 Q35,30 30,40"
        }
      }
    } else if (styleType === 'formal') {
      // More formal, business-like signature
      return {
        width: baseWidth,
        height: baseHeight,
        path: `M15,40 Q${baseWidth/4},30 ${baseWidth/2},45 Q${3*baseWidth/4},60 ${baseWidth-15},40`,
        underline: `M15,55 L${baseWidth-15},55`
      }
    } else {
      // Modern, simple signature
      return {
        width: baseWidth,
        height: baseHeight,
        path: `M15,35 Q${baseWidth/3},25 ${2*baseWidth/3},45 Q${baseWidth-20},55 ${baseWidth-15},35`,
        underline: `M15,50 Q${baseWidth/2},52 ${baseWidth-15},48`
      }
    }
  }

  const signatureData = generateSignaturePath(name, style)

  return (
    <div className={`inline-block ${className}`}>
      <svg 
        width={signatureData.width} 
        height={signatureData.height} 
        viewBox={`0 0 ${signatureData.width} ${signatureData.height}`}
        className="max-w-full h-auto"
      >
        <defs>
          <filter id="ink-effect">
            <feTurbulence baseFrequency="0.9" numOctaves="3" result="turbulence"/>
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="1"/>
          </filter>
        </defs>
        
        {/* Main signature stroke */}
        <path
          d={signatureData.path}
          stroke="#1a365d"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ink-effect)"
          opacity="0.9"
        />
        
        {/* Underline if present */}
        {signatureData.underline && (
          <path
            d={signatureData.underline}
            stroke="#1a365d"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        )}
        
        {/* Flourish if present */}
        {signatureData.flourish && (
          <path
            d={signatureData.flourish}
            stroke="#1a365d"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
        )}
        
        {/* Subtle ink dots for realism */}
        <circle cx="20" cy="45" r="0.5" fill="#1a365d" opacity="0.3"/>
        <circle cx={signatureData.width - 25} cy="50" r="0.3" fill="#1a365d" opacity="0.2"/>
      </svg>
    </div>
  )
}

// Predefined signatures for consistency
export const TravidoxSignature: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`inline-block ${className}`}>
    <svg 
      width="280" 
      height="100" 
      viewBox="0 0 280 100"
      className="max-w-full h-auto"
    >
      <defs>
        <filter id="stamp-effect">
          <feTurbulence baseFrequency="0.8" numOctaves="2" result="turbulence"/>
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="0.5"/>
        </filter>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      
      {/* Company signature with flourishes */}
      <path
        d="M20,60 Q35,25 60,50 Q85,75 110,35 Q135,15 165,60 Q190,80 220,30 Q245,10 270,55"
        stroke="url(#goldGradient)"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#stamp-effect)"
        opacity="0.9"
      />
      
      {/* Elegant underline with curves */}
      <path
        d="M20,75 Q70,82 140,78 Q210,74 260,80"
        stroke="url(#goldGradient)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      
      {/* Left flourish */}
      <path
        d="M15,55 Q10,45 20,40 Q30,35 25,45 Q20,50 15,55"
        stroke="url(#goldGradient)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      
      {/* Right flourish */}
      <path
        d="M265,55 Q270,45 260,40 Q250,35 255,45 Q260,50 265,55"
        stroke="url(#goldGradient)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      
      {/* Decorative dots */}
      <circle cx="25" cy="50" r="1" fill="#f59e0b" opacity="0.6"/>
      <circle cx="255" cy="60" r="0.8" fill="#f59e0b" opacity="0.5"/>
      <circle cx="140" cy="45" r="0.6" fill="#f59e0b" opacity="0.4"/>
    </svg>
  </div>
)

export const CEOSignature: React.FC<{ className?: string }> = ({ className }) => (
  <Signature name="Sarah Johnson" style="elegant" className={className} />
)

export const DirectorSignature: React.FC<{ className?: string }> = ({ className }) => (
  <Signature name="Michael Chen" style="elegant" className={className} />
) 