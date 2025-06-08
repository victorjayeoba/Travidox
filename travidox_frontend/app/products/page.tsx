"use client"

import React from 'react'
import Link from 'next/link'
import { 
  MousePointer, Bot, Shield, Brain, ArrowRight,
  TrendingUp, BarChart2, CheckCircle, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white pt-16 pb-24 md:pt-20 md:pb-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Trading Products & Services
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover our suite of innovative trading solutions designed to help you build wealth and achieve your financial goals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
                <Link href="#products" className="flex items-center">
                  Explore Products
                  <ChevronRight className="ml-1 w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Grid Section */}
      <section id="products" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              <span>Our Products</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Innovative Trading Solutions</h2>
            <p className="text-lg text-gray-600">
              Explore our comprehensive suite of trading products designed to empower investors of all experience levels.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Demo Trading */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <MousePointer className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Demo Trading</h3>
                <p className="text-gray-600 mb-6 h-24">
                  Practice trading in a risk-free environment with virtual funds. Learn to trade, test strategies, 
                  and build confidence before investing real money.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">₦10,000,000 Virtual Funds</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">Real-time Market Data</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">Zero Risk Trading Practice</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/products/demo-trading" className="flex items-center justify-center w-full">
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Trading Bot */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
                  <Bot className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Trading Bot</h3>
                <p className="text-gray-600 mb-6 h-24">
                  Let our AI-powered trading bot work for you. Analyze market trends, execute trades, 
                  and optimize your portfolio with customizable automation levels.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">24/7 Automated Trading</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">Customizable Trading Rules</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">Advanced Backtesting</span>
                  </div>
                </div>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                  <Link href="/products/trading-bot" className="flex items-center justify-center w-full">
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Security Center */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Security Center</h3>
                <p className="text-gray-600 mb-6 h-24">
                  Stay safe in the financial world with our comprehensive security resources. Learn to identify scams, 
                  protect your accounts, and make informed decisions.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">Scam Detection Training</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">Account Security Best Practices</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">Financial News Verification</span>
                  </div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Link href="/products/security-center" className="flex items-center justify-center w-full">
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* AI Insights */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Insights</h3>
                <p className="text-gray-600 mb-6 h-24">
                  Stay ahead of the market with our AI-powered insights. Get personalized alerts, trend analysis, and smart
                  recommendations to make informed investment decisions.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">Real-time Market Analysis</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">Personalized Trading Alerts</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">Smart Portfolio Recommendations</span>
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Link href="/products/ai-insights" className="flex items-center justify-center w-full">
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Key Benefits</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose Travidox?</h2>
              
              <p className="text-lg text-gray-600">
                Our comprehensive suite of trading products and services is designed to give you
                a competitive edge in the financial markets.
              </p>
              
              <div className="space-y-4 mt-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <BarChart2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Advanced Technology</h3>
                    <p className="text-gray-600">
                      Leverage cutting-edge AI and machine learning technologies to enhance your trading strategy.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Security First</h3>
                    <p className="text-gray-600">
                      Trade with confidence knowing your data and investments are protected by industry-leading security measures.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Automation & Efficiency</h3>
                    <p className="text-gray-600">
                      Save time and reduce human error with our automated trading solutions and intelligent insights.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Data-Driven Decisions</h3>
                    <p className="text-gray-600">
                      Make smarter investment choices based on comprehensive market analysis and personalized insights.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-200 rounded-full opacity-50 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-200 rounded-full opacity-50 blur-3xl"></div>
              
              <div className="relative bg-gradient-to-br from-blue-900 to-purple-900 p-8 rounded-2xl text-white">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">All-In-One Platform</h3>
                      <p className="text-sm text-blue-100">Everything you need to succeed</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <h4 className="font-bold text-lg mb-2">Complete Trading Ecosystem</h4>
                      <p className="text-sm text-blue-100">
                        Travidox offers a complete ecosystem of trading tools and services designed to work seamlessly together,
                        from practice accounts to automated trading and AI-powered insights.
                      </p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <h4 className="font-bold text-lg mb-2">Tailored For All Experience Levels</h4>
                      <p className="text-sm text-blue-100">
                        Whether you're just starting your trading journey or you're an experienced investor,
                        our products are designed to meet your specific needs and help you achieve your financial goals.
                      </p>
                    </div>
                    
                    <Button className="w-full bg-white text-blue-900 hover:bg-blue-50">
                      <Link href="/signup">Get Started Today</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Trading?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Start your journey with Travidox today and discover how our innovative trading solutions
              can help you achieve your financial goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
                <Link href="/signup">Create Free Account</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link href="/products/demo-trading">Try Demo Trading</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 