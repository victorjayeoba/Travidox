import { Section } from "@/components/ui/section"
import { Users, TrendingUp, Shield } from "lucide-react"
import { Card } from "@/components/ui/card"

const stats = [
  { icon: <Users className="w-8 h-8 text-brand-green" />, value: "50K+", label: "Registered Users" },
  { icon: <TrendingUp className="w-8 h-8 text-brand-green" />, value: "₦1.5B+", label: "Assets Managed" },
  { icon: <Shield className="w-8 h-8 text-brand-green" />, value: "99.9%", label: "Uptime Reliability" },
]

export function StatsSection() {
  return (
    <Section className="bg-lemon-green-milk py-20 lg:py-28">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-grey-heading mb-4">
            Helping Africans Build Actual Wealth
          </h2>
          <p className="text-xl text-grey-text max-w-3xl mx-auto">
            Across the continent, we empower individuals to take control of their financial future with tools and insights that make a real difference.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-6 shadow-md">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold text-grey-heading">{stat.value}</h3>
              <p className="text-grey-text mt-2">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  )
}
