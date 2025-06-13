'use client'

import Link from "next/link"
import { Shield, ArrowRight, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons'

const productLinks = [
  { name: "Stock Trading", href: "/products/stock-trading" },
  { name: "Trading Bot", href: "/products/trading-bot" },
  { name: "Learning Center", href: "/products/learning-center" },
];

const companyLinks = [
  { name: "About Us", href: "/company/about" },
  { name: "Careers", href: "/company/careers" },
  { name: "Press", href: "/company/press" },
];

const supportLinks = [
  { name: "Help Center", href: "/support/help" },
  { name: "Contact Us", href: "/support/contact" },
  { name: "Status", href: "/support/status" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/legal/privacy" },
  { name: "Terms of Service", href: "/legal/terms" },
  { name: "Disclosures", href: "/legal/disclosures" },
];

const socialLinks = [
  { href: "https://x.com/travidox", icon: faXTwitter, label: "X (Twitter)" },
  { href: "https://linkedin.com/company/travidox", icon: faLinkedin, label: "LinkedIn" },
  { href: "https://instagram.com/travidox", icon: faInstagram, label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="bg-grey-heading text-gray-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16 border-b border-gray-700">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Stay Ahead of the Markets
              </h3>
              <p className="text-base">
                Get weekly insights, market updates, and exclusive investment tips delivered to your inbox.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors"
                aria-label="Email for newsletter"
              />
              <Button type="submit" size="lg" className="bg-brand-green hover:bg-brand-green-dark text-white font-medium flex items-center gap-2">
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="col-span-2 space-y-4">
            <Logo href="/" size="lg" variant="white" />
            <p className="text-base leading-relaxed pr-8 text-gray-400">
              Empowering Nigerians to build wealth through smart investing in local and global markets.
            </p>
          </div>
          <FooterLinkGroup title="Products" links={productLinks} />
          <FooterLinkGroup title="Company" links={companyLinks} />
          <FooterLinkGroup title="Support" links={supportLinks} />
          <FooterLinkGroup title="Legal" links={legalLinks} />
        </div>

        <div className="border-t border-gray-700 py-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm">
            © {new Date().getFullYear()} Travidox. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            {socialLinks.map(social => (
              <a 
                key={social.label}
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-brand-green transition-colors"
                aria-label={social.label}
              >
                <FontAwesomeIcon icon={social.icon} className="w-5 h-5" />
              </a>
            ))}
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center space-x-2 text-sm text-gray-400 hover:text-brand-green transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  )
}

function FooterLinkGroup({ title, links }: { title: string; links: {name: string, href: string}[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-base">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link 
              href={link.href} 
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
} 