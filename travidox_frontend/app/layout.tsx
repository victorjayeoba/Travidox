import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Toaster } from "sonner"
import NextTopLoader from "nextjs-toploader"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Travidox - Smart Investing for Nigerians",
    template: "%s | Travidox"
  },
  description: "Empowering Nigerians to build wealth through smart investing in local and global markets. Trade stocks, earn XP, get certified, and grow your portfolio with AI-powered tools.",
  keywords: ["investing", "Nigeria", "stocks", "trading", "portfolio", "wealth building", "financial education"],
  authors: [{ name: "Travidox Team" }],
  creator: "Travidox",
  publisher: "Travidox",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://travidox.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Travidox - Smart Investing for Nigerians",
    description: "Empowering Nigerians to build wealth through smart investing in local and global markets.",
    url: "https://travidox.com",
    siteName: "Travidox",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Travidox - Smart Investing Platform",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travidox - Smart Investing for Nigerians",
    description: "Empowering Nigerians to build wealth through smart investing in local and global markets.",
    images: ["/logo.png"],
    creator: "@travidox",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader 
          color="#1DB954"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #1DB954,0 0 5px #1DB954"
        />
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
