"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  BookOpen, ChevronDown, ArrowRight, CalendarClock, 
  User, Clock, Search, Tag, ChevronRight, ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: string;
  tags: string[];
  excerpt: string;
  image: string;
  readTime: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "blog-001",
    title: "5 Strategies for Investing in Nigerian Stocks During Economic Uncertainty",
    date: "June 5, 2023",
    author: {
      name: "Oluwaseun Adeyemi",
      avatar: "/images/team/ceo.jpg",
      role: "CEO"
    },
    category: "Investment Strategy",
    tags: ["Nigerian Stocks", "Economic Analysis", "Risk Management"],
    excerpt: "Discover effective strategies for navigating Nigeria's stock market during periods of economic uncertainty, including sector diversification and fundamental analysis approaches.",
    image: "/images/blog/nigerian-stocks.jpg",
    readTime: "8 min read",
    slug: "investing-nigerian-stocks-economic-uncertainty"
  },
  {
    id: "blog-002",
    title: "Understanding AI Trading Algorithms: How They Work and Their Benefits",
    date: "May 28, 2023",
    author: {
      name: "Chinedu Okonkwo",
      avatar: "/images/team/cto.jpg",
      role: "CTO"
    },
    category: "Technology",
    tags: ["AI", "Trading Bot", "Algorithms"],
    excerpt: "An in-depth look at how AI-powered trading algorithms work, their advantages for retail investors, and how they're changing the investment landscape in Nigeria.",
    image: "/images/blog/ai-trading.jpg",
    readTime: "12 min read",
    slug: "understanding-ai-trading-algorithms"
  },
  {
    id: "blog-003",
    title: "Beginner's Guide to Global Market Investing for Nigerians",
    date: "May 15, 2023",
    author: {
      name: "Amina Ibrahim",
      avatar: "/images/team/cfo.jpg",
      role: "CFO"
    },
    category: "Education",
    tags: ["Global Markets", "Beginner", "Diversification"],
    excerpt: "A comprehensive guide for Nigerian investors looking to diversify into global markets, covering everything from account setup to currency considerations.",
    image: "/images/blog/global-markets.jpg",
    readTime: "10 min read",
    slug: "beginners-guide-global-market-investing"
  },
  {
    id: "blog-004",
    title: "How to Build a Balanced Investment Portfolio in Nigeria",
    date: "May 8, 2023",
    author: {
      name: "Folake Adebayo",
      avatar: "/images/team/investment-advisor.jpg",
      role: "Investment Advisor"
    },
    category: "Portfolio Management",
    tags: ["Asset Allocation", "Diversification", "Risk Management"],
    excerpt: "Learn how to create a well-balanced investment portfolio tailored to the Nigerian market, with strategies for different risk tolerances and financial goals.",
    image: "/images/blog/balanced-portfolio.jpg",
    readTime: "9 min read",
    slug: "build-balanced-investment-portfolio-nigeria"
  },
  {
    id: "blog-005",
    title: "The Impact of CBN Policies on Nigerian Investment Strategies",
    date: "April 30, 2023",
    author: {
      name: "Emmanuel Okafor",
      avatar: "/images/team/market-analyst.jpg",
      role: "Market Analyst"
    },
    category: "Market Analysis",
    tags: ["CBN", "Monetary Policy", "Economic Analysis"],
    excerpt: "An analysis of how Central Bank of Nigeria policies affect different investment assets and strategies for adapting your portfolio to policy changes.",
    image: "/images/blog/cbn-policies.jpg",
    readTime: "11 min read",
    slug: "cbn-policies-impact-nigerian-investments"
  },
  {
    id: "blog-006",
    title: "Tax-Efficient Investing: Maximizing Returns for Nigerian Investors",
    date: "April 22, 2023",
    author: {
      name: "Amina Ibrahim",
      avatar: "/images/team/cfo.jpg",
      role: "CFO"
    },
    category: "Tax Planning",
    tags: ["Tax Efficiency", "Investment Returns", "Financial Planning"],
    excerpt: "Strategies for minimizing tax liability and maximizing after-tax returns on your investments in Nigeria, including tax-advantaged accounts and investment structures.",
    image: "/images/blog/tax-efficient.jpg",
    readTime: "7 min read",
    slug: "tax-efficient-investing-nigeria"
  }
];

const categories = ["All", "Investment Strategy", "Technology", "Education", "Portfolio Management", "Market Analysis", "Tax Planning"];
const popularTags = ["Nigerian Stocks", "Global Markets", "AI", "Diversification", "Risk Management", "Economic Analysis", "Beginner"];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || post.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  const featuredPost = blogPosts[0];
  const recentPosts = blogPosts.slice(0, 3);
  
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
              <BookOpen className="w-6 h-6 text-amber-400" />
              <p className="text-amber-400 font-medium">Company</p>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Travidox Blog
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Insights, analysis, and educational content to help you make smarter investment decisions.
            </p>
          </div>
        </div>
      </section>
      
      {/* Featured Post */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Article</h2>
            
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <div className="md:flex">
                <div className="md:w-1/2 relative">
                  <div className="h-64 md:h-full relative">
                    <Image 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
                <div className="p-6 md:p-8 md:w-1/2">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{featuredPost.category}</Badge>
                    <span className="text-sm text-gray-500 flex items-center">
                      <CalendarClock className="mr-1 h-3 w-3" />
                      {featuredPost.date}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    <Link href={`/company/blog/${featuredPost.slug}`} className="hover:text-green-600 transition-colors">
                      {featuredPost.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 relative rounded-full overflow-hidden">
                      <Image 
                        src={featuredPost.author.avatar} 
                        alt={featuredPost.author.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{featuredPost.author.name}</p>
                      <p className="text-sm text-gray-500">{featuredPost.author.role}</p>
                    </div>
                  </div>
                  <Link 
                    href={`/company/blog/${featuredPost.slug}`}
                    className="inline-flex items-center text-green-600 font-medium hover:text-green-700"
                  >
                    Read full article
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blog Content */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Search and Filters */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        type="text" 
                        placeholder="Search articles..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="w-full md:w-48">
                      <select 
                        className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={categoryFilter}
                        onChange={(e) => {
                          setCategoryFilter(e.target.value);
                          setCurrentPage(1);
                        }}
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Blog Posts */}
                <div className="space-y-8">
                  {currentPosts.length > 0 ? (
                    currentPosts.map(post => (
                      <div key={post.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <div className="md:flex">
                          <div className="md:w-2/5 relative">
                            <div className="h-48 md:h-full relative">
                              <Image 
                                src={post.image} 
                                alt={post.title}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                          </div>
                          <div className="p-6 md:w-3/5">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{post.category}</Badge>
                              <span className="text-sm text-gray-500 flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {post.readTime}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                              <Link href={`/company/blog/${post.slug}`} className="hover:text-green-600 transition-colors">
                                {post.title}
                              </Link>
                            </h3>
                            <p className="text-gray-600 mb-4">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 relative rounded-full overflow-hidden">
                                  <Image 
                                    src={post.author.avatar} 
                                    alt={post.author.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                  />
                                </div>
                                <span className="text-sm text-gray-700">{post.author.name}</span>
                              </div>
                              <span className="text-sm text-gray-500">{post.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white border border-gray-100 rounded-xl">
                      <p className="text-gray-500">No articles found matching your criteria.</p>
                    </div>
                  )}
                </div>
                
                {/* Pagination */}
                {filteredPosts.length > postsPerPage && (
                  <div className="flex justify-center mt-10">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button 
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          {page}
                        </Button>
                      ))}
                      
                      <Button 
                        variant="outline" 
                        size="icon"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sidebar */}
              <div>
                {/* Recent Posts */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Posts</h3>
                  <div className="space-y-4">
                    {recentPosts.map(post => (
                      <div key={post.id} className="flex gap-3">
                        <div className="w-16 h-16 relative flex-shrink-0">
                          <Image 
                            src={post.image} 
                            alt={post.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm leading-tight mb-1">
                            <Link href={`/company/blog/${post.slug}`} className="hover:text-green-600 transition-colors">
                              {post.title}
                            </Link>
                          </h4>
                          <p className="text-xs text-gray-500">{post.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Categories */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.filter(cat => cat !== 'All').map(category => (
                      <button 
                        key={category}
                        onClick={() => {
                          setCategoryFilter(category);
                          setCurrentPage(1);
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                          categoryFilter === category 
                            ? 'bg-green-100 text-green-800' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Popular Tags */}
                <div className="bg-white border border-gray-100 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(tag => (
                      <Badge 
                        key={tag}
                        className="bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Newsletter Signup */}
                <div className="bg-green-600 rounded-xl p-6 mt-8 text-white">
                  <h3 className="text-lg font-bold mb-2">Subscribe to Our Newsletter</h3>
                  <p className="text-green-100 mb-4">Get the latest investment insights and market updates delivered to your inbox.</p>
                  <div className="space-y-3">
                    <Input 
                      type="email" 
                      placeholder="Your email address" 
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white"
                    />
                    <Button className="w-full bg-white text-green-600 hover:bg-green-50">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Put the insights from our blog into practice with a Travidox account.
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Open an Account
            </Button>
          </div>
        </div>
      </section>
    </>
  )
} 