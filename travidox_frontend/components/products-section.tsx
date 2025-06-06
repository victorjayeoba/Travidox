import { Section } from "@/components/ui/section"
import { TrendingUp, PieChart, DollarSign, Building } from "lucide-react"

export function ProductsSection() {
  const products = [
    {
      title: "Stocks",
      description:
        "Invest in individual stocks from top companies worldwide. Build a diversified portfolio with fractional shares.",
      icon: <TrendingUp className="w-12 h-12 text-white" />,
      buttonText: "Start trading",
      className: "bg-blue-500",
    },
    {
      title: "Exchange Traded Funds (ETFs)",
      description: "Diversify your investments with ETFs. Access broad market exposure with lower risk and fees.",
      icon: <PieChart className="w-12 h-12 text-white" />,
      buttonText: "Explore ETFs",
      className: "bg-green-500",
    },
    {
      title: "Fixed Returns",
      description:
        "Secure your future with fixed-income investments. Guaranteed returns with predictable income streams.",
      icon: <DollarSign className="w-12 h-12 text-white" />,
      buttonText: "View options",
      className: "bg-purple-500",
    },
    {
      title: "For Institutions",
      description:
        "Institutional-grade investment solutions for businesses and organizations. Advanced tools and dedicated support.",
      icon: <Building className="w-12 h-12 text-white" />,
      buttonText: "Learn more",
      className: "bg-orange-500",
    },
  ]

  return (
    <Section id="products" className="bg-green-600 text-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Products</h2>
        <p className="text-xl text-green-100 max-w-2xl mx-auto">
          Choose from our range of investment products designed to meet your financial goals
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <div key={index} className="bg-white rounded-2xl overflow-hidden">
            <div className={`${product.className} p-6 text-center`}>{product.icon}</div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{product.title}</h3>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                {product.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
