import { Section } from "@/components/ui/section"
import { Users, TrendingUp, Shield } from "lucide-react"

export function StatsSection() {
  return (
    <Section className="bg-white">
      <div className="text-center space-y-16">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            We are helping Africans build actual wealth
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Across the continent, we're empowering individuals to take control of their financial future. We don't just
            facilitate trading; we provide insights that matter and tools that make a real difference.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-4xl font-bold text-gray-900">50K+</h3>
              <p className="text-gray-600">Registered users</p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-4xl font-bold text-gray-900">₦ 1.5B+</h3>
              <p className="text-gray-600">Assets under management</p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-4xl font-bold text-gray-900">99.9%</h3>
              <p className="text-gray-600">Uptime reliability</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
