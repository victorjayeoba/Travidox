"use client"

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

export function PartnersSection() {
  return (
    <Section className="py-10 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-6">
          <div className="h-px bg-gray-200 w-16"></div>
          <h2 className="text-center text-base font-medium text-grey-text mx-4 uppercase tracking-wider">Trusted by industry leaders</h2>
          <div className="h-px bg-gray-200 w-16"></div>
        </div>
        
        <Marquee
          speed={30}
          gradient={true}
          gradientColor="white"
          gradientWidth={50}
          pauseOnHover={true}
          className="py-4"
        >
          {partnersData.map((partner, index) => (
            <div key={index} className="mx-8 text-center">
              <div className="relative h-12 w-32 transition-transform duration-300 ease-in-out hover:scale-105">
                <Image 
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  fill
                  sizes="128px"
                  className="object-contain filter grayscale hover:grayscale-0 opacity-70 hover:opacity-100"
                />
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </Section>
  )
}