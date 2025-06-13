"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Scale, ChevronDown, ArrowRight, CalendarClock, 
  Mail, FileText, Printer, Download
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

export default function TermsOfServicePage() {
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
              <Scale className="w-6 h-6 text-amber-400" />
              <p className="text-amber-400 font-medium">Legal</p>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms of Service
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
                <p>
                  Welcome to Travidox. These Terms of Service ("Terms") govern your access to and use of the Travidox website, mobile applications, and investment services (collectively, the "Services"). Please read these Terms carefully before using our Services.
                </p>
                <p>
                  By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.
                </p>
                
                <div className="space-y-6 mt-8">
                  <PolicySection title="1. Acceptance of Terms" defaultOpen={true}>
                    <p>
                      By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our Privacy Policy and any other policies referenced herein.
                    </p>
                    <p className="mt-4">
                      We may modify these Terms at any time. If we make material changes, we will notify you through the Services or by other means. Your continued use of the Services after such notification constitutes your acceptance of the modified Terms.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="2. Eligibility">
                    <p>
                      To use our Services, you must:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Be at least 18 years old</li>
                      <li>Have the legal capacity to enter into these Terms</li>
                      <li>Not be prohibited from using the Services under applicable law</li>
                      <li>Complete our verification process</li>
                    </ul>
                    <p className="mt-4">
                      By using our Services, you represent and warrant that you meet all eligibility requirements.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="3. Account Registration and Security">
                    <p>
                      To access certain features of our Services, you must create an account. When registering, you agree to:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Provide accurate, current, and complete information</li>
                      <li>Maintain and promptly update your account information</li>
                      <li>Keep your account credentials confidential</li>
                      <li>Notify us immediately of any unauthorized use of your account</li>
                    </ul>
                    <p className="mt-4">
                      You are responsible for all activities that occur under your account. We reserve the right to suspend or terminate your account if any information provided is inaccurate, outdated, or incomplete.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="4. Investment Services">
                    <p>
                      Our Services provide tools for investing in various financial markets. By using these Services, you acknowledge that:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Investing involves risk, including the potential loss of principal</li>
                      <li>Past performance is not indicative of future results</li>
                      <li>We do not provide personalized investment advice or recommendations</li>
                      <li>You are solely responsible for your investment decisions</li>
                      <li>Market data may be delayed or inaccurate</li>
                    </ul>
                    <p className="mt-4">
                      Before making any investment, you should conduct your own research and consider seeking advice from an independent financial advisor.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="5. Fees and Payments">
                    <p>
                      We charge fees for certain Services as described on our website or mobile application. By using our Services, you agree to pay all applicable fees.
                    </p>
                    <p className="mt-4">
                      We may modify our fee structure at any time by posting updates on our website or mobile application. Your continued use of the Services after such notification constitutes your acceptance of the modified fees.
                    </p>
                    <p className="mt-4">
                      All payments are non-refundable except as expressly provided in these Terms or as required by applicable law.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="6. User Conduct">
                    <p>
                      When using our Services, you agree not to:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Violate any applicable law, regulation, or third-party rights</li>
                      <li>Use the Services for illegal or unauthorized purposes</li>
                      <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                      <li>Interfere with or disrupt the integrity or performance of the Services</li>
                      <li>Engage in market manipulation or fraudulent activities</li>
                      <li>Use the Services to transmit harmful code or conduct phishing attacks</li>
                      <li>Scrape, data mine, or extract data from our Services without permission</li>
                    </ul>
                  </PolicySection>
                  
                  <PolicySection title="7. Intellectual Property">
                    <p>
                      The Services and all content, features, and functionality thereof, including but not limited to text, graphics, logos, icons, images, audio clips, and software, are owned by Travidox or its licensors and are protected by copyright, trademark, and other intellectual property laws.
                    </p>
                    <p className="mt-4">
                      We grant you a limited, non-exclusive, non-transferable, and revocable license to access and use the Services for personal, non-commercial purposes in accordance with these Terms.
                    </p>
                    <p className="mt-4">
                      You may not:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Reproduce, distribute, modify, or create derivative works of the Services</li>
                      <li>Use the Services for commercial purposes without our prior written consent</li>
                      <li>Remove any copyright, trademark, or other proprietary notices</li>
                    </ul>
                  </PolicySection>
                  
                  <PolicySection title="8. Third-Party Services">
                    <p>
                      Our Services may integrate with or contain links to third-party websites, applications, or services. We do not control or endorse these third-party services and are not responsible for their content, privacy practices, or terms of use.
                    </p>
                    <p className="mt-4">
                      Your interactions with third-party services are solely between you and the third party. We encourage you to review the terms and privacy policies of any third-party services you access through our Services.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="9. Disclaimer of Warranties">
                    <p>
                      THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                    </p>
                    <p className="mt-4">
                      WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICES OR THE SERVERS THAT MAKE THE SERVICES AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="10. Limitation of Liability">
                    <p>
                      TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL TRAVIDOX, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO YOUR USE OF OR INABILITY TO USE THE SERVICES.
                    </p>
                    <p className="mt-4">
                      OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THESE TERMS OR YOUR USE OF THE SERVICES SHALL NOT EXCEED THE AMOUNT PAID BY YOU TO TRAVIDOX DURING THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO SUCH LIABILITY.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="11. Indemnification">
                    <p>
                      You agree to indemnify, defend, and hold harmless Travidox, its affiliates, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, or expenses, including reasonable attorneys' fees, arising out of or in any way connected with:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Your access to or use of the Services</li>
                      <li>Your violation of these Terms</li>
                      <li>Your violation of any third-party right, including privacy or intellectual property rights</li>
                      <li>Any content you submit through the Services</li>
                    </ul>
                  </PolicySection>
                  
                  <PolicySection title="12. Termination">
                    <p>
                      We may suspend or terminate your access to the Services at any time, with or without cause and with or without notice, for any reason, including but not limited to your violation of these Terms.
                    </p>
                    <p className="mt-4">
                      Upon termination:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Your right to access and use the Services will immediately cease</li>
                      <li>We may delete or archive your account data</li>
                      <li>Any fees paid are non-refundable unless required by law</li>
                    </ul>
                    <p className="mt-4">
                      All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="13. Governing Law and Dispute Resolution">
                    <p>
                      These Terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions.
                    </p>
                    <p className="mt-4">
                      Any dispute arising out of or relating to these Terms or your use of the Services shall be resolved through:
                    </p>
                    <ol className="list-decimal pl-6 space-y-1">
                      <li>Informal negotiation: We will attempt to resolve any disputes informally.</li>
                      <li>Mediation: If negotiation fails, the parties will engage in mediation with a mutually agreed-upon mediator.</li>
                      <li>Arbitration: If mediation fails, the dispute shall be resolved through binding arbitration in accordance with the rules of the Nigerian Arbitration and Conciliation Act.</li>
                    </ol>
                  </PolicySection>
                  
                  <PolicySection title="14. Contact Information">
                    <p>
                      If you have any questions or concerns about these Terms, please contact us at:
                    </p>
                    <p className="mt-4">
                      Email: <Link href="mailto:hellotravidox@gmail.com" className="text-amber-600 hover:text-amber-700">hellotravidox@gmail.com</Link>
                    </p>
                    <p>
                      Address: Travidox Headquarters, 25 Marina Street, Lagos, Nigeria
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