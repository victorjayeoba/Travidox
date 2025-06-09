"use client"

import React from 'react'
import Link from 'next/link'
import { 
  ArrowRight, BookOpen, GraduationCap, Award, 
  Users, Video, FileText, BarChart2, 
  BookMarked, Brain, Lightbulb, CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AuthButton } from '@/components/auth/auth-button'
import { Badge } from '@/components/ui/badge'

export default function LearningCenterPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-teal-900 text-white pt-20 pb-24 md:pt-24 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-green-800/50 text-green-300 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                <BookOpen className="w-4 h-4" />
                <span>Financial Education</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Master <span className="text-green-300">Financial Markets</span> with Expert Knowledge
              </h1>
              
              <p className="text-lg text-gray-300">
                Access comprehensive courses, tutorials, and resources designed to help you become a more confident and successful investor.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-3">
                <AuthButton 
                  size="lg" 
                  className="bg-green-500 hover:bg-green-600 text-white rounded-lg"
                />
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 rounded-lg">
                  <Link href="#courses" className="flex items-center">
                    Browse Courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg blur opacity-30"></div>
                <div className="relative bg-gray-900 p-5 rounded-lg">
                  <img 
                    src="/images/learning-center-preview.png" 
                    alt="Learning Center Preview" 
                    className="rounded-lg shadow-2xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400/1e293b/e2e8f0?text=Learning+Center+Preview';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-100 text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">50+</div>
              <p className="text-gray-600 text-sm md:text-base">Expert-led Courses</p>
            </div>
            
            <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-100 text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">10k+</div>
              <p className="text-gray-600 text-sm md:text-base">Active Students</p>
            </div>
            
            <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-100 text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">500+</div>
              <p className="text-gray-600 text-sm md:text-base">Video Tutorials</p>
            </div>
            
            <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-100 text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">15</div>
              <p className="text-gray-600 text-sm md:text-base">Certification Paths</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Course Categories Section */}
      <section id="courses" className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <BookMarked className="w-4 h-4" />
              <span>Course Categories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Learn at Your Own Pace</h2>
            <p className="text-lg text-gray-600">
              Explore our diverse range of courses designed for investors at every level, from beginners to advanced traders.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Category 1 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <Badge className="mb-2 bg-blue-100 text-blue-800 hover:bg-blue-200">Beginner Friendly</Badge>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Investing Fundamentals</h3>
              <p className="text-gray-600 mb-4">
                Learn the core concepts of investing, financial markets, and building a solid foundation for your investment journey.
              </p>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  8 Courses
                </span>
                <span className="flex items-center">
                  <Video className="w-4 h-4 mr-1" />
                  42 Videos
                </span>
              </div>
              <Button className="w-full" variant="outline">
                <Link href="/dashboard/learn/fundamentals">View Courses</Link>
              </Button>
            </div>
            
            {/* Category 2 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="w-6 h-6 text-purple-600" />
              </div>
              <Badge className="mb-2 bg-purple-100 text-purple-800 hover:bg-purple-200">Intermediate</Badge>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Technical Analysis</h3>
              <p className="text-gray-600 mb-4">
                Master chart patterns, indicators, and technical tools to identify profitable trading opportunities.
              </p>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  12 Courses
                </span>
                <span className="flex items-center">
                  <Video className="w-4 h-4 mr-1" />
                  78 Videos
                </span>
              </div>
              <Button className="w-full" variant="outline">
                <Link href="/dashboard/learn/technical-analysis">View Courses</Link>
              </Button>
            </div>
            
            {/* Category 3 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-amber-600" />
              </div>
              <Badge className="mb-2 bg-amber-100 text-amber-800 hover:bg-amber-200">Advanced</Badge>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trading Psychology</h3>
              <p className="text-gray-600 mb-4">
                Develop the mental discipline and emotional control needed for consistent trading success.
              </p>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  6 Courses
                </span>
                <span className="flex items-center">
                  <Video className="w-4 h-4 mr-1" />
                  35 Videos
                </span>
              </div>
              <Button className="w-full" variant="outline">
                <Link href="/dashboard/learn/psychology">View Courses</Link>
              </Button>
            </div>
            
            {/* Category 4 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <Badge className="mb-2 bg-green-100 text-green-800 hover:bg-green-200">Intermediate</Badge>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fundamental Analysis</h3>
              <p className="text-gray-600 mb-4">
                Learn to evaluate companies through financial statements, industry analysis, and economic indicators.
              </p>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  10 Courses
                </span>
                <span className="flex items-center">
                  <Video className="w-4 h-4 mr-1" />
                  62 Videos
                </span>
              </div>
              <Button className="w-full" variant="outline">
                <Link href="/dashboard/learn/fundamental-analysis">View Courses</Link>
              </Button>
            </div>
            
            {/* Category 5 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-red-600" />
              </div>
              <Badge className="mb-2 bg-red-100 text-red-800 hover:bg-red-200">Advanced</Badge>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trading Strategies</h3>
              <p className="text-gray-600 mb-4">
                Explore proven trading methodologies and develop your own systematic approach to the markets.
              </p>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  14 Courses
                </span>
                <span className="flex items-center">
                  <Video className="w-4 h-4 mr-1" />
                  93 Videos
                </span>
              </div>
              <Button className="w-full" variant="outline">
                <Link href="/dashboard/learn/strategies">View Courses</Link>
              </Button>
            </div>
            
            {/* Category 6 */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <Badge className="mb-2 bg-teal-100 text-teal-800 hover:bg-teal-200">All Levels</Badge>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nigerian Markets</h3>
              <p className="text-gray-600 mb-4">
                Specialized courses on the Nigerian stock market, local regulations, and investment opportunities.
              </p>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  7 Courses
                </span>
                <span className="flex items-center">
                  <Video className="w-4 h-4 mr-1" />
                  48 Videos
                </span>
              </div>
              <Button className="w-full" variant="outline">
                <Link href="/dashboard/learn/nigerian-markets">View Courses</Link>
              </Button>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button className="bg-green-600 hover:bg-green-700">
              <Link href="/dashboard/learn" className="flex items-center">
                View All Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Learning Formats Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Video className="w-4 h-4" />
              <span>Learning Formats</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Multiple Ways to Learn</h2>
            <p className="text-lg text-gray-600">
              Access our educational content in various formats to match your learning style and schedule.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Video Lessons</h3>
              <p className="text-gray-600">
                Engaging video tutorials with expert instructors demonstrating concepts, strategies, and real-world examples.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  High-quality production
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Downloadable for offline viewing
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Closed captions available
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Workbooks</h3>
              <p className="text-gray-600">
                Comprehensive written materials with exercises, quizzes, and practical assignments to reinforce your learning.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Downloadable PDF resources
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Practice exercises included
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Real-world case studies
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Live Webinars</h3>
              <p className="text-gray-600">
                Participate in scheduled live sessions with instructors and fellow students for interactive learning and Q&A.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Direct instructor interaction
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Recorded for later viewing
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Weekly market analysis sessions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Certification Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              <span>Certifications</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Earn Recognized Certifications</h2>
            <p className="text-lg text-gray-600">
              Showcase your knowledge and skills with our industry-recognized certification programs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Investment Fundamentals Certificate</h3>
                  <p className="text-gray-600 mb-4">
                    A comprehensive certification covering the core principles of investing and financial markets.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-gray-100 text-gray-800">Beginner Level</Badge>
                    <Badge className="bg-gray-100 text-gray-800">8 Modules</Badge>
                    <Badge className="bg-gray-100 text-gray-800">40 Hours</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Link href="/dashboard/certifications">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Technical Analysis Professional</h3>
                  <p className="text-gray-600 mb-4">
                    Master chart patterns, indicators, and technical trading strategies with this advanced certification.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-gray-100 text-gray-800">Intermediate Level</Badge>
                    <Badge className="bg-gray-100 text-gray-800">12 Modules</Badge>
                    <Badge className="bg-gray-100 text-gray-800">60 Hours</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Link href="/dashboard/certifications">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Nigerian Markets Specialist</h3>
                  <p className="text-gray-600 mb-4">
                    Specialized certification focused on the Nigerian stock market, regulations, and local investment opportunities.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-gray-100 text-gray-800">Intermediate Level</Badge>
                    <Badge className="bg-gray-100 text-gray-800">7 Modules</Badge>
                    <Badge className="bg-gray-100 text-gray-800">35 Hours</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Link href="/dashboard/certifications">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Advanced Trading Strategies</h3>
                  <p className="text-gray-600 mb-4">
                    Elite certification covering sophisticated trading methodologies, risk management, and portfolio optimization.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-gray-100 text-gray-800">Advanced Level</Badge>
                    <Badge className="bg-gray-100 text-gray-800">10 Modules</Badge>
                    <Badge className="bg-gray-100 text-gray-800">80 Hours</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Link href="/dashboard/certifications">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Link href="/dashboard/certifications" className="flex items-center">
                View All Certifications
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-green-900 to-teal-900 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Learning Journey Today</h2>
            <p className="text-xl text-green-100 mb-8">
              Invest in your knowledge and skills to become a more confident and successful investor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AuthButton 
                size="lg" 
                className="bg-green-500 hover:bg-green-600 text-white"
              />
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link href="/dashboard/learn">Explore Learning Center</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 