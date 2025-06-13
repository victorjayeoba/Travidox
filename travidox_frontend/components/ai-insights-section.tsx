import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Brain, Bell, BarChart3, TrendingUp, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

const features = [
  "Real-time market analysis",
  "Personalized investment alerts",
  "Smart portfolio recommendations"
];

const alerts = [
  { icon: <Bell className="w-5 h-5 text-green-600" />, text: "AAPL showing strong momentum", recommendation: "Recommended action: Buy", color: "green" },
  { icon: <BarChart3 className="w-5 h-5 text-yellow-600" />, text: "Market volatility detected", recommendation: "Consider diversification", color: "yellow" },
  { icon: <TrendingUp className="w-5 h-5 text-blue-600" />, text: "Tech sector trending up", recommendation: "Opportunity identified", color: "blue" },
];

export function AIInsightsSection() {
  return (
    <Section className="bg-white py-20 lg:py-28">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative group">
          <Card className="relative bg-lemon-green-milk/50 rounded-3xl p-8 shadow-lg transition-transform duration-500 group-hover:scale-105">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md">
                  <Brain className="w-8 h-8 text-brand-green" />
                </div>
                <div>
                  <h3 className="font-bold text-grey-heading text-xl">AI Market Analysis</h3>
                  <p className="text-sm text-grey-text">Real-time insights</p>
                </div>
              </div>

              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 bg-${alert.color}-50 rounded-lg`}>
                    <div className={`flex-shrink-0 w-8 h-8 bg-${alert.color}-100 rounded-full flex items-center justify-center`}>
                      {alert.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-grey-heading">{alert.text}</p>
                      <p className="text-xs text-grey-text">{alert.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-grey-heading">
              AI-Driven Triggers & Alerts
            </h2>
            <p className="text-xl text-grey-text leading-relaxed">
              Stay ahead with our AI-powered insights. Get personalized alerts, trend analysis, and smart
              recommendations to make informed investment decisions.
            </p>
          </div>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-brand-green" />
                <span className="text-grey-heading font-medium">{feature}</span>
              </div>
            ))}
          </div>
          <div className="pt-4">
            <Button size="lg" className="bg-brand-green hover:bg-brand-green-dark text-white">
              Enable AI Insights
            </Button>
          </div>
        </div>
      </div>
    </Section>
  )
}
