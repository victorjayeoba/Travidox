"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Cookie, ChevronDown, ArrowRight, CalendarClock, 
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

export default function CookiePolicyPage() {
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
              <Cookie className="w-6 h-6 text-amber-400" />
              <p className="text-amber-400 font-medium">Legal</p>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cookie Policy
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
                  This Cookie Policy explains how Travidox ("we", "us", or "our") uses cookies and similar technologies to recognize you when you visit our website or use our investment platform. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                </p>
                <p>
                  Please read this Cookie Policy carefully. If you do not agree with our use of cookies, please discontinue your use of our services.
                </p>
                
                <div className="space-y-6 mt-8">
                  <PolicySection title="1. What Are Cookies?" defaultOpen={true}>
                    <p>
                      Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
                    </p>
                    <p className="mt-4">
                      Cookies set by the website owner (in this case, Travidox) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="2. Why Do We Use Cookies?">
                    <p>
                      We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website and services to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our website. Third parties serve cookies through our website for advertising, analytics, and other purposes.
                    </p>
                    <p className="mt-4">
                      The specific types of first and third-party cookies served through our website and the purposes they perform are described below.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="3. Types of Cookies We Use">
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Essential Cookies</h4>
                    <p>
                      These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the website, you cannot refuse them without impacting how our website functions.
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Authentication cookies</li>
                      <li>Security cookies</li>
                      <li>Session state cookies</li>
                      <li>Load balancing cookies</li>
                    </ul>
                    
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Performance and Functionality Cookies</h4>
                    <p>
                      These cookies are used to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Language preference cookies</li>
                      <li>Customization cookies</li>
                      <li>Feature detection cookies</li>
                    </ul>
                    
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Analytics and Customization Cookies</h4>
                    <p>
                      These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you.
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Google Analytics</li>
                      <li>Hotjar</li>
                      <li>User behavior tracking cookies</li>
                    </ul>
                    
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Advertising Cookies</h4>
                    <p>
                      These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Google Ads</li>
                      <li>Facebook Pixel</li>
                      <li>Retargeting cookies</li>
                    </ul>
                    
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Social Media Cookies</h4>
                    <p>
                      These cookies are used to enable you to share pages and content that you find interesting on our website through third-party social networking and other websites. These cookies may also be used for advertising purposes.
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Facebook cookies</li>
                      <li>Twitter cookies</li>
                      <li>LinkedIn cookies</li>
                    </ul>
                  </PolicySection>
                  
                  <PolicySection title="4. How to Control Cookies">
                    <p>
                      You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences in the following ways:
                    </p>
                    
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Browser Controls</h4>
                    <p>
                      Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you. It may also stop you from saving customized settings like login information.
                    </p>
                    
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Cookie Preference Tool</h4>
                    <p>
                      We provide a cookie preference tool on our website that allows you to accept or reject different categories of cookies. You can access this tool through the "Cookie Settings" link in the footer of our website.
                    </p>
                    
                    <h4 className="font-bold text-gray-800 mt-4 mb-2">Specific Opt-Out Mechanisms</h4>
                    <p>
                      For analytics cookies, you can opt out of Google Analytics by downloading and installing the browser plugin available at: <Link href="https://tools.google.com/dlpage/gaoptout" className="text-amber-600 hover:text-amber-700" target="_blank">https://tools.google.com/dlpage/gaoptout</Link>.
                    </p>
                    <p className="mt-2">
                      For advertising cookies, you can opt out of personalized advertising by visiting:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li><Link href="https://www.aboutads.info/choices/" className="text-amber-600 hover:text-amber-700" target="_blank">Digital Advertising Alliance</Link></li>
                      <li><Link href="https://youradchoices.ca/" className="text-amber-600 hover:text-amber-700" target="_blank">Digital Advertising Alliance of Canada</Link></li>
                      <li><Link href="https://www.youronlinechoices.eu/" className="text-amber-600 hover:text-amber-700" target="_blank">European Interactive Digital Advertising Alliance</Link></li>
                    </ul>
                  </PolicySection>
                  
                  <PolicySection title="5. Cookies We Use">
                    <p>
                      The table below provides more information about the specific cookies we use and the purposes for which we use them:
                    </p>
                    
                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cookie Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_session</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Travidox</td>
                            <td className="px-6 py-4 text-sm text-gray-500">Used to maintain your session and authentication state</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Session</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_csrf</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Travidox</td>
                            <td className="px-6 py-4 text-sm text-gray-500">Used to prevent cross-site request forgery attacks</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Session</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_ga</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Google Analytics</td>
                            <td className="px-6 py-4 text-sm text-gray-500">Used to distinguish users for analytics purposes</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 years</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_gid</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Google Analytics</td>
                            <td className="px-6 py-4 text-sm text-gray-500">Used to distinguish users for analytics purposes</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">24 hours</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_fbp</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Facebook</td>
                            <td className="px-6 py-4 text-sm text-gray-500">Used by Facebook to deliver advertisements</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 months</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </PolicySection>
                  
                  <PolicySection title="6. Other Tracking Technologies">
                    <p>
                      Cookies are not the only way to recognize or track visitors to a website. We may use other, similar technologies from time to time, like web beacons (sometimes called "tracking pixels" or "clear gifs"). These are tiny graphics files that contain a unique identifier that enables us to recognize when someone has visited our website or opened an email that we have sent them.
                    </p>
                    <p className="mt-4">
                      This allows us, for example, to monitor the traffic patterns of users from one page within our website to another, to deliver or communicate with cookies, to understand whether you have come to our website from an online advertisement displayed on a third-party website, to improve site performance, and to measure the success of email marketing campaigns.
                    </p>
                    <p className="mt-4">
                      In many instances, these technologies are reliant on cookies to function properly, and so declining cookies will impair their functioning.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="7. Updates to This Cookie Policy">
                    <p>
                      We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                    </p>
                    <p className="mt-4">
                      The date at the top of this Cookie Policy indicates when it was last updated.
                    </p>
                  </PolicySection>
                  
                  <PolicySection title="8. Contact Us">
                    <p>
                      If you have any questions about our use of cookies or other technologies, please contact us at:
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