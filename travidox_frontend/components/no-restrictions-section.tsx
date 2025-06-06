import { Section } from "@/components/ui/section"
import { FeatureCard } from "@/components/ui/feature-card"
import { Gamepad2, Bot, BarChart3 } from "lucide-react"

export function NoRestrictionsSection() {
  return (
    <Section className="bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Trade Your Way</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience trading freedom with interactive learning, automated bots, and unrestricted investment opportunities.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Gamepad2 className="w-12 h-12 text-green-600" />}
          title="Learn While You Earn"
          description="Enjoy a gamified learning experience that rewards you with XP. Use your points to unlock trading opportunities and invest in real stocks."
        />
        <FeatureCard
          icon={<Bot className="w-12 h-12 text-green-600" />}
          title="AI-Powered Trading Bot"
          description="Let our live FX trading bot work for you. Choose full automation or customize your level of control for optimal trading performance."
        />
        <FeatureCard
          icon={<BarChart3 className="w-12 h-12 text-green-600" />}
          title="Unrestricted Stock Trading"
          description="See, buy, sell, and invest in stocks without limitations. Start with as little as $1 and trade 24/7 on your own terms."
        />
      </div>
    </Section>
  )
}
