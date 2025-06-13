import { Section } from "@/components/ui/section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, Bot, BarChart3 } from "lucide-react"

export function NoRestrictionsSection() {
  return (
    <Section className="bg-lemon-green-milk py-20 lg:py-28">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-grey-heading mb-4">Trade Your Way</h2>
        <p className="text-xl text-grey-text max-w-3xl mx-auto">
          Experience trading freedom with interactive learning, automated bots, and unrestricted investment opportunities.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Gamepad2 className="w-8 h-8 text-brand-green" />}
          title="Learn While You Earn"
          description="Enjoy a gamified learning experience that rewards you with XP. Use your points to unlock trading opportunities and invest in real stocks."
        />
        <FeatureCard
          icon={<Bot className="w-8 h-8 text-brand-green" />}
          title="AI-Powered Trading Bot"
          description="Let our live FX trading bot work for you. Choose full automation or customize your level of control for optimal trading performance."
        />
        <FeatureCard
          icon={<BarChart3 className="w-8 h-8 text-brand-green" />}
          title="Unrestricted Stock Trading"
          description="See, buy, sell, and invest in stocks without limitations. Start with as little as Naira100 and trade 24/7 on your own terms."
        />
      </div>
    </Section>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-white/60 backdrop-blur-sm border-gray-200/80 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
      <CardHeader className="flex flex-col items-center text-center">
        <div className="bg-white rounded-full p-4 mb-4 transition-transform duration-300 group-hover:scale-110 shadow-md">
          {icon}
        </div>
        <CardTitle className="text-xl font-bold text-grey-heading">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-grey-text">{description}</p>
      </CardContent>
    </Card>
  )
}
