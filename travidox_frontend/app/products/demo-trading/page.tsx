"use client"

import React from 'react'
import Link from 'next/link'
import { 
  MousePointer, LineChart, BarChart2, TrendingUp, 
  Clock, ArrowRight, CheckCircle, LayoutDashboard, 
  DollarSign, BookOpen, PieChart, Layers, 
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DemoTradingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white pt-16 pb-24 md:pt-20 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-blue-800/50 text-blue-300 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                <MousePointer className="w-4 h-4" />
                <span>Demo Trading</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Learn to Trade <span className="text-blue-300">Risk-Free</span>
              </h1>
              
              <p className="text-lg text-gray-300">
                Perfect your trading strategy in a realistic market environment with our demo account. 
                Practice with virtual money before investing real funds.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-3">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  <Link href="/signup?demo=true" className="flex items-center">
                    Start Demo Trading
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-300" />
                  <span className="text-sm text-gray-300">₦10,000,000 Virtual Funds</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-300" />
                  <span className="text-sm text-gray-300">Real-time Market Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-300" />
                  <span className="text-sm text-gray-300">Zero Risk</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-80 lg:h-auto">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10 p-4 md:p-6 shadow-xl">
                <div className="bg-gray-900/80 p-4 rounded-xl mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold text-white">Demo Dashboard</span>
                    </div>
                    <div className="bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs">Practice Mode</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Available Balance</span>
                      <span className="text-white font-bold">₦10,000,000.00</span>
                    </div>
                    
                    <div className="h-24 bg-gray-800/50 rounded-lg p-2">
                      <div className="flex items-end h-full w-full gap-1">
                        {/* Simplified chart representation */}
                        {[35, 55, 45, 60, 40, 50, 65, 70, 60, 80, 75, 85].map((height, i) => (
                          <div 
                            key={i} 
                            className={`flex-1 rounded-t-sm ${i % 2 === 0 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="text-center">
                        <div className="text-gray-400 text-xs">Open Positions</div>
                        <div className="text-white font-bold">4</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400 text-xs">Profit/Loss</div>
                        <div className="text-green-400 font-bold">+₦245,000</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400 text-xs">Win Rate</div>
                        <div className="text-white font-bold">68%</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-900/30 p-3 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-blue-300">AAPL</span>
                      <div className="flex items-center text-green-400 text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>+2.4%</span>
                      </div>
                    </div>
                    <div className="text-white font-bold mb-1">$184.92</div>
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-xs">Buy/Sell</Button>
                  </div>
                  
                  <div className="bg-indigo-900/30 p-3 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-indigo-300">TSLA</span>
                      <div className="flex items-center text-green-400 text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>+3.1%</span>
                      </div>
                    </div>
                    <div className="text-white font-bold mb-1">$257.89</div>
                    <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs">Buy/Sell</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <LayoutDashboard className="w-4 h-4" />
              <span>Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Learn Trading</h2>
            <p className="text-lg text-gray-600">
              Our demo trading platform provides all the tools and features you need to become
              a confident trader, without the financial risk.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Virtual Funds</h3>
              <p className="text-gray-600 mb-4">
                Start with ₦10,000,000 in virtual currency to practice trading without risking real money.
                Reset your balance anytime.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <LineChart className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real Market Data</h3>
              <p className="text-gray-600 mb-4">
                Practice with live market data and realistic conditions, providing authentic
                trading experience without the risk.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Charts</h3>
              <p className="text-gray-600 mb-4">
                Access professional-grade charting tools with multiple timeframes, indicators,
                and drawing tools to analyze market movements.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <PieChart className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Portfolio Analytics</h3>
              <p className="text-gray-600 mb-4">
                Track your performance with detailed statistics, trade history, and analytics
                to improve your strategy over time.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Learning Resources</h3>
              <p className="text-gray-600 mb-4">
                Access trading guides, tutorials, and educational content while you practice
                to enhance your knowledge and skills.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Unlimited Practice</h3>
              <p className="text-gray-600 mb-4">
                No time limits or restrictions. Practice as long as you need until you feel
                confident to transition to real trading.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                <Layers className="w-4 h-4" />
                <span>Benefits</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Practice with Our Demo Account?</h2>
              
              <p className="text-lg text-gray-600">
                Learning to trade in a risk-free environment gives you the confidence and skills 
                needed before committing real capital.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Build Confidence</h3>
                    <p className="text-gray-600">
                      Develop trading skills and confidence without the emotional pressure of risking real money.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Test Strategies</h3>
                    <p className="text-gray-600">
                      Experiment with different trading strategies to find what works best for your style and goals.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Learn Platform Features</h3>
                    <p className="text-gray-600">
                      Familiarize yourself with our trading platform's tools and features before trading with real funds.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Risk-Free Learning</h3>
                    <p className="text-gray-600">
                      Make mistakes and learn from them without any financial consequences.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/signup?demo=true" className="flex items-center">
                  Create Demo Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-200 rounded-full opacity-50 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-200 rounded-full opacity-50 blur-3xl"></div>
              
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <MousePointer className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Demo vs. Real Trading</h3>
                      <p className="text-sm text-gray-500">What to expect when transitioning</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-blue-600 mb-2">Demo Trading</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>No financial risk</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Unlimited practice</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Less emotional pressure</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Free to use</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-2">Real Trading</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                            <span>Real profits/losses</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                            <span>Emotional component</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                            <span>Tax implications</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                            <span>Requires funding</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="font-bold text-blue-800 mb-2">Pro Tip</h4>
                      <p className="text-sm text-gray-700">
                        We recommend practicing with a demo account for at least 2-3 months and achieving consistent 
                        positive results before transitioning to real trading.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Trading Journey?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Begin with a risk-free demo account and practice until you're ready for the real markets.
              No commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
                <Link href="/signup?demo=true">Create Free Demo Account</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link href="/products/demo-trading/faq">View Demo FAQs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 