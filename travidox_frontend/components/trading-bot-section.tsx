"use client"

import { useState } from "react"
import { Section } from "@/components/ui/section"
import { Bot, Settings, TrendingUp, Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TradingBotSectionProps {
  id?: string;
}

export function TradingBotSection({ id }: TradingBotSectionProps) {
  const [automationLevel, setAutomationLevel] = useState(75)

  return (
    <Section id={id} className="bg-gradient-to-br from-yellow-50 to-amber-100">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Live FX Trading Bot</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Let our AI-powered trading bot work for you. Analyze market trends, execute trades, and optimize your 
            portfolio with customizable automation levels.
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Market Analysis</h3>
                <p className="text-gray-600">Advanced algorithms analyze market trends and identify trading opportunities.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Custom Trading Rules</h3>
                <p className="text-gray-600">Define your own trading parameters or use our optimized presets.</p>
              </div>
            </div>
          </div>
          
          <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black">
            <a href="/dashboard/trading-bot">Try Trading Bot</a>
          </Button>
        </div>

        <div className="relative">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto flex items-center justify-center">
                <Bot className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Automation Level</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Manual</span>
                  <span>Fully Automated</span>
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
    </Section>
  )
} 