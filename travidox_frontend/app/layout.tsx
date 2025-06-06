import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Travidox - Dream, Invest, Live",
  description:
    "Start your investment journey with Travidox. Build wealth through smart investing with no restrictions and complete freedom.",
  keywords: "investment, stocks, ETFs, trading, wealth building, financial freedom",
  authors: [{ name: "Travidox" }],
  openGraph: {
    title: "Travidox - Dream, Invest, Live",
    description:
      "Start your investment journey with Travidox. Build wealth through smart investing with no restrictions and complete freedom.",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
