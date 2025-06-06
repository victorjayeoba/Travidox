import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"

export function HeroSection() {
  return (
    <Section className="bg-gradient-to-br from-green-50 to-emerald-100 py-20 lg:py-32">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Dream
              <br />
              Invest
              <br />
              <span className="text-green-600">Live</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Start your investment journey with Travidox. Build wealth through smart investing with no restrictions and
              complete freedom.
            </p>
          </div>

          <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black text-lg px-8 py-4 rounded-full">
            Start investing
          </Button>
        </div>

        <div className="relative">
          <div className="bg-green-600 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 opacity-90"></div>
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">T</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">travidox</h2>
              <p className="text-green-100">Your gateway to financial freedom</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
