"use client"

import { useState } from "react"
import { Section } from "@/components/ui/section"
import { Shield, AlertTriangle, Bell, Check, Info, Eye, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReactElement } from "react"

interface SecurityTip {
  icon: ReactElement;
  title: string;
  description: string;
}

interface SecurityTips {
  scams: SecurityTip[];
  accounts: SecurityTip[];
  news: SecurityTip[];
  [key: string]: SecurityTip[];
}

interface SecurityAwarenessProps {
  id?: string;
}

export function SecurityAwarenessSection({ id }: SecurityAwarenessProps) {
  const [activeTab, setActiveTab] = useState<"scams" | "accounts" | "news">("scams");
  
  const securityTips: SecurityTips = {
    scams: [
      {
        icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        title: "Unrealistic Returns",
        description: "Be wary of promises of abnormally high or guaranteed returns. If it sounds too good to be true, it probably is."
      },
      {
        icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        title: "Pressure Tactics",
        description: "Legitimate investments don't require immediate action. Be suspicious of anyone creating artificial urgency."
      },
      {
        icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        title: "Unregistered Products",
        description: "Always verify that investment products and professionals are registered with proper regulatory authorities."
      }
    ],
    accounts: [
      {
        icon: <Lock className="w-5 h-5 text-green-600" />,
        title: "Strong Password",
        description: "Use unique, complex passwords and enable two-factor authentication for your trading accounts."
      },
      {
        icon: <Eye className="w-5 h-5 text-green-600" />,
        title: "Monitor Activity",
        description: "Regularly review your account statements and transaction history for any unauthorized activities."
      },
      {
        icon: <Bell className="w-5 h-5 text-green-600" />,
        title: "Set Alerts",
        description: "Configure notifications for login attempts, password changes, and unusual account activities."
      }
    ],
    news: [
      {
        icon: <Info className="w-5 h-5 text-green-600" />,
        title: "Check Sources",
        description: "Verify financial news from multiple reliable sources before making investment decisions."
      },
      {
        icon: <Info className="w-5 h-5 text-green-600" />,
        title: "Watch for Pump & Dump",
        description: "Be cautious of overhyped stocks or cryptocurrencies being promoted heavily on social media."
      },
      {
        icon: <Info className="w-5 h-5 text-green-600" />,
        title: "Market Warnings",
        description: "Stay informed about regulatory warnings and market alerts from official financial authorities."
      }
    ]
  };

  return (
    <Section id={id} className="bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Trading Security Center</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Stay safe in the financial world with our comprehensive security resources. Learn to identify scams, 
            protect your accounts, and make informed decisions based on reliable information.
          </p>
          
          <div className="flex space-x-2 border-b border-gray-200">
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === "scams" ? "border-b-2 border-yellow-500 text-yellow-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("scams")}
            >
              Scam Detection
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === "accounts" ? "border-b-2 border-green-600 text-green-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("accounts")}
            >
              Account Security
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === "news" ? "border-b-2 border-green-600 text-green-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("news")}
            >
              Financial News
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {securityTips[activeTab].map((tip: SecurityTip, index: number) => (
              <div key={index} className="flex p-3 bg-white rounded-lg shadow-sm">
                <div className="flex-shrink-0 mr-4">
                  {tip.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{tip.title}</h3>
                  <p className="text-gray-600 text-sm">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black">
            View Security Guide
          </Button>
        </div>

        <div className="relative">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto flex items-center justify-center">
                <Shield className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Latest Security Alerts</h3>
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <span className="font-medium">ALERT:</span> Beware of phishing emails claiming to be from Travidox requesting account verification.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        <span className="font-medium">UPDATE:</span> We've enhanced our two-factor authentication system for improved security.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Button variant="outline" size="sm" className="border-yellow-400 text-yellow-600 hover:bg-yellow-50">
                    View all alerts
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