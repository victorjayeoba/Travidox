import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Award, GraduationCap } from "lucide-react"

export function LearnBasicsSection() {
  return (
    <Section className="bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-600 rounded-2xl mx-auto flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Financial Certification</h3>
              <p className="text-gray-600">Globally recognized financial literacy credentials</p>
              <div className="bg-gray-100 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion Status</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Get certified in financial literacy
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Boost your investment knowledge with professional certifications. Our courses are designed by industry experts and recognized globally, giving you credentials that matter in the financial world.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Investment Fundamentals Certification</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Advanced Trading Strategies Certificate</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Risk Management Professional</span>
            </div>
          </div>
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            <a href="/dashboard/certifications">Enroll in courses</a>
          </Button>
        </div>
      </div>
    </Section>
  )
}
