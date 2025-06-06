import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { PartnersSection } from "@/components/partners-section"
import { NoRestrictionsSection } from "@/components/no-restrictions-section"
import { InvestFractionsSection } from "@/components/invest-fractions-section"
import { LearnBasicsSection } from "@/components/learn-basics-section"
import { SecuritySection } from "@/components/security-section"
import { TradingBotSection } from "@/components/trading-bot-section"
import { SecurityAwarenessSection } from "@/components/security-awareness-section"
import { MarketsSection } from "@/components/markets-section"
import { StatsSection } from "@/components/stats-section"
import { AIInsightsSection } from "@/components/ai-insights-section"
import { CommunitySection } from "@/components/community-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <PartnersSection />
        <NoRestrictionsSection />
        <InvestFractionsSection />
        <LearnBasicsSection />
        <SecuritySection />
        <TradingBotSection />
        <MarketsSection id="markets" />
        <SecurityAwarenessSection id="security" />
        <StatsSection />
        <AIInsightsSection />
        <CommunitySection id="community" />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
