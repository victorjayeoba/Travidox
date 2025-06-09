"use client"

import { useState, useEffect, KeyboardEvent } from "react"
import Link from "next/link"
import { Menu, X, TrendingUp } from "lucide-react"
import { NigeriaStockSlider } from "./nigeria-stock-slider"
import { useActiveSection } from "@/hooks/useActiveSection"
import { UserAccountButton } from "./auth/user-account-button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const navigation = [
    { name: "Markets", href: "#markets" },
    { name: "Security", href: "#security" },
    { name: "Community", href: "#community" },
    { name: "FAQ", href: "#faq" },
  ]
  
  const sectionIds = navigation.map(item => item.href.replace('#', ''))
  const activeSection = useActiveSection({ sectionIds })

  // Close menu when escape key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscKey as any)
    return () => {
      document.removeEventListener('keydown', handleEscKey as any)
    }
  }, [isMenuOpen])

  // Enable smooth scrolling
  useEffect(() => {
    const handleNavClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const href = target.getAttribute('href');
      
      if (href?.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.getElementById(href.substring(1));
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
          });
          // Set focus to the section for accessibility
          targetSection.tabIndex = -1;
          targetSection.focus({ preventScroll: true });
        }
      }
    };

    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => link.addEventListener('click', handleNavClick as any));

    return () => {
      navLinks.forEach(link => link.removeEventListener('click', handleNavClick as any));
    };
  }, []);

  // Handle keyboard navigation for menu toggle
  const handleMenuKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsMenuOpen(!isMenuOpen);
    }
  };

  // Determine aria attributes based on menu state
  const menuButtonAriaExpanded = isMenuOpen ? "true" : "false";
  const menuButtonAriaLabel = isMenuOpen ? "Close menu" : "Open menu";

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" aria-label="Travidox Home">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-2xl font-bold text-gray-900">travidox</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
            {navigation.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className={`relative text-base transition-colors duration-300 ${
                    isActive ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.name}
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-600 -mb-6 transform origin-left transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                    aria-hidden="true" 
                  />
                </Link>
              );
            })}
          </nav>

          {/* User Account Button / CTA Button */}
          <div className="hidden md:block">
            <UserAccountButton />
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            onKeyDown={handleMenuKeyDown}
            aria-expanded={menuButtonAriaExpanded}
            aria-controls="mobile-menu"
            aria-label={menuButtonAriaLabel}
          >
            {isMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div 
            id="mobile-menu" 
            className="md:hidden py-4 border-t border-gray-200"
            role="navigation"
            aria-label="Mobile Navigation"
          >
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block py-2 pl-3 border-l-2 transition-all duration-300 ${
                      isActive ? 'border-green-600 text-green-600 font-medium' : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="mt-4">
                <UserAccountButton />
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Nigeria Stock Slider */}
      <NigeriaStockSlider />
    </header>
  )
}
