import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Brain, Bell, BarChart3, TrendingUp } from "lucide-react"

export function AIInsightsSection() {
  return (
    <Section className="bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">AI Market Analysis</h3>
                  <p className="text-sm text-gray-600">Real-time insights</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Bell className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">AAPL showing strong momentum</p>
                    <p className="text-xs text-gray-600">Recommended action: Buy</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Market volatility detected</p>
                    <p className="text-xs text-gray-600">Consider diversification</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Tech sector trending up</p>
                    <p className="text-xs text-gray-600">Opportunity identified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Triggers and alerts driven by AI market insights
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Stay ahead of the market with our AI-powered insights. Get personalized alerts, trend analysis, and smart
            recommendations to make informed investment decisions.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-700">Real-time market analysis</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-700">Personalized investment alerts</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-700">Smart portfolio recommendations</span>
            </div>
          </div>
          <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black">
            Enable AI insights
          </Button>
        </div>
      </div>
    </Section>
  )
}
