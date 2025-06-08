"use client"

import React from 'react'
import Link from 'next/link'
import { 
  Brain, Bell, BarChart3, TrendingUp, ArrowRight, CheckCircle,
  LineChart, PieChart, BarChart2, ChartBar, Target, Zap, 
  LightbulbIcon, ListFilter, ArrowUpDown, Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AIInsightsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-yellow-900 text-white pt-16 pb-24 md:pt-20 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-yellow-800/50 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                <Brain className="w-4 h-4" />
                <span>AI-Powered Trading</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-yellow-300">AI Market</span> Insights
              </h1>
              
              <p className="text-lg text-gray-300">
                Stay ahead of the market with our AI-powered insights. Get personalized alerts, trend analysis, and smart
                recommendations to make informed investment decisions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-3">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg">
                  <Link href="/signup?feature=ai-insights" className="flex items-center">
                    Enable AI Insights
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm text-gray-300">Real-time Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm text-gray-300">Personalized Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm text-gray-300">Smart Recommendations</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-80 lg:h-auto">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 bg-yellow-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">AI Market Analysis</h3>
                      <p className="text-sm text-gray-600">Real-time insights</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <Bell className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">AAPL showing strong momentum</p>
                        <p className="text-xs text-gray-600">Recommended action: Buy</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-yellow-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Market volatility detected</p>
                        <p className="text-xs text-gray-600">Consider diversification</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-gray-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Tech sector trending up</p>
                        <p className="text-xs text-gray-600">Opportunity identified</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <BarChart2 className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New pattern detected in TSLA</p>
                        <p className="text-xs text-gray-600">Potential breakout imminent</p>
                      </div>
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
              <Zap className="w-4 h-4" />
              <span>How It Works</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AI-Powered Market Intelligence</h2>
            <p className="text-lg text-gray-600">
              Our advanced artificial intelligence analyzes millions of data points to deliver 
              personalized insights tailored to your investment goals and preferences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart2 className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. Data Collection</h3>
              <p className="text-gray-600">
                Our AI aggregates vast amounts of market data, news, social sentiment, and economic 
                indicators in real-time to form a comprehensive view of the market.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">2. Analysis & Learning</h3>
              <p className="text-gray-600">
                Using advanced machine learning algorithms, our AI identifies patterns, trends, and 
                opportunities that would be impossible for humans to detect manually.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">3. Personalized Insights</h3>
              <p className="text-gray-600">
                Based on your portfolio, preferences, and risk tolerance, the AI delivers customized 
                alerts, recommendations, and insights directly to you.
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
                <LightbulbIcon className="w-4 h-4" />
                <span>Key Features</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Smart Insights for Smart Investors</h2>
              
              <p className="text-lg text-gray-600">
                Our AI insights platform offers a comprehensive suite of tools to help you make better, 
                data-driven investment decisions.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Smart Alerts</h3>
                    <p className="text-sm text-gray-600">
                      Receive timely notifications about market movements, price targets, and trading opportunities.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Trend Analysis</h3>
                    <p className="text-sm text-gray-600">
                      Identify emerging market trends before they become mainstream.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PieChart className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Portfolio Optimization</h3>
                    <p className="text-sm text-gray-600">
                      Get recommendations to balance your portfolio for optimal risk-reward.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Price Targets</h3>
                    <p className="text-sm text-gray-600">
                      AI-generated price predictions based on comprehensive market analysis.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ListFilter className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Sentiment Analysis</h3>
                    <p className="text-sm text-gray-600">
                      Track market sentiment from news, social media, and financial reports.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Mobile Notifications</h3>
                    <p className="text-sm text-gray-600">
                      Get insights on the go with real-time mobile alerts and updates.
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
                        <Brain className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">AI Market Summary</h3>
                        <p className="text-sm text-gray-500">Current market outlook</p>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Updated</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-gray-900">Market Sentiment</h4>
                      <div className="flex items-center text-green-600 text-sm">
                        <ArrowUpDown className="w-4 h-4 mr-1" />
                        <span>Cautiously Bullish</span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Bearish</span>
                      <span>Neutral</span>
                      <span>Bullish</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900">Top Opportunities</h4>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <ChartBar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">AAPL</p>
                          <p className="text-xs text-gray-500">Technology</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">$184.92</p>
                        <p className="text-xs text-green-600">+2.4%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <ChartBar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">MSFT</p>
                          <p className="text-xs text-gray-500">Technology</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">$413.64</p>
                        <p className="text-xs text-green-600">+1.8%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <ChartBar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">AMZN</p>
                          <p className="text-xs text-gray-500">Retail</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">$178.21</p>
                        <p className="text-xs text-green-600">+3.2%</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
                    View Full AI Analysis
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <CheckCircle className="w-4 h-4" />
              <span>Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600">
              Discover how AI-powered insights have transformed the trading experience for our users.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">JO</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">John Okafor</h4>
                  <p className="text-sm text-gray-500">Retail Investor</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The AI alerts have been incredibly accurate. I received a notification about a potential 
                breakout in a stock I was watching, and it jumped 15% the next day!"
              </p>
              <div className="flex mt-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold">AA</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Amina Abubakar</h4>
                  <p className="text-sm text-gray-500">Day Trader</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I've tried several AI trading tools, but Travidox's insights are by far the most accurate. 
                The sentiment analysis has completely changed how I time my entries and exits."
              </p>
              <div className="flex mt-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">DE</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">David Ekene</h4>
                  <p className="text-sm text-gray-500">Long-term Investor</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The portfolio optimization suggestions have helped me balance my investments and reduce risk. 
                My returns have improved by over 20% since I started using the AI insights."
              </p>
              <div className="flex mt-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-green-900 to-yellow-900 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Unlock the Power of AI in Your Trading</h2>
            <p className="text-xl text-yellow-100 mb-8">
              Get started with AI-powered market insights today and make smarter, data-driven 
              investment decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-900 hover:bg-gray-100">
                <Link href="/signup?feature=ai-insights">Enable AI Insights</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link href="/products/ai-insights/demo">View Live Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 