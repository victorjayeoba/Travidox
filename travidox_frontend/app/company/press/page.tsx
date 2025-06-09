"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Newspaper, ChevronDown, ArrowRight, CalendarClock, 
  Download, ExternalLink, Search, Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'

interface PressRelease {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  url: string;
}

interface MediaMention {
  id: string;
  title: string;
  date: string;
  source: string;
  logo: string;
  excerpt: string;
  url: string;
}

const pressReleases: PressRelease[] = [
  {
    id: "pr-001",
    title: "Travidox Raises $10 Million in Series A Funding to Expand Investment Platform",
    date: "May 15, 2023",
    category: "Funding",
    excerpt: "Travidox, Nigeria's leading investment platform, has secured $10 million in Series A funding to expand its services across Africa and enhance its AI-powered trading tools.",
    image: "/images/press/funding-announcement.jpg",
    url: "/company/press/travidox-raises-10-million"
  },
  {
    id: "pr-002",
    title: "Travidox Launches Revolutionary AI Trading Bot for Nigerian Investors",
    date: "April 3, 2023",
    category: "Product Launch",
    excerpt: "Travidox introduces an AI-powered trading bot designed specifically for Nigerian investors, offering automated trading strategies based on local and global market conditions.",
    image: "/images/press/ai-bot-launch.jpg",
    url: "/company/press/travidox-launches-ai-trading-bot"
  },
  {
    id: "pr-003",
    title: "Travidox Partners with Lagos Business School to Offer Investment Education",
    date: "March 10, 2023",
    category: "Partnership",
    excerpt: "Travidox announces a strategic partnership with Lagos Business School to develop comprehensive investment education programs for Nigerian investors.",
    image: "/images/press/lbs-partnership.jpg",
    url: "/company/press/travidox-lbs-partnership"
  },
  {
    id: "pr-004",
    title: "Travidox Expands Access to Global Markets for Nigerian Investors",
    date: "February 22, 2023",
    category: "Expansion",
    excerpt: "Travidox now offers Nigerian investors access to 15 global markets, including US, UK, and European exchanges, furthering its mission to democratize global investment opportunities.",
    image: "/images/press/global-markets.jpg",
    url: "/company/press/travidox-global-markets-expansion"
  },
  {
    id: "pr-005",
    title: "Travidox Achieves 50,000 Active Users Milestone",
    date: "January 18, 2023",
    category: "Milestone",
    excerpt: "Travidox celebrates reaching 50,000 active users on its investment platform, marking significant growth in Nigeria's retail investment landscape.",
    image: "/images/press/user-milestone.jpg",
    url: "/company/press/travidox-50k-users"
  }
];

const mediaMentions: MediaMention[] = [
  {
    id: "mm-001",
    title: "How Travidox is Revolutionizing Investing in Nigeria",
    date: "June 2, 2023",
    source: "TechCabal",
    logo: "/images/press/techcabal-logo.png",
    excerpt: "TechCabal explores how Travidox is making investment accessible to everyday Nigerians through innovative technology and education.",
    url: "https://techcabal.com/travidox-investing-nigeria"
  },
  {
    id: "mm-002",
    title: "Travidox CEO Featured in '40 Under 40' Finance Leaders",
    date: "May 20, 2023",
    source: "BusinessDay",
    logo: "/images/press/businessday-logo.png",
    excerpt: "Oluwaseun Adeyemi, CEO of Travidox, has been recognized in BusinessDay's annual '40 Under 40' list of influential finance leaders in Nigeria.",
    url: "https://businessday.ng/40-under-40-finance-leaders"
  },
  {
    id: "mm-003",
    title: "The Rise of AI in Nigerian Investment Platforms",
    date: "April 25, 2023",
    source: "CNN Africa",
    logo: "/images/press/cnn-africa-logo.png",
    excerpt: "CNN Africa features Travidox in an in-depth analysis of how AI is transforming investment platforms across Africa.",
    url: "https://cnn.com/africa/ai-nigerian-investment-platforms"
  },
  {
    id: "mm-004",
    title: "Travidox: Bridging the Investment Gap for Nigeria's Middle Class",
    date: "March 15, 2023",
    source: "The Guardian Nigeria",
    logo: "/images/press/guardian-logo.png",
    excerpt: "The Guardian Nigeria examines how Travidox is making sophisticated investment tools accessible to Nigeria's growing middle class.",
    url: "https://guardian.ng/business/travidox-investment-middle-class"
  },
  {
    id: "mm-005",
    title: "Nigeria's Fintech Revolution: Spotlight on Travidox",
    date: "February 10, 2023",
    source: "Bloomberg Africa",
    logo: "/images/press/bloomberg-logo.png",
    excerpt: "Bloomberg Africa highlights Travidox as a key player in Nigeria's fintech revolution, transforming how Nigerians invest and build wealth.",
    url: "https://bloomberg.com/africa/nigeria-fintech-travidox"
  }
];

export default function PressPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  
  const filteredPressReleases = pressReleases.filter(pr => {
    const matchesSearch = pr.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         pr.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || pr.category === categoryFilter;
    const matchesYear = yearFilter === 'All' || pr.date.includes(yearFilter);
    
    return matchesSearch && matchesCategory && matchesYear;
  });
  
  const categories = ['All', ...Array.from(new Set(pressReleases.map(pr => pr.category)))];
  const years = ['All', '2023', '2022', '2021'];
  
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
              <Newspaper className="w-6 h-6 text-amber-400" />
              <p className="text-amber-400 font-medium">Company</p>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Press & Media
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The latest news, updates, and media coverage about Travidox's mission to democratize investing in Nigeria.
            </p>
          </div>
        </div>
      </section>
      
      {/* Press Kit Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Press Kit</h2>
                  <p className="text-gray-600">
                    Download our press kit for logos, executive photos, product images, and company information.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Download className="mr-2 h-4 w-4" />
                    Download Press Kit
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Brand Guidelines
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Press Releases Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Press Releases</h2>
            
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  type="text" 
                  placeholder="Search press releases..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <div className="w-40">
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Press Releases List */}
            <div className="space-y-8">
              {filteredPressReleases.length > 0 ? (
                filteredPressReleases.map(pressRelease => (
                  <div key={pressRelease.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="md:flex">
                      <div className="md:w-1/3 relative">
                        <div className="h-48 md:h-full relative">
                          <Image 
                            src={pressRelease.image} 
                            alt={pressRelease.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      </div>
                      <div className="p-6 md:w-2/3">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{pressRelease.category}</Badge>
                          <span className="text-sm text-gray-500 flex items-center">
                            <CalendarClock className="mr-1 h-3 w-3" />
                            {pressRelease.date}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          <Link href={pressRelease.url} className="hover:text-green-600 transition-colors">
                            {pressRelease.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {pressRelease.excerpt}
                        </p>
                        <Link 
                          href={pressRelease.url}
                          className="inline-flex items-center text-green-600 font-medium hover:text-green-700"
                        >
                          Read more
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No press releases found matching your criteria.</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 text-center">
              <Button variant="outline" size="lg">
                View All Press Releases
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Media Coverage Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Media Coverage</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {mediaMentions.map(mention => (
                <div key={mention.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 relative">
                      <Image 
                        src={mention.logo} 
                        alt={mention.source}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{mention.source}</p>
                      <p className="text-sm text-gray-500">{mention.date}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    <Link href={mention.url} target="_blank" className="hover:text-green-600 transition-colors">
                      {mention.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {mention.excerpt}
                  </p>
                  
                  <Link 
                    href={mention.url}
                    target="_blank"
                    className="inline-flex items-center text-green-600 font-medium hover:text-green-700"
                  >
                    Read article
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Media Contact Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Media Contact</h2>
            <p className="text-xl text-gray-600 mb-8">
              For press inquiries, interview requests, or additional information, please contact our media relations team.
            </p>
            
            <div className="bg-gray-50 rounded-xl p-8 text-left">
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">Media Relations</p>
                  <p className="text-gray-600">press@travidox.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-gray-600">+234 (0) 123 456 7890</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Office Hours</p>
                  <p className="text-gray-600">Monday to Friday, 9:00 AM - 5:00 PM WAT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 