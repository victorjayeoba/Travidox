"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./auth/auth-provider"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"

const texts = ["Nigerians", "Young Individuals", "Financial Enthusiasts"]

export function HeroSection() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000); // Change text every 3 seconds
    return () => clearInterval(interval);
  }, []);
  
  const handleCTAClick = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/signup');
    }
  };
  
  return (
    <section className="bg-lemon-green-milk py-20 lg:py-32">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-grey-heading leading-tight h-48">
              Secure and Simple
              <br />
              Investing for
              <br />
              <span className="text-brand-green">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={texts[index]}
                    initial={{ opacity: 0, y: 20, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, rotateX: 90 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block"
                  >
                    {texts[index]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
            <p className="text-xl text-grey-text leading-relaxed max-w-lg">
              Start your investment journey with Travidox. Build wealth through smart investing with no restrictions and
              complete freedom.
            </p>
          </div>

          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="bg-brand-green hover:bg-brand-green-dark text-white text-lg px-8 py-4 rounded-full transition-transform duration-300 ease-in-out hover:scale-105"
              >
                View Dashboard
              </Button>
            </Link>
          ) : (
            <Button 
              onClick={handleCTAClick}
              size="lg" 
              className="bg-brand-green hover:bg-brand-green-dark text-white text-lg px-8 py-4 rounded-full transition-transform duration-300 ease-in-out hover:scale-105"
            >
              Start Investing Now
            </Button>
          )}
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-600 rounded-3xl blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <video
            className="relative rounded-3xl w-full"
            src="/travidox_video.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>
    </section>
  )
}
