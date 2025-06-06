"use client"

import { useEffect, useState } from "react"
import Marquee from "react-fast-marquee"
import { Section } from "@/components/ui/section"

// Partner names data
const partnersData = [
  { name: "Meta Trader" },
  { name: "Exness" },
  { name: "Armstocktrade" },
  { name: "NSE (Nigeria Stock Exchange)" },
  { name: "NACOSOAU" },
  // Duplicate partners to create a seamless loop
  { name: "Meta Trader" },
  { name: "Exness" },
  { name: "Armstocktrade" },
  { name: "NSE (Nigeria Stock Exchange)" },
  { name: "NACOSOAU" },
]

// Custom CSS for partner styling
const styles = `
  .partner-name {
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    letter-spacing: 0.05em;
    transition: all 0.3s ease;
    filter: grayscale(1);
    opacity: 0.7;
  }
  .partner-name:hover {
    filter: grayscale(0);
    opacity: 1;
    transform: scale(1.05);
  }
`

export function PartnersSection() {
  const [mounted, setMounted] = useState(false)

  // Only run on client-side to avoid hydration errors
  useEffect(() => {
    setMounted(true)
    
    // Inject the CSS for styling and fonts
    const styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
    
    // Add Google Fonts if needed
    const fontLink = document.createElement("link")
    fontLink.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
    fontLink.rel = "stylesheet"
    document.head.appendChild(fontLink)

    return () => {
      document.head.removeChild(styleSheet)
      if (document.head.contains(fontLink)) {
        document.head.removeChild(fontLink)
      }
    }
  }, [])

  if (!mounted) return null

  return (
    <Section className="py-6 bg-gradient-to-r from-gray-50 to-green-50 border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-4">
          <div className="h-px bg-gray-200 w-16"></div>
          <h2 className="text-center text-base font-medium text-gray-500 mx-4 uppercase tracking-wider">Trusted by industry leaders</h2>
          <div className="h-px bg-gray-200 w-16"></div>
        </div>
        
        <Marquee
          speed={40}
          gradientWidth={50}
          pauseOnHover={true}
          className="py-4"
        >
          {partnersData.map((partner, index) => (
            <div key={index} className="flex-shrink-0 px-8">
              <div className="flex items-center justify-center h-16">
                <span 
                  className="partner-name text-xl md:text-2xl text-gray-700"
                >
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </Section>
  )
}