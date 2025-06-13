"use client"

import { Section } from "@/components/ui/section"
import { useAuth } from "./auth/auth-provider"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/ui/logo"

export function HeroSection() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const handleCTAClick = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/signup');
    }
  };
  
  return (
    <Section className="bg-lemon-green-milk py-20 lg:py-32">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-grey-heading leading-tight">
              Secure and Simple
              <br />
              Investing for
              <br />
              <span className="text-lemon-green">Nigerians</span>
            </h1>
            <p className="text-xl text-grey-text leading-relaxed max-w-lg">
              Start your investment journey with Travidox. Build wealth through smart investing with no restrictions and
              complete freedom.
            </p>
          </div>

          <Button 
            onClick={handleCTAClick}
            size="lg" 
            className="bg-lemon-green hover:bg-opacity-90 text-white text-lg px-8 py-4 rounded-full"
          >
            {isAuthenticated ? "View Dashboard" : "Start Investing Now"}
          </Button>
        </div>

        <div className="relative">
          <video
            className="rounded-3xl w-full"
            src="/Travidox_video.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>
    </Section>
  )
}
