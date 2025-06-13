"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  FileText, ChevronDown, ArrowRight, CalendarClock, 
  Mail, Printer, Download, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const PolicySection = ({ 
  title, 
  children, 
  defaultOpen = false 
}: { 
  title: string; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="border-b border-gray-200 pb-6 pt-4">
      <button
        className="flex items-center justify-between w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="mt-4 text-gray-600 space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

export default function DisclosuresPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-20 md:pt-20 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-amber-400" />
              <p className="text-amber-400 font-medium">Legal</p>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Disclosures
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-300 text-sm">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4" />
                <span>Last Updated: June 10, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <Link href="mailto:hellotravidox@gmail.com" className="hover:text-white">hellotravidox@gmail.com</Link>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                <FileText className="w-4 h-4 mr-2" />
                Previous Versions
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="prose prose-lg max-w-none text-gray-600">
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-amber-700">
                        The information provided in this document is for informational purposes only and does not constitute financial advice. Investing involves risk, including the possible loss of principal.
                      </p>
                    </div>
                  </div>
                </div>
                
                <p>
                  This Disclosures document provides important information about Travidox's services, fees, risks, and other relevant disclosures required by regulatory authorities. Please read this document carefully before using our investment platform.
                </p>
                
                <div className="space-y-6 mt-8">
                  <PolicySection title="1. Company Information" defaultOpen={true}>
                    <p>
                      Travidox is a financial technology company registered in Nigeria. Our company details are as follows:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Company Name: Travidox Financial Technologies Limited</li>
                      <li>Registration Number: RC-123456</li>
                      <li>Registered Address: 25 Marina Street, Lagos, Nigeria</li>
                      <li>Regulatory Status: Licensed by the Securities and Exchange Commission (SEC) of Nigeria</li>
                      <li>SEC License Number: SEC/FTI/12345/2025</li>
                    </ul>
                  </PolicySection>
                  
                  <PolicySection title="2. Services Provided">
                    <p>
                      Travidox provides the following services:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Online stock trading platform for Nigerian and global markets</li>
                      <li>Automated trading systems and algorithms</li>
                      <li>Market data and analysis tools</li>
                      <li>Educational resources on investing</li>
                      <li>Portfolio tracking and management tools</li>
                    </ul>
                    <p className="mt-4">
                      Our services are intended for informational and execution purposes only. We do not provide personalized investment advice or recommendations tailored to your specific financial situation.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="3. Fee Structure">
                    <p>
                      The following fees apply to our services:
                    </p>
                    
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Trading Fees</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minimum Fee</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Nigerian Stocks</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.5% of trade value</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₦100</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">US Stocks</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$0.01 per share</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$1.99</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Other International Markets</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.75% of trade value</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$2.99</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Platform Fees</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Basic Account</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Free</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">N/A</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Premium Account</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₦5,000</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Monthly</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">AI Trading Bot</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₦10,000</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Monthly</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Other Fees</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Wire Transfer (Domestic)</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₦500</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Wire Transfer (International)</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$15</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Account Inactivity Fee</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₦1,000 per quarter (after 12 months of inactivity)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <p className="mt-4">
                      All fees are subject to change. We will notify you of any changes to our fee structure at least 30 days in advance.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="4. Risk Disclosures">
                    <p>
                      Investing in financial markets involves significant risks. Before using our platform, please consider the following risks:
                    </p>
                    
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Market Risk</h4>
                    <p>
                      The value of investments can go up or down due to market conditions. Past performance is not indicative of future results. You may lose some or all of your invested capital.
                    </p>
                    
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Liquidity Risk</h4>
                    <p>
                      Some investments may be difficult to sell quickly at a reasonable price, especially during market downturns or for thinly traded securities.
                    </p>
                    
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Currency Risk</h4>
                    <p>
                      When investing in foreign markets, changes in exchange rates may affect the value of your investments.
                    </p>
                    
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Operational Risk</h4>
                    <p>
                      Technical issues, system failures, or connectivity problems may affect your ability to execute trades or access your account.
                    </p>
                    
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Regulatory and Political Risk</h4>
                    <p>
                      Changes in laws, regulations, or political conditions in Nigeria or other countries may affect your investments.
                    </p>
                    
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Automated Trading Risk</h4>
                    <p>
                      Our AI trading bots and algorithms are based on historical data and predefined strategies. There is no guarantee that these strategies will be successful in current or future market conditions.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="5. Conflict of Interest Disclosures">
                    <p>
                      Travidox is committed to transparency regarding potential conflicts of interest. We disclose the following potential conflicts:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>We may receive compensation from third-party product providers for offering their products on our platform.</li>
                      <li>Our employees may personally invest in the same securities available on our platform.</li>
                      <li>We may have business relationships with companies whose securities are available for trading on our platform.</li>
                      <li>We may use affiliated companies to execute certain transactions.</li>
                    </ul>
                    <p className="mt-4">
                      We manage these conflicts through strict internal policies, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Employee trading restrictions and disclosure requirements</li>
                      <li>Information barriers between different business units</li>
                      <li>Regular compliance reviews and audits</li>
                      <li>Transparent fee disclosures</li>
                    </ul>
                  </PolicySection>
                  
                  <PolicySection title="6. Account Protection">
                    <p>
                      Travidox takes the following measures to protect your account and assets:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Client funds are held in segregated accounts separate from our operational accounts.</li>
                      <li>We maintain appropriate insurance coverage for our operations.</li>
                      <li>We implement robust cybersecurity measures to protect your personal and financial information.</li>
                      <li>We are a member of the Nigerian Investor Protection Fund, which provides limited protection for investors in case of broker insolvency.</li>
                    </ul>
                    <p className="mt-4">
                      However, these protections do not cover losses due to market fluctuations or poor investment decisions.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="7. Tax Considerations">
                    <p>
                      Using our platform may have tax implications. Please note:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>We do not provide tax advice. You should consult with a qualified tax professional regarding your specific situation.</li>
                      <li>You are responsible for reporting and paying any applicable taxes on your investment activities.</li>
                      <li>Tax laws and regulations vary by country and may change over time.</li>
                      <li>We may be required to report certain account information to tax authorities.</li>
                    </ul>
                  </PolicySection>
                  
                  <PolicySection title="8. Regulatory Disclosures">
                    <p>
                      Travidox operates under the following regulatory framework:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Licensed by the Securities and Exchange Commission (SEC) of Nigeria</li>
                      <li>Member of the Nigerian Stock Exchange (NSE)</li>
                      <li>Registered with the Corporate Affairs Commission (CAC)</li>
                    </ul>
                    <p className="mt-4">
                      Regulatory complaints can be directed to:
                    </p>
                    <p>
                      Securities and Exchange Commission<br />
                      SEC Tower, Plot 272, Samuel Adesujo Ademulegun Street<br />
                      Central Business District, Abuja<br />
                      Nigeria<br />
                      Email: <Link href="mailto:sec@sec.gov.ng" className="text-amber-600 hover:text-amber-700">sec@sec.gov.ng</Link>
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="9. Changes to Disclosures">
                    <p>
                      We may update these disclosures from time to time to reflect changes in our services, fees, or regulatory requirements. We will notify you of any material changes through our website or by email.
                    </p>
                    <p className="mt-4">
                      The current version of these disclosures is always available on our website.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="10. Contact Information">
                    <p>
                      If you have any questions about these disclosures, please contact us at:
                    </p>
                    <p className="mt-4">
                      Email: <Link href="mailto:hellotravidox@gmail.com" className="text-amber-600 hover:text-amber-700">hellotravidox@gmail.com</Link>
                    </p>
                    <p>
                      Address: Travidox Headquarters, 25 Marina Street, Lagos, Nigeria<br />
                      Phone: +234 (0) 123 456 7890
                    </p>
                  </PolicySection>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 