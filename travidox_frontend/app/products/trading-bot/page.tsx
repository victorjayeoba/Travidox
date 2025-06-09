"use client"

import React from 'react'
import Link from 'next/link'
import { 
  ArrowRight, Bot, Zap, Shield, BarChart2, 
  Settings, Brain, Cpu, LineChart, Lightbulb, 
  AlertTriangle, CheckCircle, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AuthButton } from '@/components/auth/auth-button'
import { Badge } from '@/components/ui/badge'

export default function TradingBotPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white pt-20 pb-24 md:pt-24 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-purple-800/50 text-purple-300 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                <Bot className="w-4 h-4" />
                <span>AI-Powered Trading</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Automate Your Trading with <span className="text-purple-300">Smart AI</span> Technology
              </h1>
              
              <p className="text-lg text-gray-300">
                Let our advanced AI trading bot handle your investments with precision timing, data-driven decisions, and risk management strategies customized to your goals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-3">
                <AuthButton 
                  size="lg" 
                  className="bg-green-500 hover:bg-green-600 text-white rounded-lg"
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
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-30"></div>
                <div className="relative bg-gray-900 p-5 rounded-lg">
                  <img 
                    src="/images/trading-bot-preview.png" 
                    alt="Trading Bot Interface" 
                    className="rounded-lg shadow-2xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400/1e293b/e2e8f0?text=Trading+Bot+Interface';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Settings className="w-4 h-4" />
              <span>How It Works</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Intelligent Trading, Simplified</h2>
            <p className="text-lg text-gray-600">
              Our AI-powered trading bot combines advanced algorithms with machine learning to execute trades with precision and efficiency.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Set Your Strategy</h3>
              <p className="text-gray-600">
                Choose your risk tolerance, investment goals, and preferred markets. Our system will customize the bot's behavior to match your needs.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bot Analyzes Markets</h3>
              <p className="text-gray-600">
                The AI continuously monitors market conditions, analyzes trends, and identifies potential trading opportunities using advanced algorithms.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Automated Execution</h3>
              <p className="text-gray-600">
                When conditions match your strategy, the bot executes trades automatically with precision timing and risk management controls.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              <span>Bot Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Advanced Trading Capabilities</h2>
            <p className="text-lg text-gray-600">
              Our trading bot comes equipped with powerful features designed to optimize your investment strategy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Machine Learning</h3>
              <p className="text-gray-600 mb-4">
                Our bot continuously learns from market patterns and adapts its strategies to improve performance over time.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Risk Management</h3>
              <p className="text-gray-600 mb-4">
                Built-in risk controls including stop-loss, take-profit, and position sizing to protect your capital during volatile markets.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <LineChart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Technical Analysis</h3>
              <p className="text-gray-600 mb-4">
                Advanced pattern recognition and technical indicators to identify potential entry and exit points with precision.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">High-Frequency Trading</h3>
              <p className="text-gray-600 mb-4">
                Execute trades in milliseconds to capitalize on short-term market opportunities that human traders might miss.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Backtesting</h3>
              <p className="text-gray-600 mb-4">
                Test your strategies against historical market data to validate performance before deploying with real capital.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Customizable Strategies</h3>
              <p className="text-gray-600 mb-4">
                Tailor the bot's behavior to match your investment style with adjustable parameters and strategy templates.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Plans Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Lightbulb className="w-4 h-4" />
              <span>Trading Bot Plans</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Bot Package</h2>
            <p className="text-lg text-gray-600">
              Select the plan that best fits your trading needs and investment goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Basic Bot</h3>
              <p className="text-sm text-gray-500 mb-4">For new traders</p>
              <div className="mb-6">
                <span className="text-3xl font-bold">₦5,000</span>
                <span className="text-gray-500"> / month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">3 automated strategies</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">Nigerian market access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">Basic risk management</span>
                </li>
                <li className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-gray-300 mr-2" />
                  <span className="text-gray-400 text-sm">Advanced technical analysis</span>
                </li>
                <li className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-gray-300 mr-2" />
                  <span className="text-gray-400 text-sm">Custom strategy creation</span>
                </li>
              </ul>
              <Button className="w-full bg-gray-600 hover:bg-gray-700">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300 transform scale-105 shadow-lg">
              <div className="absolute -top-3 right-8 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Pro Bot</h3>
              <p className="text-sm text-gray-500 mb-4">For serious investors</p>
              <div className="mb-6">
                <span className="text-3xl font-bold">₦15,000</span>
                <span className="text-gray-500"> / month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">10 automated strategies</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">Global market access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">Advanced risk management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">Advanced technical analysis</span>
                </li>
                <li className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-gray-300 mr-2" />
                  <span className="text-gray-400 text-sm">Custom strategy creation</span>
                </li>
              </ul>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Enterprise Bot</h3>
              <p className="text-sm text-gray-500 mb-4">For professional traders</p>
              <div className="mb-6">
                <span className="text-3xl font-bold">₦30,000</span>
                <span className="text-gray-500"> / month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">Unlimited strategies</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">Global market access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">Advanced risk management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">Advanced technical analysis</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">Custom strategy creation</span>
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
          
          <div className="text-center mt-10 text-sm text-gray-500">
            <p>All plans include a 7-day free trial. Cancel anytime. See our <Link href="/legal/terms" className="text-blue-600 hover:underline">terms and conditions</Link> for details.</p>
          </div>
        </div>
      </section>
      
      {/* Performance Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <BarChart2 className="w-4 h-4" />
              <span>Performance</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Bot Performance Metrics</h2>
            <p className="text-lg text-gray-600">
              Our trading bot has consistently delivered strong results across various market conditions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold mb-4">Strategy Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="block font-medium">Momentum Strategy</span>
                    <span className="text-sm text-gray-500">Last 12 months</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">+18.7%</Badge>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="block font-medium">Trend Following</span>
                    <span className="text-sm text-gray-500">Last 12 months</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">+22.3%</Badge>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="block font-medium">Mean Reversion</span>
                    <span className="text-sm text-gray-500">Last 12 months</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">+15.2%</Badge>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold mb-4">Key Metrics</h3>
              <div className="space-y-6">
                <div className="flex justify-between">
                  <div>
                    <span className="block text-sm text-gray-500">Win Rate</span>
                    <span className="block text-2xl font-bold">68%</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Avg. Return</span>
                    <span className="block text-2xl font-bold">1.8%</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Max Drawdown</span>
                    <span className="block text-2xl font-bold">12.4%</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Risk Management</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="block text-sm text-gray-500">Sharpe Ratio</span>
                      <span className="block font-bold">1.7</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="block text-sm text-gray-500">Sortino Ratio</span>
                      <span className="block font-bold">2.1</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm text-gray-500">
                    <Clock className="inline-block w-4 h-4 mr-1 text-gray-400" />
                    Performance data updated monthly. Past performance does not guarantee future results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Trade Smarter?</h2>
            <p className="text-xl text-purple-100 mb-8">
              Let our AI-powered trading bot work for you 24/7, executing trades with precision and discipline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AuthButton 
                size="lg" 
                className="bg-green-500 hover:bg-green-600 text-white"
              />
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link href="/dashboard/trading-bot">View Bot Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 