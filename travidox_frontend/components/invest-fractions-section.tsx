import Image from "next/image"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const stocks = [
  { name: "Dangote Sugar", invested: "₦756.50", logo: "/dangote.png" },
  { name: "First HoldCo", invested: "₦1,250.00", logo: "/firstbank.png" },
  { name: "Transcorp Hotels", invested: "₦2,400.00", logo: "/Transcorp.png" },
  { name: "Zenith Bank", invested: "₦8,750.00", logo: "/Zenith.png" },
]

export function InvestFractionsSection() {
  return (
    <Section className="bg-white">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-grey-heading">Invest in fractions</h2>
          <p className="text-xl text-grey-text leading-relaxed">
            Buy fractional shares of your favorite Nigerian companies. Own a piece of Dangote Sugar, First HoldCo, 
            Transcorp Hotels, or Zenith Bank without paying full share prices. Start building your dream portfolio today.
          </p>
          <Button size="lg" className="bg-brand-green hover:bg-brand-green-dark text-white">
            <a href="/products/stock-trading">Learn more</a>
          </Button>
        </div>

        <div className="relative">
          <div className="bg-lemon-green-milk/50 rounded-3xl p-8">
            <div className="grid grid-cols-2 gap-6">
              {stocks.map((stock) => (
                <StockCard key={stock.name} {...stock} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

interface StockCardProps {
  logo: string;
  name: string;
  invested: string;
}

function StockCard({ logo, name, invested }: StockCardProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0 flex flex-col items-center">
        <div className="w-16 h-16 bg-white rounded-xl mb-3 flex items-center justify-center shadow-sm">
          <Image 
            src={logo}
            alt={name}
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
        <p className="font-semibold text-grey-heading text-sm">{name}</p>
        <p className="text-xs text-grey-text">{invested} invested</p>
      </CardContent>
    </Card>
  )
}
