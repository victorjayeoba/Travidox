'use client'

import Link from "next/link"
import { X, Linkedin, Instagram, Mail, Shield, ChevronRight, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthButton } from "@/components/auth/auth-button"
import { Logo } from "@/components/ui/logo"
// Import Font Awesome components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faXTwitter } from '@fortawesome/free-brands-svg-icons'

// Add icons to the library
library.add(faXTwitter)

// Define types for the footer links
interface FooterLink {
  name: string;
  href: string;
}

export function Footer() {
  // Define link sections
  const productLinks: FooterLink[] = [
    { name: "Stock Trading", href: "/products/stock-trading" },
    { name: "Trading Bot", href: "/products/trading-bot" },
    { name: "Learning Center", href: "/products/learning-center" },
    { name: "Certifications", href: "/products/certifications" },
    { name: "Demo Trading", href: "/products/demo-trading" },
    { name: "AI Insights", href: "/products/ai-insights" },
    { name: "Security Center", href: "/products/security-center" },
  ];
  
  const companyLinks: FooterLink[] = [
    { name: "About Us", href: "/company/about" },
    { name: "Careers", href: "/company/careers" },
    { name: "Press", href: "/company/press" },
    { name: "Blog", href: "/company/blog" },
  ];
  
  const supportLinks: FooterLink[] = [
    { name: "Help Center", href: "/support/help" },
    { name: "Contact Us", href: "/support/contact" },
    { name: "Security", href: "/support/security" },
    { name: "Status", href: "/support/status" },
  ];
  
  const legalLinks: FooterLink[] = [
    { name: "Privacy Policy", href: "/legal/privacy" },
    { name: "Terms of Service", href: "/legal/terms" },
    { name: "Cookie Policy", href: "/legal/cookies" },
    { name: "Disclosures", href: "/legal/disclosures" },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Stay ahead of the markets
            </h3>
            <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
              Get weekly insights, market updates, and exclusive investment tips delivered to your inbox.
            </p>
            <div className="flex  items-center justify-center flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
              />
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
                Subscribe
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand and Description */}
            <div className="lg:col-span-2 space-y-6">
              <Logo href="/" size="lg" variant="white" />
              <p className="text-gray-400 text-base leading-relaxed">
                Empowering Nigerians to build wealth through smart investing in local and global markets. Your trusted partner for financial growth.
              </p>
              
              {/* Social Media Links */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm font-medium">Follow us:</span>
                <div className="flex space-x-3">
                  <a 
                    href="https://x.com/travidox" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 transition-all duration-200 hover:scale-110"
                    aria-label="Follow us on X (formerly Twitter)"
                  >
                    <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://linkedin.com/company/travidox" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 transition-all duration-200 hover:scale-110"
                    aria-label="Follow us on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                </a>
                  <a 
                    href="https://instagram.com/travidox" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 transition-all duration-200 hover:scale-110"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                </a>
                  <a 
                    href="mailto:hellotravidox@gmail.com" 
                    className="group w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 transition-all duration-200 hover:scale-110"
                    aria-label="Email us"
                  >
                    <Mail className="w-4 h-4" />
                </a>
              </div>
              </div>
              
              {/* CTA Button */}
              <div className="pt-2">
                <AuthButton 
                  variant="default" 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-200 hover:scale-105"
                  defaultRoute="signup"
                  text="Start Investing"
                />
            </div>
          </div>

            {/* Products Section */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-base">Products</h3>
              <ul className="space-y-3">
              {productLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200 flex items-center group"
                    >
                      <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {link.name}
                      </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

            {/* Company Section */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-base">Company</h3>
              <ul className="space-y-3">
              {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200 flex items-center group"
                    >
                      <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {link.name}
                      </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

            {/* Support Section */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-base">Support</h3>
              <ul className="space-y-3">
              {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200 flex items-center group"
                    >
                      <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {link.name}
                      </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

            {/* Legal Section */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-base">Legal</h3>
              <ul className="space-y-3">
              {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200 flex items-center group"
                    >
                      <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {link.name}
                      </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Travidox. All rights reserved.
              </p>
              <div className="hidden sm:flex items-center text-gray-400 text-sm">
                <Shield className="w-4 h-4 mr-2 text-green-500" />
                <span>Securities offered through Travidox Securities LLC</span>
              </div>
            </div>
            
            {/* Back to Top */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center space-x-2 text-gray-400 hover:text-green-400 text-sm transition-colors duration-200"
            >
              <span>Back to top</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </button>
        </div>

          {/* Mobile Security Text */}
          <div className="sm:hidden flex items-center justify-center text-gray-400 text-sm mt-4">
            <Shield className="w-4 h-4 mr-2 text-green-500" />
            <span>Securities offered through Travidox Securities LLC</span>
          </div>
        </div>
      </div>
    </footer>
  );
} 