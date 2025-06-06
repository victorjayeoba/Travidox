import { Section } from "@/components/ui/section"
import { Trophy, Star, Gift, Medal } from "lucide-react"

export function SecuritySection() {
  const gamifiedFeatures = [
    {
      icon: <Trophy className="w-6 h-6 text-green-600" />,
      title: "XP Rewards System",
      description: "Earn experience points for completing lessons, quizzes, and successful trades.",
    },
    {
      icon: <Star className="w-6 h-6 text-green-600" />,
      title: "Achievement Badges",
      description: "Unlock badges as you master new trading concepts and strategies.",
    },
    {
      icon: <Gift className="w-6 h-6 text-green-600" />,
      title: "Redeem XP for Assets",
      description: "Convert your earned XP into fractional shares or trading credits.",
    },
    {
      icon: <Medal className="w-6 h-6 text-green-600" />,
      title: "Leaderboards",
      description: "Compete with other traders and showcase your investing prowess.",
    },
  ]

  return (
    <Section className="bg-gray-50">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Learn while you earn</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our gamified learning experience makes investing education fun and rewarding. Earn XP as you learn, 
            and use your points to unlock real trading opportunities.
          </p>

          <div className="space-y-4">
            {gamifiedFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-600 rounded-full mx-auto flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Your Progress</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Current Level</span>
                  <span className="font-bold text-green-600">12</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">XP Balance</span>
                  <span className="font-bold text-green-600">4,250</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Badges Earned</span>
                  <span className="font-bold text-green-600">8/20</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
