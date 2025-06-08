"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Shield, ChevronDown, ArrowRight, CalendarClock, 
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

export default function PrivacyPolicyPage() {
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
              <Shield className="w-6 h-6 text-amber-400" />
              <p className="text-amber-400 font-medium">Legal</p>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-300 text-sm">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4" />
                <span>Last Updated: April 15, 2023</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <Link href="mailto:privacy@travidox.com" className="hover:text-white">privacy@travidox.com</Link>
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
                  At Travidox, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our investment platform.
                </p>
                <p>
                  Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
                </p>
                
                <div className="space-y-6 mt-8">
                  <PolicySection title="1. Information We Collect" defaultOpen={true}>
                    <p>
                      We collect information that you provide directly to us, information we collect automatically when you use our services, and information from third parties.
                    </p>
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Personal Information</h4>
                    <p>
                      When you register for an account, we may collect:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Full name</li>
                      <li>Email address</li>
                      <li>Phone number</li>
                      <li>Date of birth</li>
                      <li>Home address</li>
                      <li>Government-issued identification</li>
                      <li>Bank account information</li>
                      <li>Tax identification number</li>
                    </ul>
                    
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Usage Information</h4>
                    <p>
                      When you use our platform, we automatically collect:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Log data (IP address, browser type, pages visited)</li>
                      <li>Device information</li>
                      <li>Location information</li>
                      <li>Cookies and similar technologies</li>
                      <li>Investment activities and transactions</li>
                    </ul>
                  </PolicySection>
                  
                  <PolicySection title="2. How We Use Your Information">
                    <p>
                      We use the information we collect for various purposes, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Providing, maintaining, and improving our services</li>
                      <li>Processing your transactions and managing your account</li>
                      <li>Verifying your identity and preventing fraud</li>
                      <li>Complying with legal and regulatory requirements</li>
                      <li>Communicating with you about your account, updates, and promotions</li>
                      <li>Analyzing usage patterns to enhance user experience</li>
                      <li>Conducting research and analytics to improve our platform</li>
                    </ul>
                  </PolicySection>
                  
                  <PolicySection title="3. How We Share Your Information">
                    <p>
                      We may share your information with:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Service providers and business partners who help us deliver our services</li>
                      <li>Financial institutions and payment processors to facilitate transactions</li>
                      <li>Regulatory authorities and law enforcement as required by law</li>
                      <li>Professional advisors such as lawyers, accountants, and auditors</li>
                      <li>Potential acquirers or investors as part of a corporate transaction</li>
                    </ul>
                    <p className="mt-4">
                      We do not sell your personal information to third parties for marketing purposes.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="4. Data Security">
                    <p>
                      We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Encryption of sensitive data at rest and in transit</li>
                      <li>Regular security assessments and penetration testing</li>
                      <li>Access controls and authentication mechanisms</li>
                      <li>Employee training on data protection and security practices</li>
                      <li>Physical security measures for our facilities</li>
                    </ul>
                    <p className="mt-4">
                      While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="5. Your Rights and Choices">
                    <p>
                      Depending on your location, you may have certain rights regarding your personal information:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Access: You can request a copy of the personal information we hold about you.</li>
                      <li>Correction: You can request correction of inaccurate or incomplete information.</li>
                      <li>Deletion: You can request deletion of your personal information in certain circumstances.</li>
                      <li>Restriction: You can request that we limit how we use your data.</li>
                      <li>Portability: You can request a copy of your data in a structured, commonly used format.</li>
                      <li>Objection: You can object to our processing of your data in certain circumstances.</li>
                    </ul>
                    <p className="mt-4">
                      To exercise these rights, please contact us at <Link href="mailto:privacy@travidox.com" className="text-amber-600 hover:text-amber-700">privacy@travidox.com</Link>.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="6. Cookies and Tracking Technologies">
                    <p>
                      We use cookies and similar technologies to collect information about your browsing activities and to distinguish you from other users of our platform. These technologies help us:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Remember your preferences and settings</li>
                      <li>Understand how you use our platform</li>
                      <li>Improve our services and user experience</li>
                      <li>Provide personalized content and recommendations</li>
                      <li>Measure the effectiveness of our marketing campaigns</li>
                    </ul>
                    <p className="mt-4">
                      You can manage your cookie preferences through your browser settings. However, disabling certain cookies may limit your ability to use some features of our platform.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="7. International Data Transfers">
                    <p>
                      We operate globally and may transfer your personal information to countries other than your country of residence. These countries may have different data protection laws than your country.
                    </p>
                    <p className="mt-4">
                      When we transfer your data internationally, we implement appropriate safeguards to ensure your information receives an adequate level of protection, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Standard contractual clauses approved by regulatory authorities</li>
                      <li>Data protection agreements with service providers</li>
                      <li>Compliance with applicable legal frameworks for international transfers</li>
                    </ul>
                  </PolicySection>
                  
                  <PolicySection title="8. Data Retention">
                    <p>
                      We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements.
                    </p>
                    <p className="mt-4">
                      The specific retention periods depend on:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>The type of information</li>
                      <li>Legal and regulatory requirements</li>
                      <li>Whether you maintain an active account</li>
                      <li>Business and operational needs</li>
                    </ul>
                    <p className="mt-4">
                      When personal information is no longer needed, we securely delete or anonymize it.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="9. Children's Privacy">
                    <p>
                      Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child, we will take steps to delete that information as soon as possible.
                    </p>
                    <p className="mt-4">
                      If you believe we have collected information from a child, please contact us at <Link href="mailto:privacy@travidox.com" className="text-amber-600 hover:text-amber-700">privacy@travidox.com</Link>.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="10. Changes to This Privacy Policy">
                    <p>
                      We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Posting the updated policy on our website</li>
                      <li>Sending an email notification</li>
                      <li>Displaying a notice when you access our platform</li>
                    </ul>
                    <p className="mt-4">
                      Your continued use of our services after the effective date of the revised Privacy Policy constitutes your acceptance of the changes.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="11. Contact Us">
                    <p>
                      If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
                    </p>
                    <div className="mt-4 space-y-2">
                      <p><strong>Email:</strong> <Link href="mailto:privacy@travidox.com" className="text-amber-600 hover:text-amber-700">privacy@travidox.com</Link></p>
                      <p><strong>Address:</strong> Travidox Headquarters, Victoria Island, Lagos, Nigeria</p>
                      <p><strong>Phone:</strong> +234 (0) 1234 5678</p>
                    </div>
                    <p className="mt-4">
                      We will respond to your inquiries as soon as possible and within the timeframe required by applicable law.
                    </p>
                  </PolicySection>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} Travidox. All rights reserved.
                  </p>
                  <div className="flex gap-4">
                    <Link href="/legal/terms" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                      Terms of Service
                    </Link>
                    <Link href="/legal/cookies" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                      Cookie Policy
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 bg-amber-50 p-6 rounded-xl border border-amber-100">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 rounded-lg p-2 flex-shrink-0">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Need More Information?</h3>
                  <p className="text-gray-600 mb-4">
                    If you have questions about our privacy practices or how we handle your personal information,
                    our privacy team is here to help.
                  </p>
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Link href="/support/contact" className="flex items-center">
                      Contact Privacy Team
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 