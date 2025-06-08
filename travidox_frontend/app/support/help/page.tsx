"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Search, HelpCircle, FileText, MessageCircle, Video, Book, ChevronDown,
  ArrowRight, Phone, Mail, ExternalLink, Lightbulb, BookOpen, Gift, ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// FAQ Item component
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      <button
        className="flex items-center justify-between w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="p-4 pt-0 bg-white">
          <div className="pt-4 border-t border-gray-100">
            <p className="text-gray-600">{answer}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Sample FAQ data
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Sign Up' button on the top right of our homepage. You'll need to provide your email address, create a password, and verify your identity with a valid ID and phone number."
    },
    {
      question: "What investment options are available?",
      answer: "Travidox offers a variety of investment options including stocks, ETFs, fixed returns, and institutional investment solutions. Each product has different risk profiles and minimum investment requirements."
    },
    {
      question: "How do I fund my account?",
      answer: "You can fund your account through bank transfers, debit card payments, or direct deposits. Navigate to the 'Wallet' section in your dashboard and select 'Fund Account' to see all available options."
    },
    {
      question: "What are the fees for trading stocks?",
      answer: "Travidox offers commission-free stock trading. However, there may be regulatory fees and currency conversion charges for international stocks. Check our fee schedule for detailed information."
    },
    {
      question: "How can I withdraw my funds?",
      answer: "To withdraw funds, go to the 'Wallet' section and select 'Withdraw'. Enter the amount and select your preferred bank account. Processing typically takes 1-2 business days."
    },
    {
      question: "Is my money safe with Travidox?",
      answer: "Yes, your investments are protected through multiple security measures. We're regulated by the Securities and Exchange Commission of Nigeria, and implement industry-standard security protocols to safeguard your assets."
    }
  ]
  
  // Filter FAQs based on search query
  const filteredFAQs = searchQuery
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs
  
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white pt-16 pb-24 md:pt-20 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              How Can We <span className="text-purple-300">Help You</span> Today?
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Find answers to common questions, learn about our platform, and get the support
              you need to make the most of your Travidox experience.
            </p>
            
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full bg-white text-gray-900 border-0 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse Help by Category
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category 1 */}
            <Link 
              href="/support/help/getting-started" 
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 text-center group"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <HelpCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Getting Started</h3>
              <p className="text-gray-600 mb-4">Account setup, verification, and platform basics</p>
              <span className="text-purple-600 font-medium inline-flex items-center">
                Learn More
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            {/* Category 2 */}
            <Link 
              href="/support/help/trading" 
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 text-center group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Trading & Investing</h3>
              <p className="text-gray-600 mb-4">How to trade, investment strategies, and market insights</p>
              <span className="text-blue-600 font-medium inline-flex items-center">
                Learn More
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            {/* Category 3 */}
            <Link 
              href="/support/help/account" 
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 text-center group"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <ShieldCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Account & Security</h3>
              <p className="text-gray-600 mb-4">Managing your account, security features, and preferences</p>
              <span className="text-green-600 font-medium inline-flex items-center">
                Learn More
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            {/* Category 4 */}
            <Link 
              href="/support/help/deposits" 
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 text-center group"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                <Gift className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Deposits & Withdrawals</h3>
              <p className="text-gray-600 mb-4">Funding your account, withdrawal processes, and transactions</p>
              <span className="text-amber-600 font-medium inline-flex items-center">
                Learn More
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Popular Resources Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Popular Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Resource 1 */}
            <Link 
              href="/support/help/video-tutorials" 
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <Video className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 ml-4">Video Tutorials</h3>
              </div>
              <p className="text-gray-600 mb-3">
                Step-by-step video guides to help you navigate the platform and make the most of your investments.
              </p>
              <span className="text-red-600 font-medium inline-flex items-center">
                Watch Tutorials
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            {/* Resource 2 */}
            <Link 
              href="/support/help/learning-center" 
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 ml-4">Learning Center</h3>
              </div>
              <p className="text-gray-600 mb-3">
                Educational articles, market insights, and investment strategies to help you make informed decisions.
              </p>
              <span className="text-blue-600 font-medium inline-flex items-center">
                Start Learning
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            {/* Resource 3 */}
            <Link 
              href="/support/help/guides" 
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Book className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 ml-4">User Guides</h3>
              </div>
              <p className="text-gray-600 mb-3">
                Comprehensive guides covering all aspects of the platform, from basic navigation to advanced features.
              </p>
              <span className="text-green-600 font-medium inline-flex items-center">
                View Guides
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* FAQs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No results found for "{searchQuery}"</p>
                <p className="text-gray-500 text-sm mb-4">Try a different search term or browse our help categories</p>
                <Button 
                  variant="outline" 
                  className="text-purple-600 border-purple-600 hover:bg-purple-50"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              </div>
            )}
            
            <div className="text-center mt-8">
              <Link href="/support/help/all-faqs">
                <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
                  <span className="flex items-center">
                    View All FAQs
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Support Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-lg text-gray-600">
              Our support team is ready to assist you with any questions or issues you may have.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Contact Option 1 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">
                Chat with our support team in real-time for immediate assistance.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full">
                Start Chat
              </Button>
              <p className="text-sm text-gray-500 mt-3">Available 24/7</p>
            </div>
            
            {/* Contact Option 2 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">
                Send us an email with your question and we'll get back to you promptly.
              </p>
              <Link href="mailto:support@travidox.com" className="w-full">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                  Email Us
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-3">Response within 24 hours</p>
            </div>
            
            {/* Contact Option 3 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">
                Speak directly with a support representative for personalized help.
              </p>
              <Link href="tel:+2349012345678" className="w-full">
                <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                  Call Us
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-3">8am-8pm WAT, Mon-Fri</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Community Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Join Our Community
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Connect with other investors, share experiences, and learn from the Travidox community.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link 
                href="https://community.travidox.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 flex items-center"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4 text-left">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    Community Forum
                    <ExternalLink className="w-4 h-4 ml-1 text-gray-400" />
                  </h3>
                  <p className="text-gray-600">Join discussions with fellow investors</p>
                </div>
              </Link>
              
              <Link 
                href="https://twitter.com/travidox" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 flex items-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"/></svg>
                </div>
                <div className="ml-4 text-left">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    Twitter
                    <ExternalLink className="w-4 h-4 ml-1 text-gray-400" />
                  </h3>
                  <p className="text-gray-600">Follow us for updates and tips</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 