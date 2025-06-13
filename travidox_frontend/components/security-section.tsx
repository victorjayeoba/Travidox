import { Section } from "@/components/ui/section"
import { Trophy, Star, Gift, Medal } from "lucide-react"

const gamifiedFeatures = [
  {
    icon: <Trophy className="w-6 h-6 text-brand-green" />,
    title: "XP Rewards System",
    description: "Earn experience points for completing lessons, quizzes, and successful trades.",
  },
  {
    icon: <Star className="w-6 h-6 text-brand-green" />,
    title: "Achievement Badges",
    description: "Unlock badges as you master new trading concepts and strategies.",
  },
  {
    icon: <Gift className="w-6 h-6 text-brand-green" />,
    title: "Redeem XP for Assets",
    description: "Convert your earned XP into fractional shares or trading credits.",
  },
  {
    icon: <Medal className="w-6 h-6 text-brand-green" />,
    title: "Leaderboards",
    description: "Compete with other traders and showcase your investing prowess.",
  },
]

export function SecuritySection() {
  return (
    <Section className="bg-white py-20 lg:py-28">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-grey-heading">Gamified Learning Experience</h2>
            <p className="text-xl text-grey-text leading-relaxed">
              Our gamified learning experience makes investing education fun and rewarding. Earn XP as you learn, 
              and use your points to unlock real trading opportunities.
            </p>
          </div>

          <div className="space-y-6">
            {gamifiedFeatures.map((feature) => (
              <div key={feature.title} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-grey-heading text-lg">{feature.title}</h3>
                  <p className="text-grey-text">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative group">
          <div className="bg-lemon-green-milk/50 rounded-3xl p-8 shadow-lg transition-transform duration-500 group-hover:scale-105">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-md">
                <Trophy className="w-12 h-12 text-brand-green" />
              </div>
              <h3 className="text-2xl font-bold text-grey-heading">Your Progress</h3>
              <div className="space-y-4">
                <ProgressItem label="Current Level" value="12" />
                <ProgressItem label="XP Balance" value="4,250" />
                <ProgressItem label="Badges Earned" value="8/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

interface ProgressItemProps {
  label: string;
  value: string;
}

function ProgressItem({ label, value }: ProgressItemProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-white/80 backdrop-blur-sm rounded-lg">
      <span className="text-base font-medium text-grey-text">{label}</span>
      <span className="font-bold text-brand-green text-lg">{value}</span>
    </div>
  )
}
