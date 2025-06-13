import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Award, GraduationCap } from "lucide-react"

export function LearnBasicsSection() {
  return (
    <Section className="bg-lemon-green-milk py-20 lg:py-28">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-grey-heading">
            Get Certified in Financial Literacy
          </h2>
          <p className="text-xl text-grey-text leading-relaxed">
            Boost your investment knowledge with professional certifications. Our courses are designed by industry experts and recognized globally, giving you credentials that matter in the financial world.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-brand-green" />
              <span className="text-grey-heading font-medium">Investment Fundamentals Certification</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-brand-green" />
              <span className="text-grey-heading font-medium">Advanced Trading Strategies</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-brand-green" />
              <span className="text-grey-heading font-medium">Risk Management Professional</span>
            </div>
          </div>
          <div className="pt-4">
            <Button size="lg" className="bg-brand-green hover:bg-brand-green-dark text-white">
              <a href="/dashboard/certifications">Enroll in Courses</a>
            </Button>
          </div>
        </div>

        <div className="relative group">
          <div className="relative bg-white rounded-3xl p-8 shadow-lg transition-transform duration-500 group-hover:scale-105">
            <div className="text-center space-y-4">
              <div className="inline-block bg-brand-green/10 p-4 rounded-full">
                <GraduationCap className="w-10 h-10 text-brand-green" />
              </div>
              <h3 className="text-2xl font-bold text-grey-heading">Financial Certification</h3>
              <p className="text-grey-text">Globally recognized financial literacy credentials</p>
              <div className="bg-gray-100 rounded-xl p-4 space-y-2 mt-4">
                <div className="flex justify-between text-sm font-medium text-grey-heading">
                  <span>Completion Status</span>
                  <span className="text-brand-green">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-brand-green h-2.5 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
