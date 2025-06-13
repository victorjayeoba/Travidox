import Image from "next/image"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"

export function InvestFractionsSection() {
  return (
    <Section className="bg-green-600 text-white">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold">Invest in fractions</h2>
          <p className="text-xl text-green-100 leading-relaxed">
            Buy fractional shares of your favorite Nigerian companies. Own a piece of Dangote Sugar, First HoldCo, 
            Transcorp Hotels, or Zenith Bank without paying full share prices. Start building your dream portfolio today.
          </p>
          <Button variant="secondary" size="lg" className="bg-white text-green-600 hover:bg-gray-100">
            <a href="/products/stock-trading">Learn more</a>
          </Button>
        </div>

        <div className="relative">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-white rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <Image 
                    src="/dangote.png"
                    alt="Dangote Sugar"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <p className="text-sm">Dangote Sugar</p>
                <p className="text-xs text-green-200">₦756.50 invested</p>
              </div>
              <div className="bg-white/20 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-white rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <Image 
                    src="/firstbank.png"
                    alt="First HoldCo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <p className="text-sm">First HoldCo</p>
                <p className="text-xs text-green-200">₦1,250.00 invested</p>
              </div>
              <div className="bg-white/20 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-white rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <Image 
                    src="/Transcorp.png"
                    alt="Transcorp Hotels"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <p className="text-sm">Transcorp Hotels</p>
                <p className="text-xs text-green-200">₦2,400.00 invested</p>
              </div>
              <div className="bg-white/20 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-white rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <Image 
                    src="/Zenith.png"
                    alt="Zenith Bank"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <p className="text-sm">Zenith Bank</p>
                <p className="text-xs text-green-200">₦8,750.00 invested</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
