import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { MessageCircle, Users, TrendingUp } from "lucide-react"

interface CommunitySectionProps {
  id?: string;
}

export function CommunitySection({ id }: CommunitySectionProps) {
  return (
    <Section id={id} className="bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Join the conversation</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Connect with fellow investors, share insights, and learn from the community. Join thousands of investors
            building wealth together.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Discussion Forums</h3>
                <p className="text-gray-600">Share strategies and market insights</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Expert Webinars</h3>
                <p className="text-gray-600">Learn from investment professionals</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Market Updates</h3>
                <p className="text-gray-600">Stay informed with daily market news</p>
              </div>
            </div>
          </div>

          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Join community
          </Button>
        </div>

        <div className="relative">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 text-center">Community Highlights</h3>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">J</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">John D.</p>
                      <p className="text-xs text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    "Great insights on tech stocks today! Thanks to the community for the tips."
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">S</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Sarah M.</p>
                      <p className="text-xs text-gray-600">5 hours ago</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    "The webinar on ETF strategies was incredibly helpful. Looking forward to more!"
                  </p>
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">Join 50,000+ active community members</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
