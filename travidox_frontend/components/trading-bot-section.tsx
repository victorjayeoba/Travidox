"use client"

import { useState } from "react"
import { Section } from "@/components/ui/section"
import { Bot, Settings, TrendingUp, Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface TradingBotSectionProps {
  id?: string;
}

const features = [
  {
    icon: <TrendingUp className="w-6 h-6 text-brand-green" />,
    title: "Market Analysis",
    description: "Advanced algorithms analyze market trends and identify trading opportunities.",
  },
  {
    icon: <Settings className="w-6 h-6 text-brand-green" />,
    title: "Custom Trading Rules",
    description: "Define your own trading parameters or use our optimized presets.",
  }
];

export function TradingBotSection({ id }: TradingBotSectionProps) {
  const [automationLevel, setAutomationLevel] = useState([75])

  return (
    <Section id={id} className="bg-lemon-green-milk py-20 lg:py-28">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-grey-heading">Live FX Trading Bot</h2>
            <p className="text-xl text-grey-text leading-relaxed">
              Let our AI-powered trading bot work for you. Analyze market trends, execute trades, and optimize your 
              portfolio with customizable automation levels.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-grey-heading text-lg">{feature.title}</h3>
                  <p className="text-grey-text">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4">
            <Button size="lg" className="bg-brand-green hover:bg-brand-green-dark text-white">
              <a href="/dashboard/trading-bot">Try Trading Bot</a>
            </Button>
          </div>
        </div>

        <div className="relative group">
          <div className="relative bg-white rounded-3xl p-8 shadow-lg transition-transform duration-500 group-hover:scale-105">
            <div className="text-center space-y-6">
              <div className="inline-block bg-brand-green/10 p-5 rounded-full">
                <Bot className="w-12 h-12 text-brand-green" />
              </div>
              <h3 className="text-2xl font-bold text-grey-heading">Automation Level</h3>
              
              <div className="space-y-4 pt-2">
                <Slider
                  value={automationLevel}
                  onValueChange={setAutomationLevel}
                  max={100}
                  step={25}
                  className="w-full"
                />
                <div className="flex justify-between text-sm font-medium text-grey-text">
                  <span>Manual</span>
                  <span>Auto</span>
                </div>
                
                <p className="text-grey-text text-sm pt-2">
                  Adjust how much control you want to give the AI. You can change this at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
} 