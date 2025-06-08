"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Bot, ArrowRight, CheckCircle, Settings, TrendingUp,
  Sliders, Clock, Zap, BarChart2, RefreshCw, Shield, 
  Code, ChartBar, DollarSign, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TradingBotPage() {
  const [automationLevel, setAutomationLevel] = useState(75)

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-900 via-amber-800 to-yellow-800 text-white pt-16 pb-24 md:pt-20 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-yellow-800/50 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                <Bot className="w-4 h-4" />
                <span>AI-Powered Trading</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-yellow-300">Automated</span> Trading Bot
              </h1>
              
              <p className="text-lg text-gray-300">
                Let our AI-powered trading bot work for you. Analyze market trends, execute trades, 
                and optimize your portfolio with customizable automation levels.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-3">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg">
                  <Link href="/signup?feature=bot" className="flex items-center">
                    Try Trading Bot
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm text-gray-300">Customizable Rules</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm text-gray-300">24/7 Trading</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm text-gray-300">Emotion-Free Decisions</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-80 lg:h-auto">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 bg-yellow-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 bg-white rounded-2xl p-8 shadow-xl">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto flex items-center justify-center">
                    <Bot className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Automation Level</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Manual</span>
                      <span className="text-gray-500">Fully Automated</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3 relative">
                      <div 
                        className="bg-yellow-400 h-3 rounded-full" 
                        style={{ width: `${automationLevel}%` }}
                      ></div>
                      <div 
                        className="absolute top-1/2 transform -translate-y-1/2"
                        style={{ left: `${automationLevel}%` }}
                      >
                        <Sliders className="w-6 h-6 text-yellow-600 -ml-3" />
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm">
                      Adjust how much control you want to give to the AI. You can change this at any time.
                    </p>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => setAutomationLevel(25)}
                        className={automationLevel === 25 ? "border-yellow-400 text-yellow-600" : ""}
                      >
                        25%
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setAutomationLevel(50)}
                        className={automationLevel === 50 ? "border-yellow-400 text-yellow-600" : ""}
                      >
                        50%
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setAutomationLevel(75)}
                        className={automationLevel === 75 ? "border-yellow-400 text-yellow-600" : ""}
                      >
                        75%
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setAutomationLevel(100)}
                        className={automationLevel === 100 ? "border-yellow-400 text-yellow-600" : ""}
                      >
                        100%
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Settings className="w-4 h-4" />
              <span>How It Works</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Advanced AI-Powered Trading</h2>
            <p className="text-lg text-gray-600">
              Our trading bot leverages sophisticated algorithms and machine learning to analyze markets
              and execute trades based on your preferences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart2 className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. Market Analysis</h3>
              <p className="text-gray-600">
                Advanced algorithms continuously analyze market trends, patterns, and indicators
                to identify potential trading opportunities.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">2. Strategy Execution</h3>
              <p className="text-gray-600">
                Based on your preferences and risk tolerance, the bot executes trades
                following pre-defined strategies and rules.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">3. Continuous Optimization</h3>
              <p className="text-gray-600">
                The AI constantly learns from market responses and optimizes its strategies
                to improve performance over time.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                <span>Features</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Powerful Bot Features</h2>
              
              <p className="text-lg text-gray-600">
                Our trading bot comes packed with advanced features designed to give you an edge in the markets.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Market Analysis</h3>
                    <p className="text-sm text-gray-600">
                      Advanced algorithms analyze market trends and identify trading opportunities.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Settings className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Custom Trading Rules</h3>
                    <p className="text-sm text-gray-600">
                      Define your own trading parameters or use optimized presets.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">24/7 Operation</h3>
                    <p className="text-sm text-gray-600">
                      Bot works around the clock, never missing trading opportunities.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ChartBar className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Performance Reports</h3>
                    <p className="text-sm text-gray-600">
                      Detailed analytics and reports on your bot's trading performance.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Code className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Backtesting</h3>
                    <p className="text-sm text-gray-600">
                      Test strategies against historical data before deploying live.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Risk Management</h3>
                    <p className="text-sm text-gray-600">
                      Advanced risk controls to protect your investment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-xl border border-gray-100">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                        <Bot className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Trading Bot Dashboard</h3>
                        <p className="text-sm text-gray-500">Performance overview</p>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Active</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Win Rate</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold text-gray-900">76%</p>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Total Profit</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold text-gray-900">₦345,800</p>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Trading Activity (Last 7 Days)</p>
                      <div className="h-24 flex items-end gap-1">
                        {[35, 55, 45, 60, 40, 50, 65].map((height, i) => (
                          <div 
                            key={i} 
                            className="flex-1 bg-yellow-400 rounded-t-sm"
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2">
                        <p className="text-xs text-gray-500">Mon</p>
                        <p className="text-xs text-gray-500">Tue</p>
                        <p className="text-xs text-gray-500">Wed</p>
                        <p className="text-xs text-gray-500">Thu</p>
                        <p className="text-xs text-gray-500">Fri</p>
                        <p className="text-xs text-gray-500">Sat</p>
                        <p className="text-xs text-gray-500">Sun</p>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-gray-900">Next Steps</h4>
                          <p className="text-sm text-gray-600">
                            Customize your bot's strategy or use our pre-configured templates to get started quickly.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <DollarSign className="w-4 h-4" />
              <span>Pricing</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600">
              Choose the right plan for your trading needs with our flexible pricing options.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Basic Bot</h3>
                <p className="text-gray-600 mb-4">For casual traders getting started with automation</p>
                <div className="mb-6">
                  <p className="text-4xl font-bold text-gray-900">Free</p>
                  <p className="text-gray-500">with Standard account</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">1 active bot</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">Basic strategies</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">Standard reporting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">Email notifications</span>
                  </li>
                </ul>
                
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
                  <Link href="/signup?plan=basic">Get Started</Link>
                </Button>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-white rounded-xl overflow-hidden shadow-xl border-2 border-yellow-400 relative">
              <div className="bg-yellow-400 text-black text-xs font-bold px-4 py-1 absolute top-0 right-0 rounded-bl-lg">
                MOST POPULAR
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pro Bot</h3>
                <p className="text-gray-600 mb-4">For serious traders looking to optimize returns</p>
                <div className="mb-6">
                  <p className="text-4xl font-bold text-gray-900">₦4,999</p>
                  <p className="text-gray-500">per month</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">5 active bots</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">Advanced strategies</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">Advanced backtesting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">Custom indicators</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">24/7 priority support</span>
                  </li>
                </ul>
                
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                  <Link href="/signup?plan=pro">Upgrade to Pro</Link>
                </Button>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise Bot</h3>
                <p className="text-gray-600 mb-4">For professional traders and institutions</p>
                <div className="mb-6">
                  <p className="text-4xl font-bold text-gray-900">Custom</p>
                  <p className="text-gray-500">contact for pricing</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">Unlimited bots</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">Custom strategy development</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">API integration</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">Dedicated account manager</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">White-label options</span>
                  </li>
                </ul>
                
                <Button className="w-full" variant="outline">
                  <Link href="/contact/sales">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-yellow-900 to-amber-800 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Let AI Trade for You?</h2>
            <p className="text-xl text-yellow-100 mb-8">
              Start using our trading bot today and experience the power of automated trading.
              Set it up in minutes and let the AI work for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-yellow-900 hover:bg-gray-100">
                <Link href="/signup?feature=bot">Get Started Now</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link href="/products/trading-bot/faq">View Bot FAQs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 