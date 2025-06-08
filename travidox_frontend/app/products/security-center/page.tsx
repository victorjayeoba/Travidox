"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Shield, AlertTriangle, Bell, Check, Info, Eye, Lock,
  ArrowRight, CheckCircle, FileText, Globe, KeyRound, 
  ShieldCheck, Fingerprint, BookOpen, Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SecurityTip {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface SecurityTips {
  scams: SecurityTip[];
  accounts: SecurityTip[];
  news: SecurityTip[];
  [key: string]: SecurityTip[];
}

export default function SecurityCenterPage() {
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
      },
      {
        icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        title: "Unsolicited Offers",
        description: "Be skeptical of investment opportunities that come out of nowhere. Research thoroughly before proceeding."
      },
      {
        icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        title: "Request for Personal Information",
        description: "Legitimate financial institutions never ask for personal information through unsecure channels like email or SMS."
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
      },
      {
        icon: <Smartphone className="w-5 h-5 text-green-600" />,
        title: "Secure Your Devices",
        description: "Keep your devices updated with the latest security patches and use reliable antivirus software."
      },
      {
        icon: <Globe className="w-5 h-5 text-green-600" />,
        title: "Use Secure Networks",
        description: "Avoid accessing your trading account on public Wi-Fi networks or shared computers."
      }
    ],
    news: [
      {
        icon: <Info className="w-5 h-5 text-blue-600" />,
        title: "Check Sources",
        description: "Verify financial news from multiple reliable sources before making investment decisions."
      },
      {
        icon: <Info className="w-5 h-5 text-blue-600" />,
        title: "Watch for Pump & Dump",
        description: "Be cautious of overhyped stocks or cryptocurrencies being promoted heavily on social media."
      },
      {
        icon: <Info className="w-5 h-5 text-blue-600" />,
        title: "Market Warnings",
        description: "Stay informed about regulatory warnings and market alerts from official financial authorities."
      },
      {
        icon: <Info className="w-5 h-5 text-blue-600" />,
        title: "Fact-Check Analysis",
        description: "Cross-reference investment analysis and predictions with multiple credible sources."
      },
      {
        icon: <Info className="w-5 h-5 text-blue-600" />,
        title: "Beware of FOMO",
        description: "Don't let fear of missing out drive your investment decisions. Take time to research thoroughly."
      }
    ]
  };

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
              <div className="inline-flex items-center gap-2 bg-green-800/50 text-green-300 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                <Shield className="w-4 h-4" />
                <span>Investment Security</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-green-300">Trading Security</span> Center
              </h1>
              
              <p className="text-lg text-gray-300">
                Stay safe in the financial world with our comprehensive security resources. Learn to identify scams, 
                protect your accounts, and make informed decisions based on reliable information.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-3">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg">
                  <Link href="#security-tips" className="flex items-center">
                    View Security Tips
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-sm text-gray-300">Scam Detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-sm text-gray-300">Account Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-sm text-gray-300">Information Verification</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-80 lg:h-auto">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 bg-green-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl">
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
                    
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Bell className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            <span className="font-medium">REMINDER:</span> Never share your account credentials with anyone, including Travidox support staff.
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
      
      {/* Security Tips Section */}
      <section id="security-tips" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                  className={`px-4 py-2 text-sm font-medium ${activeTab === "news" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                  onClick={() => setActiveTab("news")}
                >
                  Financial News
                </button>
              </div>

              <div className="space-y-4 pt-2">
                {securityTips[activeTab].map((tip, index) => (
                  <div key={index} className="flex p-3 bg-white rounded-lg shadow-sm border border-gray-100">
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
                <Link href="/products/security-center/guide" className="flex items-center">
                  View Complete Security Guide
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Lock className="w-6 h-6 text-green-600 mr-3" />
                  Security Checklist
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Enable Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Use a Strong, Unique Password</h4>
                      <p className="text-sm text-gray-600">Create a password that's at least 12 characters with a mix of characters.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Set Up Activity Notifications</h4>
                      <p className="text-sm text-gray-600">Get alerts for login attempts and account changes.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Verify Contact Information</h4>
                      <p className="text-sm text-gray-600">Keep your email and phone number up to date for secure communications.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Regularly Review Account Activity</h4>
                      <p className="text-sm text-gray-600">Monitor your transactions and login history for suspicious activity.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                  Red Flags to Watch For
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Unsolicited investment opportunities or "hot tips"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Promises of guaranteed high returns with no risk</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Pressure to invest quickly before a "limited opportunity" ends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Requests to wire money to overseas accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Emails with suspicious links or attachments</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Security Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>Platform Security</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How We Protect Your Investments</h2>
            <p className="text-lg text-gray-600">
              At Travidox, your security is our top priority. We've implemented multiple layers of protection
              to keep your investments and personal information safe.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Encryption</h3>
              <p className="text-gray-600 mb-4">
                We use bank-level 256-bit encryption to protect all sensitive data and transactions,
                ensuring your information remains private and secure.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Fingerprint className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h3>
              <p className="text-gray-600 mb-4">
                Add an extra layer of security to your account with our two-factor authentication system,
                preventing unauthorized access even if your password is compromised.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Monitoring</h3>
              <p className="text-gray-600 mb-4">
                Our security team continuously monitors for suspicious activities and potential threats,
                taking immediate action to protect your account and investments.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Alerts</h3>
              <p className="text-gray-600 mb-4">
                Receive immediate notifications about account activities, including logins, trades,
                and changes to your security settings.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Regulatory Compliance</h3>
              <p className="text-gray-600 mb-4">
                We adhere to strict financial regulations and security standards, ensuring your
                investments are protected in accordance with industry best practices.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Security Education</h3>
              <p className="text-gray-600 mb-4">
                Access comprehensive resources to help you understand and implement best security
                practices for your investment activities.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Report Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-100">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-16 h-16 text-yellow-600" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Report Suspicious Activity</h2>
                  <p className="text-gray-600 mb-6">
                    If you suspect a scam or notice suspicious activity related to your account or Travidox, 
                    please report it immediately. Your vigilance helps protect our entire community.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      <Link href="/support/report" className="flex items-center">
                        Report Suspicious Activity
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                      <Link href="/products/security-center/phishing" className="flex items-center">
                        Learn About Phishing
                        <FileText className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Secure Your Trading Experience</h2>
            <p className="text-xl text-green-100 mb-8">
              Take control of your security today. Review our comprehensive security guide and
              implement the recommended practices to keep your investments safe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-900 hover:bg-gray-100">
                <Link href="/products/security-center/guide">Security Guide</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link href="/account/security">Secure Your Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 