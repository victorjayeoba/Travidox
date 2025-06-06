import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"

export function InvestFractionsSection() {
  return (
    <Section className="bg-green-600 text-white">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold">Invest in fractions</h2>
          <p className="text-xl text-green-100 leading-relaxed">
            Buy fractional shares of your favorite companies. Own a piece of Apple, Google, or Tesla without paying full
            share prices. Start building your dream portfolio today.
          </p>
          <Button variant="secondary" size="lg" className="bg-white text-green-600 hover:bg-gray-100">
            Learn more
          </Button>
        </div>

        <div className="relative">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-white rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <span className="text-green-600 font-bold">A</span>
                </div>
                <p className="text-sm">Apple Inc.</p>
                <p className="text-xs text-green-200">$0.50 invested</p>
              </div>
              <div className="bg-white/20 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-white rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <span className="text-green-600 font-bold">G</span>
                </div>
                <p className="text-sm">Google</p>
                <p className="text-xs text-green-200">$1.25 invested</p>
              </div>
              <div className="bg-white/20 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-white rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <span className="text-green-600 font-bold">T</span>
                </div>
                <p className="text-sm">Tesla</p>
                <p className="text-xs text-green-200">$2.00 invested</p>
              </div>
              <div className="bg-white/20 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-white rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <span className="text-green-600 font-bold">M</span>
                </div>
                <p className="text-sm">Microsoft</p>
                <p className="text-xs text-green-200">$0.75 invested</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
