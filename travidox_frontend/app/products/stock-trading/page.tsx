"use client"

import React from 'react'
import Link from 'next/link'
import { 
  ArrowRight, TrendingUp, BarChart2, LineChart, Smartphone, 
  Shield, Clock, Globe, Zap, DollarSign, Layers, PieChart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AuthButton } from '@/components/auth/auth-button'

export default function StockTradingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white pt-20 pb-24 md:pt-24 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-800/50 text-blue-300 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Stock Trading</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Trade Nigerian and <span className="text-blue-300">Global Markets</span> with Confidence
              </h1>
              
              <p className="text-lg text-gray-300">
                Access Nigerian stocks, global equities, ETFs, and more with our powerful yet easy-to-use trading platform. Start building your portfolio today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-3">
                <AuthButton 
                  size="lg" 
                  className="bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  defaultRoute="signup"
                />
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 rounded-lg">
                  <Link href="#features" className="flex items-center">
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30"></div>
                <div className="relative bg-gray-900 p-5 rounded-lg">
                  <img 
                    src="/images/trading-platform-preview.png" 
                    alt="Trading Platform Preview" 
                    className="rounded-lg shadow-2xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400/1e293b/e2e8f0?text=Trading+Platform+Preview';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <BarChart2 className="w-4 h-4" />
              <span>Trading Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Trade Successfully</h2>
            <p className="text-lg text-gray-600">
              Our comprehensive trading platform provides all the tools and resources you need to make informed investment decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <LineChart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Market Data</h3>
              <p className="text-gray-600 mb-4">
                Access live price updates, market depth, and comprehensive stock information for Nigerian and global markets.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <PieChart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Portfolio Diversification</h3>
              <p className="text-gray-600 mb-4">
                Build a balanced portfolio across different asset classes, sectors, and markets to optimize returns and manage risk.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile Trading</h3>
              <p className="text-gray-600 mb-4">
                Trade on-the-go with our responsive mobile app. Place orders, monitor your portfolio, and receive alerts anywhere, anytime.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Trading</h3>
              <p className="text-gray-600 mb-4">
                Trade with peace of mind thanks to our bank-level security, two-factor authentication, and regulatory compliance.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Extended Trading Hours</h3>
              <p className="text-gray-600 mb-4">
                Access pre-market and after-hours trading for global markets, giving you more flexibility and opportunities.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Global Market Access</h3>
              <p className="text-gray-600 mb-4">
                Invest in Nigerian stocks, US equities, European markets, and more, all from a single integrated platform.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Markets Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Globe className="w-4 h-4" />
              <span>Available Markets</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trade in Multiple Markets</h2>
            <p className="text-lg text-gray-600">
              Access a wide range of markets and financial instruments to diversify your investment portfolio.
            </p>
          </div>
          
          <Tabs defaultValue="nigerian" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="nigerian">Nigerian Markets</TabsTrigger>
              <TabsTrigger value="global">Global Equities</TabsTrigger>
              <TabsTrigger value="etfs">ETFs & Funds</TabsTrigger>
            </TabsList>
            <TabsContent value="nigerian" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Nigerian Stock Exchange</h3>
                    <p className="text-gray-600">
                      Trade shares of leading Nigerian companies across all sectors including banking, consumer goods, oil & gas, and more.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
                        <p className="font-medium">Banking</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
                        <p className="font-medium">Consumer Goods</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
                        <p className="font-medium">Oil & Gas</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
                        <p className="font-medium">Industrial</p>
                      </div>
                    </div>
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                      <Link href="/dashboard/markets">
                        View Nigerian Markets
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="global" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Global Stock Markets</h3>
                    <p className="text-gray-600">
                      Access international markets including US, UK, and European exchanges to invest in global companies and opportunities.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
                        <p className="font-medium">US Markets</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
                        <p className="font-medium">UK Markets</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
                        <p className="font-medium">European Markets</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
                        <p className="font-medium">Asian Markets</p>
                      </div>
                    </div>
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                      <Link href="/dashboard/markets/global">
                        View Global Markets
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="etfs" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">ETFs and Mutual Funds</h3>
                    <p className="text-gray-600">
                      Invest in diversified portfolios through ETFs and mutual funds covering various sectors, regions, and asset classes.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
                        <p className="font-medium">Index ETFs</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
                        <p className="font-medium">Sector ETFs</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
                        <p className="font-medium">Bond Funds</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
                        <p className="font-medium">Commodity ETFs</p>
                      </div>
                    </div>
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                      <Link href="/dashboard/markets/etfs">
                        View ETFs & Funds
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Trading Today</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of Nigerians who are building wealth through smart investing on our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AuthButton 
                size="lg" 
                className="bg-green-500 hover:bg-green-600 text-white"
                defaultRoute="signup"
              />
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link href="/products/demo-trading">Try Demo Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
