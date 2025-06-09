"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Marquee from "react-fast-marquee"
import { Section } from "@/components/ui/section"

// Partner data with logos
const partnersData = [
  { name: "Meta Trader", logo: "/meta-trader-logo.png" },
  { name: "Exness", logo: "/exness-icon.png" },
  { name: "Armstocktrade", logo: "/arm-logo.png" },
  { name: "NSE (Nigeria Stock Exchange)", logo: "/NGX-logo.png" },
  { name: "NACOS OAU", logo: "/nacos.png" },
  { name: "Career Impact Now(CIN)", logo: "/cin.png" },
  { name: "GDG Quantitative Finance (OAU) Community", logo: "/GDG.png" },
  // Duplicate partners to create a seamless loop
  { name: "Meta Trader", logo: "/meta-trader-logo.png" },
  { name: "Exness", logo: "/exness-icon.png" },
  { name: "Armstocktrade", logo: "/arm-logo.png" },
  { name: "NSE (Nigeria Stock Exchange)", logo: "/NGX-logo.png" },
  { name: "NACOS OAU", logo: "/nacos.png" },
  { name: "Career Impact Now(CIN)", logo: "/cin.png" },
  { name: "GDG Quantitative Finance (OAU) Community", logo: "/GDG.png" },
]

// Custom CSS for partner stylinsg
const styles = `
  .partner-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    filter: grayscale(1);
    opacity: 0.7;
  }
  .partner-item:hover {
    filter: grayscale(0);
    opacity: 1;
    transform: scale(1.05);
  }
  .partner-logo {
    height: 50px;
    width: auto;
    object-fit: contain;
    margin-bottom: 8px;
  }
  .partner-name {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 12px;
    letter-spacing: 0.03em;
    text-align: center;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
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
    fontLink.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
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
    <Section className="py-10 bg-gradient-to-r from-gray-50 to-green-50 border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-6">
          <div className="h-px bg-gray-200 w-16"></div>
          <h2 className="text-center text-base font-medium text-gray-500 mx-4 uppercase tracking-wider">Trusted by industry leaders</h2>
          <div className="h-px bg-gray-200 w-16"></div>
        </div>
        
        <Marquee
          speed={30}
          gradientWidth={50}
          pauseOnHover={true}
          className="py-4"
          direction="right"
        >
          {partnersData.map((partner, index) => (
            <div key={index} className="flex-shrink-0 px-8">
              <div className="partner-item">
                <div className={partner.name.includes("CIN") ? "relative h-[70px] w-[150px] mb-2" : "relative h-[50px] w-[120px] mb-2"}>
                  <Image 
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    fill
                    sizes={partner.name.includes("CIN") ? "150px" : "120px"}
                    style={{ objectFit: 'contain' }}
                    className={partner.name.includes("CIN") ? "cin-logo" : "partner-logo"}
                  />
                </div>
                <span className="partner-name text-gray-700">
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