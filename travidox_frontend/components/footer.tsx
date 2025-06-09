import Link from "next/link"
import { TrendingUp, Twitter, Linkedin, Instagram, Mail, Shield, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthButton } from "@/components/auth/auth-button"

// Define types for the footer links
interface FooterLink {
  name: string;
  href: string;
}

interface FooterLinksByCategory {
  [key: string]: FooterLink[];
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
    <footer className="bg-gray-900 text-white py-10 md:py-14 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10">
          {/* Brand and Description - takes 4 columns on large screens */}
          <div className="lg:col-span-4 space-y-4 md:space-y-5 order-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold">travidox</span>
            </Link>
            <p className="text-gray-400 text-sm md:text-base pr-4 max-w-md">
              Empowering Nigerians to build wealth through smart investing in local and global markets. Start your journey to financial freedom today with our AI-powered tools.
            </p>
            <div className="flex items-start space-x-4">
              <AuthButton 
                variant="outline" 
                size="sm" 
                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white text-xs md:text-sm"
              />
              
              <div className="flex space-x-2">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 transition-all">
                  <Twitter className="w-3 h-3 md:w-4 md:h-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 transition-all">
                  <Linkedin className="w-3 h-3 md:w-4 md:h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 transition-all">
                  <Instagram className="w-3 h-3 md:w-4 md:h-4" />
                </a>
                <a href="mailto:contact@travidox.com" className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 transition-all">
                  <Mail className="w-3 h-3 md:w-4 md:h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Products section - takes 2 columns on large screens */}
          <div className="lg:col-span-2 order-2 md:order-3">
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Products</h3>
            <ul className="space-y-2 md:space-y-3">
              {productLinks.map((link) => (
                <li key={link.name} className="group flex items-center">
                  <ChevronRight className="w-3 h-3 text-green-500 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Link href={link.href} className="text-xs md:text-sm text-gray-400 hover:text-green-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company section - takes 2 columns on large screens */}
          <div className="lg:col-span-2 order-3 md:order-4">
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Company</h3>
            <ul className="space-y-2 md:space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name} className="group flex items-center">
                  <ChevronRight className="w-3 h-3 text-green-500 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Link href={link.href} className="text-xs md:text-sm text-gray-400 hover:text-green-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support section - takes 2 columns on large screens */}
          <div className="lg:col-span-2 order-4 md:order-5">
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Support</h3>
            <ul className="space-y-2 md:space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name} className="group flex items-center">
                  <ChevronRight className="w-3 h-3 text-green-500 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Link href={link.href} className="text-xs md:text-sm text-gray-400 hover:text-green-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal section - takes 2 columns on large screens, positioned at top-right on desktop */}
          <div className="lg:col-span-2 order-5 md:order-2">
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Legal</h3>
            <ul className="space-y-2 md:space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name} className="group flex items-center">
                  <ChevronRight className="w-3 h-3 text-green-500 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Link href={link.href} className="text-xs md:text-sm text-gray-400 hover:text-green-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs md:text-sm">© {new Date().getFullYear()} Travidox. All rights reserved.</p>
          <div className="flex items-center text-gray-400 text-xs md:text-sm mt-3 sm:mt-0">
            <Shield className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <p>Securities offered through Travidox Securities LLC</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 