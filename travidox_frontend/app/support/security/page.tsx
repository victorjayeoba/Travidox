"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Shield, Lock, KeyRound, Eye, AlertTriangle, 
  CheckCircle, HelpCircle, ExternalLink, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SecurityFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface SecurityFAQ {
  question: string;
  answer: React.ReactNode;
}

const SecuritySection = ({ 
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

export default function SecurityPage() {
  const securityFeatures: SecurityFeature[] = [
    {
      icon: <Lock className="w-6 h-6 text-green-600" />,
      title: "End-to-End Encryption",
      description: "All data transmitted between your device and our servers is encrypted using industry-standard TLS 1.3 protocols, ensuring your information remains private and secure."
    },
    {
      icon: <KeyRound className="w-6 h-6 text-green-600" />,
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account with 2FA, requiring both your password and a verification code sent to your mobile device or email."
    },
    {
      icon: <Eye className="w-6 h-6 text-green-600" />,
      title: "Biometric Authentication",
      description: "Access your account securely using fingerprint or facial recognition on supported devices, providing both convenience and enhanced security."
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-green-600" />,
      title: "Fraud Monitoring",
      description: "Our advanced AI systems continuously monitor for suspicious activities and unusual patterns to protect your account from unauthorized access."
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Secure Data Storage",
      description: "Your sensitive information is stored using strong encryption and follows strict access control policies, with regular security audits and penetration testing."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      title: "Compliance & Certification",
      description: "We adhere to international security standards and best practices, including ISO 27001 and PCI DSS, to ensure the highest level of security for your data."
    }
  ];
  
  const securityFAQs: SecurityFAQ[] = [
    {
      question: "How does Travidox protect my personal and financial information?",
      answer: (
        <p>
          Travidox employs multiple layers of security measures, including end-to-end encryption, secure data storage, and strict access controls. All sensitive data is encrypted both in transit and at rest, and we follow industry best practices for data protection. Our security team regularly conducts audits and penetration tests to identify and address potential vulnerabilities.
        </p>
      )
    },
    {
      question: "What should I do if I notice suspicious activity on my account?",
      answer: (
        <>
          <p className="mb-3">
            If you notice any suspicious activity on your account, please take the following steps immediately:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Change your password immediately</li>
            <li>Enable two-factor authentication if not already enabled</li>
            <li>Contact our security team at <Link href="mailto:security@travidox.com" className="text-green-600 hover:text-green-700">security@travidox.com</Link></li>
            <li>Review your recent account activities and transactions</li>
            <li>Update your email password as well, especially if it's linked to your Travidox account</li>
          </ol>
        </>
      )
    },
    {
      question: "How can I make my account more secure?",
      answer: (
        <>
          <p className="mb-3">
            To enhance your account security, we recommend the following practices:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use a strong, unique password that you don't use for other services</li>
            <li>Enable two-factor authentication</li>
            <li>Set up biometric authentication on supported devices</li>
            <li>Regularly review your account activity</li>
            <li>Keep your contact information up to date</li>
            <li>Be cautious of phishing attempts and only access Travidox through official channels</li>
            <li>Keep your device's operating system and browser updated</li>
          </ul>
        </>
      )
    },
    {
      question: "Does Travidox share my data with third parties?",
      answer: (
        <p>
          Travidox only shares your data with third parties when necessary to provide our services, comply with legal obligations, or with your explicit consent. We never sell your personal information to third parties for marketing purposes. For detailed information about how we handle your data, please refer to our <Link href="/legal/privacy" className="text-green-600 hover:text-green-700">Privacy Policy</Link>.
        </p>
      )
    },
    {
      question: "How often does Travidox update its security systems?",
      answer: (
        <p>
          We continuously monitor and update our security systems to address emerging threats and vulnerabilities. Our security team conducts regular assessments and implements patches and updates promptly. We also perform comprehensive security audits quarterly and engage third-party security experts for annual penetration testing to ensure our systems remain robust against evolving threats.
        </p>
      )
    }
  ];
  
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-20 md:pt-20 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-amber-400" />
              <p className="text-amber-400 font-medium">Support</p>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Security Center
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your security is our top priority. Learn about the measures we take to protect your data and investments.
            </p>
          </div>
        </div>
      </section>
      
      {/* Security Features Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Protect You</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Travidox employs multiple layers of security to ensure your personal information and investments are protected at all times.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Security Practices Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Security Practices</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Learn about the comprehensive security measures we implement to safeguard your information and assets.
              </p>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="space-y-6">
                <SecuritySection title="Data Encryption" defaultOpen={true}>
                  <p>
                    All sensitive data on Travidox is encrypted using industry-standard encryption protocols:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>TLS 1.3 encryption for all data in transit</li>
                    <li>AES-256 encryption for data at rest</li>
                    <li>End-to-end encryption for sensitive communications</li>
                    <li>Secure key management practices</li>
                  </ul>
                  <p className="mt-3">
                    Our encryption practices ensure that your personal and financial information remains protected from unauthorized access, both during transmission and storage.
                  </p>
                </SecuritySection>
                
                <SecuritySection title="Authentication & Access Control">
                  <p>
                    We implement robust authentication mechanisms and strict access controls:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Multi-factor authentication options (SMS, email, authenticator apps)</li>
                    <li>Biometric authentication support (fingerprint, facial recognition)</li>
                    <li>Automatic session timeouts after periods of inactivity</li>
                    <li>IP-based login restrictions and anomaly detection</li>
                    <li>Role-based access control for internal systems</li>
                  </ul>
                  <p className="mt-3">
                    These measures help prevent unauthorized access to your account, even if your password is compromised.
                  </p>
                </SecuritySection>
                
                <SecuritySection title="Fraud Prevention">
                  <p>
                    Our advanced fraud detection systems continuously monitor for suspicious activities:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>AI-powered behavioral analysis to detect unusual patterns</li>
                    <li>Real-time transaction monitoring</li>
                    <li>Device fingerprinting and risk assessment</li>
                    <li>Automated alerts for suspicious activities</li>
                    <li>Dedicated fraud investigation team</li>
                  </ul>
                  <p className="mt-3">
                    Our systems can detect and prevent fraudulent activities before they impact your account, providing an additional layer of protection for your investments.
                  </p>
                </SecuritySection>
                
                <SecuritySection title="Infrastructure Security">
                  <p>
                    Our infrastructure is designed with security as a fundamental principle:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Secure cloud infrastructure with redundancy across multiple regions</li>
                    <li>Regular security patches and updates</li>
                    <li>Network segmentation and firewalls</li>
                    <li>DDoS protection and mitigation</li>
                    <li>24/7 infrastructure monitoring</li>
                  </ul>
                  <p className="mt-3">
                    We maintain a robust and secure infrastructure to ensure the availability, integrity, and confidentiality of our services and your data.
                  </p>
                </SecuritySection>
                
                <SecuritySection title="Compliance & Auditing">
                  <p>
                    We adhere to international security standards and regularly audit our systems:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>ISO 27001 certified information security management</li>
                    <li>Compliance with financial regulations in Nigeria</li>
                    <li>Regular internal and external security audits</li>
                    <li>Penetration testing by independent security firms</li>
                    <li>Comprehensive security incident response plan</li>
                  </ul>
                  <p className="mt-3">
                    Our commitment to compliance and regular auditing ensures that we maintain the highest security standards and continuously improve our security posture.
                  </p>
                </SecuritySection>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Security Tips Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Security Tips for Users</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Follow these best practices to enhance the security of your Travidox account and protect your investments.
              </p>
            </div>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <HelpCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-green-700">
                    While we implement robust security measures on our end, your security practices also play a crucial role in protecting your account and investments.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">1</span>
                  Use Strong, Unique Passwords
                </h3>
                <p className="text-gray-600">
                  Create a strong password that's at least 12 characters long, using a mix of uppercase and lowercase letters, numbers, and special characters. Never reuse passwords across different services, and consider using a password manager to generate and store secure passwords.
                </p>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">2</span>
                  Enable Two-Factor Authentication
                </h3>
                <p className="text-gray-600">
                  Always enable 2FA on your Travidox account. This adds an extra layer of security by requiring a verification code in addition to your password. You can set up 2FA in your account settings, choosing between SMS, email, or authenticator app options.
                </p>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">3</span>
                  Be Wary of Phishing Attempts
                </h3>
                <p className="text-gray-600">
                  Always verify the authenticity of emails, messages, or calls claiming to be from Travidox. We will never ask for your password or one-time codes via email or phone. Access Travidox only by typing the URL directly in your browser or using our official mobile app.
                </p>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">4</span>
                  Keep Your Devices Secure
                </h3>
                <p className="text-gray-600">
                  Ensure your devices have the latest security updates and run up-to-date antivirus software. Lock your devices with strong passwords or biometric authentication, and avoid using public or unsecured Wi-Fi networks when accessing your Travidox account.
                </p>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">5</span>
                  Regularly Monitor Your Account
                </h3>
                <p className="text-gray-600">
                  Check your account activity regularly and enable notifications for all transactions. If you notice any suspicious activities or transactions you don't recognize, contact our security team immediately at security@travidox.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Security FAQs Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Security FAQs</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find answers to commonly asked questions about Travidox's security measures.
              </p>
            </div>
            
            <div className="space-y-6">
              {securityFAQs.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <div className="text-gray-600">{faq.answer}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Report Security Issue Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Report a Security Issue
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              If you've identified a potential security vulnerability or have concerns about your account security, please contact us immediately.
            </p>
            <div className="bg-gray-50 rounded-xl p-8 text-left">
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">Security Team Email</p>
                  <p className="text-gray-600">security@travidox.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Security Hotline</p>
                  <p className="text-gray-600">+234 (0) 123 456 7890</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Bug Bounty Program</p>
                  <Link 
                    href="/support/security/bug-bounty" 
                    className="text-green-600 hover:text-green-700 flex items-center"
                  >
                    Learn about our bug bounty program
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="mt-8">
                <Button className="bg-green-600 hover:bg-green-700">
                  Report Security Issue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 