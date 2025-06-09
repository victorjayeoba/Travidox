"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Building, Users, Award, Globe, TrendingUp, 
  Shield, Clock, ChevronRight, ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
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
              <Building className="w-6 h-6 text-amber-400" />
              <p className="text-amber-400 font-medium">Company</p>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Travidox
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Empowering Nigerians to build wealth through smart investing in local and global markets with innovative AI-powered tools.
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Founded in 2021, Travidox emerged from a simple yet powerful vision: to democratize access to global financial markets for everyday Nigerians. Our founders, experienced financial professionals and technology experts, recognized the significant barriers that prevented many Nigerians from participating in wealth-building opportunities through investing.
                  </p>
                  <p>
                    What began as a small team working out of a Lagos co-working space has grown into a thriving fintech company serving thousands of investors across Nigeria. Our journey has been driven by a relentless focus on creating accessible, transparent, and powerful investment tools that work for everyone—from first-time investors to seasoned traders.
                  </p>
                  <p>
                    Today, Travidox stands at the intersection of finance and technology, leveraging artificial intelligence and data analytics to provide innovative solutions that enable our users to make informed investment decisions and build lasting wealth.
                  </p>
                </div>
              </div>
              <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
                <Image 
                  src="/images/about/office-team.jpg" 
                  alt="Travidox team at our Lagos headquarters" 
                  fill 
                  style={{ objectFit: 'cover' }}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission & Values Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're guided by a clear mission and a set of core values that shape everything we do.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-16">
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-xl text-gray-600">
                  To empower Nigerians to achieve financial freedom by providing accessible, innovative, and reliable investment tools that bridge local ambitions with global opportunities.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Trust & Transparency</h3>
                <p className="text-gray-600 flex-grow">
                  We believe in complete transparency in all our operations. We clearly communicate fees, risks, and potential rewards, building trust through honesty and integrity.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Inclusivity</h3>
                <p className="text-gray-600 flex-grow">
                  We design our products to be accessible to everyone, regardless of their financial background, investment experience, or technical expertise.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
                <p className="text-gray-600 flex-grow">
                  We strive for excellence in everything we do, from the performance of our platform to the quality of our customer service and educational resources.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Global Perspective</h3>
                <p className="text-gray-600 flex-grow">
                  We connect Nigerians to global markets, expanding horizons and creating opportunities that transcend geographical boundaries.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Long-term Focus</h3>
                <p className="text-gray-600 flex-grow">
                  We emphasize sustainable wealth building over time, promoting responsible investing practices that align with long-term financial goals.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600 flex-grow">
                  We continuously push the boundaries of what's possible, leveraging cutting-edge technology to create better investment experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Leadership Team Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Meet the experienced professionals driving Travidox's mission forward.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative h-64">
                  <Image 
                    src="/images/team/ceo.jpg" 
                    alt="Oluwaseun Adeyemi" 
                    fill 
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Oluwaseun Adeyemi</h3>
                  <p className="text-green-600 font-medium mb-3">Chief Executive Officer</p>
                  <p className="text-gray-600 mb-4">
                    Former investment banker with 15+ years of experience in global financial markets. MBA from Lagos Business School.
                  </p>
                  <div className="flex space-x-3">
                    <Link href="https://linkedin.com" target="_blank" className="text-gray-400 hover:text-blue-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </Link>
                    <Link href="https://twitter.com" target="_blank" className="text-gray-400 hover:text-blue-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Team Member 2 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative h-64">
                  <Image 
                    src="/images/team/cto.jpg" 
                    alt="Chinedu Okonkwo" 
                    fill 
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Chinedu Okonkwo</h3>
                  <p className="text-green-600 font-medium mb-3">Chief Technology Officer</p>
                  <p className="text-gray-600 mb-4">
                    Tech innovator with expertise in AI and machine learning. Previously led engineering teams at major fintech companies.
                  </p>
                  <div className="flex space-x-3">
                    <Link href="https://linkedin.com" target="_blank" className="text-gray-400 hover:text-blue-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </Link>
                    <Link href="https://github.com" target="_blank" className="text-gray-400 hover:text-gray-900">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Team Member 3 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative h-64">
                  <Image 
                    src="/images/team/cfo.jpg" 
                    alt="Amina Ibrahim" 
                    fill 
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Amina Ibrahim</h3>
                  <p className="text-green-600 font-medium mb-3">Chief Financial Officer</p>
                  <p className="text-gray-600 mb-4">
                    Financial strategist with experience in both traditional banking and fintech sectors. CFA charterholder.
                  </p>
                  <div className="flex space-x-3">
                    <Link href="https://linkedin.com" target="_blank" className="text-gray-400 hover:text-blue-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </Link>
                    <Link href="https://twitter.com" target="_blank" className="text-gray-400 hover:text-blue-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link href="/company/careers" className="inline-flex items-center text-green-600 font-medium hover:text-green-700">
                Join our team
                <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Travidox by the Numbers</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our impact in empowering Nigerian investors.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">50K+</div>
                <p className="text-gray-600 font-medium">Active Users</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">₦2B+</div>
                <p className="text-gray-600 font-medium">Assets Under Management</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">15+</div>
                <p className="text-gray-600 font-medium">Global Markets</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">98%</div>
                <p className="text-gray-600 font-medium">Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Partners Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Partners</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We collaborate with leading financial institutions and technology providers.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
              <div className="flex justify-center">
                <Image src="/images/partners/partner1.png" alt="Partner Logo" width={120} height={60} />
              </div>
              <div className="flex justify-center">
                <Image src="/images/partners/partner2.png" alt="Partner Logo" width={120} height={60} />
              </div>
              <div className="flex justify-center">
                <Image src="/images/partners/partner3.png" alt="Partner Logo" width={120} height={60} />
              </div>
              <div className="flex justify-center">
                <Image src="/images/partners/partner4.png" alt="Partner Logo" width={120} height={60} />
              </div>
              <div className="flex justify-center">
                <Image src="/images/partners/partner5.png" alt="Partner Logo" width={120} height={60} />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-green-600">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of Nigerians who are building wealth and securing their financial future with Travidox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-50">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-green-700">
                <ExternalLink className="mr-2 h-5 w-5" />
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 