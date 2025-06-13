"use client"

import { useState, ReactElement } from "react"
import { Section } from "@/components/ui/section"
import { Shield, AlertTriangle, Bell, Lock, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface SecurityTip {
  icon: ReactElement;
  title: string;
  description: string;
}

type TabCategory = "scams" | "accounts" | "news";

const securityTips: Record<TabCategory, SecurityTip[]> = {
  scams: [
    { icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />, title: "Unrealistic Returns", description: "Be wary of promises of abnormally high or guaranteed returns. If it sounds too good to be true, it probably is." },
    { icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />, title: "Pressure Tactics", description: "Legitimate investments don't require immediate action. Be suspicious of anyone creating artificial urgency." },
    { icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />, title: "Unregistered Products", description: "Always verify that investment products and professionals are registered with proper regulatory authorities." }
  ],
  accounts: [
    { icon: <Lock className="w-6 h-6 text-brand-green" />, title: "Strong Password & 2FA", description: "Use unique, complex passwords and enable two-factor authentication for all your accounts." },
    { icon: <Bell className="w-6 h-6 text-brand-green" />, title: "Monitor Activity", description: "Regularly review your account statements and transaction history for any unauthorized activities." },
    { icon: <Info className="w-6 h-6 text-brand-green" />, title: "Set Up Alerts", description: "Configure notifications for login attempts, password changes, and unusual account activities." }
  ],
  news: [
    { icon: <Info className="w-6 h-6 text-blue-500" />, title: "Verify Sources", description: "Verify financial news from multiple reliable sources before making investment decisions." },
    { icon: <Info className="w-6 h-6 text-blue-500" />, title: "Watch for Hype", description: "Be cautious of overhyped stocks or cryptocurrencies being promoted heavily on social media." },
    { icon: <Info className="w-6 h-6 text-blue-500" />, title: "Heed Warnings", description: "Stay informed about regulatory warnings and market alerts from official financial authorities." }
  ]
};

export function SecurityAwarenessSection({ id }: { id?: string }) {
  const [activeTab, setActiveTab] = useState<TabCategory>("scams");
  
  return (
    <Section id={id} className="bg-lemon-green-milk py-20 lg:py-28">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-grey-heading">Trading Security Center</h2>
            <p className="text-xl text-grey-text leading-relaxed">
              Stay safe in the financial world. Learn to identify scams, protect your accounts, and make informed decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-1 bg-gray-200/50 rounded-lg p-1">
            {Object.keys(securityTips).map((tab) => (
              <Button
                key={tab}
                variant="ghost"
                size="sm"
                className={`text-xs sm:text-sm font-medium transition-colors px-2 py-2 ${activeTab === tab ? "bg-white text-brand-green shadow-sm" : "text-grey-text"}`}
                onClick={() => setActiveTab(tab as TabCategory)}
              >
                {tab === 'scams' ? 'Scams' : tab === 'accounts' ? 'Accounts' : 'News'}
              </Button>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            {securityTips[activeTab].map((tip) => (
              <Card key={tip.title} className="flex items-start p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
                <div className="flex-shrink-0 mr-3 mt-1">{tip.icon}</div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-grey-heading text-sm sm:text-base">{tip.title}</h3>
                  <p className="text-grey-text text-xs sm:text-sm leading-relaxed">{tip.description}</p>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="pt-4">
            <Button size="lg" className="bg-brand-green hover:bg-brand-green-dark text-white w-full sm:w-auto">
              <a href="/dashboard/security">View Security Guide</a>
            </Button>
          </div>
        </div>

        <div className="relative group">
          <Card className="relative bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-lg transition-transform duration-500 group-hover:scale-105">
            <div className="text-center space-y-4 lg:space-y-6">
              <div className="inline-block bg-brand-green/10 p-4 lg:p-5 rounded-full">
                <Shield className="w-10 h-10 lg:w-12 lg:h-12 text-brand-green" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-grey-heading">Latest Security Alerts</h3>
              <div className="space-y-4 text-left">
                <AlertCard
                  type="warning"
                  message="Beware of phishing emails claiming to be from Travidox."
                />
                <AlertCard
                  type="info"
                  message="We've enhanced our two-factor authentication for improved security."
                />
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm" className="text-brand-green border-brand-green hover:bg-brand-green/10">
                    <a href="/dashboard/security">View all alerts</a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  )
} 

interface AlertCardProps {
  type: 'warning' | 'info';
  message: string;
}

function AlertCard({ type, message }: AlertCardProps) {
  const isWarning = type === 'warning';
  const colors = {
    bg: isWarning ? 'bg-yellow-50' : 'bg-blue-50',
    border: isWarning ? 'border-yellow-400' : 'border-blue-400',
    icon: isWarning ? 'text-yellow-500' : 'text-blue-500',
    text: isWarning ? 'text-yellow-800' : 'text-blue-800',
  };

  return (
    <div className={`${colors.bg} border-l-4 ${colors.border} p-3 lg:p-4 rounded-md`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {isWarning ? (
            <AlertTriangle className={`h-4 w-4 lg:h-5 lg:w-5 ${colors.icon}`} />
          ) : (
            <Info className={`h-4 w-4 lg:h-5 lg:w-5 ${colors.icon}`} />
          )}
        </div>
        <div className="ml-2 lg:ml-3 min-w-0 flex-1">
          <p className={`text-xs lg:text-sm ${colors.text} leading-relaxed`}>{message}</p>
        </div>
      </div>
    </div>
  );
} 