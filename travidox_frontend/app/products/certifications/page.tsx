"use client"

import React from 'react'
import Link from 'next/link'
import { 
  ArrowRight, Award, CheckCircle, BookOpen, 
  Users, Clock, Star, BarChart2, 
  FileText, Brain, Lightbulb, GraduationCap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AuthButton } from '@/components/auth/auth-button'
import { Badge } from '@/components/ui/badge'

export default function CertificationsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 text-white pt-20 pb-24 md:pt-24 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-800/50 text-amber-300 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                <Award className="w-4 h-4" />
                <span>Professional Certifications</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Earn <span className="text-amber-300">Recognized Credentials</span> in Financial Markets
              </h1>
              
              <p className="text-lg text-gray-300">
                Boost your career and credibility with our industry-recognized certification programs designed for investors and traders.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-3">
                <AuthButton 
                  size="lg" 
                  className="bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  defaultRoute="signup"
                />
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 rounded-lg">
                  <Link href="#certifications" className="flex items-center">
                    View Certifications
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg blur opacity-30"></div>
                <div className="relative bg-gray-900 p-5 rounded-lg">
                  <img 
                    src="/images/certification-preview.png" 
                    alt="Certification Preview" 
                    className="rounded-lg shadow-2xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400/1e293b/e2e8f0?text=Certification+Preview';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              <span>Why Get Certified</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The Benefits of Certification</h2>
            <p className="text-lg text-gray-600">
              Our certification programs provide tangible benefits to help you stand out in the financial industry.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Industry Recognition</h3>
              <p className="text-gray-600 mb-4">
                Our certifications are recognized by financial institutions and investment firms across Nigeria and beyond.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Validated Knowledge</h3>
              <p className="text-gray-600 mb-4">
                Demonstrate your expertise with credentials that verify your understanding of financial markets and trading strategies.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Career Advancement</h3>
              <p className="text-gray-600 mb-4">
                Open new career opportunities in finance, trading, and investment advisory roles with our professional certifications.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Certification Programs Section */}
      <section id="certifications" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <GraduationCap className="w-4 h-4" />
              <span>Our Programs</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Certification Programs</h2>
            <p className="text-lg text-gray-600">
              Choose from our range of specialized certification programs designed for different skill levels and career paths.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Certification 1 */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-amber-800 text-white p-6 flex flex-col justify-center items-center md:items-start">
                  <Award className="w-10 h-10 mb-3" />
                  <h3 className="text-xl font-bold mb-1">Investment Fundamentals</h3>
                  <Badge className="bg-amber-700 hover:bg-amber-600">Beginner Level</Badge>
                </div>
                
                <div className="col-span-3 p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        A comprehensive certification covering the core principles of investing, financial markets, and building a solid foundation for your investment journey.
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-amber-600" />
                          <span className="text-sm text-gray-600">8 Modules</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-amber-600" />
                          <span className="text-sm text-gray-600">40 Hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-amber-600" />
                          <span className="text-sm text-gray-600">Final Exam</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Market Basics</Badge>
                        <Badge variant="outline">Asset Classes</Badge>
                        <Badge variant="outline">Portfolio Building</Badge>
                        <Badge variant="outline">Risk Management</Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end justify-center gap-2">
                      <div className="text-2xl font-bold text-amber-600">₦25,000</div>
                      <Button className="bg-amber-600 hover:bg-amber-700">
                        <Link href="/dashboard/certifications">Enroll Now</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Certification 2 */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-blue-800 text-white p-6 flex flex-col justify-center items-center md:items-start">
                  <Award className="w-10 h-10 mb-3" />
                  <h3 className="text-xl font-bold mb-1">Technical Analysis Professional</h3>
                  <Badge className="bg-blue-700 hover:bg-blue-600">Intermediate Level</Badge>
                </div>
                
                <div className="col-span-3 p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Master chart patterns, indicators, and technical trading strategies with this comprehensive certification for serious traders.
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          <span className="text-sm text-gray-600">12 Modules</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <span className="text-sm text-gray-600">60 Hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                          <span className="text-sm text-gray-600">Final Exam</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Chart Patterns</Badge>
                        <Badge variant="outline">Indicators</Badge>
                        <Badge variant="outline">Price Action</Badge>
                        <Badge variant="outline">Trading Systems</Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end justify-center gap-2">
                      <div className="text-2xl font-bold text-blue-600">₦45,000</div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/dashboard/certifications">Enroll Now</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Certification 3 */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-green-800 text-white p-6 flex flex-col justify-center items-center md:items-start">
                  <Award className="w-10 h-10 mb-3" />
                  <h3 className="text-xl font-bold mb-1">Nigerian Markets Specialist</h3>
                  <Badge className="bg-green-700 hover:bg-green-600">Intermediate Level</Badge>
                </div>
                
                <div className="col-span-3 p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Specialized certification focused on the Nigerian stock market, regulations, and local investment opportunities.
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-gray-600">10 Modules</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-gray-600">50 Hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-gray-600">Final Exam</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">NSE</Badge>
                        <Badge variant="outline">Local Regulations</Badge>
                        <Badge variant="outline">Economic Factors</Badge>
                        <Badge variant="outline">Market Analysis</Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end justify-center gap-2">
                      <div className="text-2xl font-bold text-green-600">₦35,000</div>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Link href="/dashboard/certifications">Enroll Now</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <FileText className="w-4 h-4" />
              <span>FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about our certification programs.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="general" className="space-y-8">
              <TabsList className="grid grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="process">Process</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-2">What are Travidox certifications?</h3>
                    <p className="text-gray-600">
                      Travidox certifications are professional credentials that validate your knowledge and skills in various aspects of financial markets, investing, and trading.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-2">Who should get certified?</h3>
                    <p className="text-gray-600">
                      Our certifications are ideal for investors, traders, financial professionals, and anyone looking to enhance their credentials in the financial industry.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-2">How long are certifications valid?</h3>
                    <p className="text-gray-600">
                      Travidox certifications are valid for 3 years, after which you can renew through a simplified recertification process.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="process" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-2">How do I prepare for certification exams?</h3>
                    <p className="text-gray-600">
                      Each certification program includes comprehensive study materials, practice tests, and instructor support to help you prepare for the final exam.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-2">What is the exam format?</h3>
                    <p className="text-gray-600">
                      Exams typically consist of multiple-choice questions, case studies, and practical assessments. You need a minimum score of 70% to pass.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-2">Can I retake the exam if I fail?</h3>
                    <p className="text-gray-600">
                      Yes, you can retake the exam up to two times within a 6-month period. Additional fees may apply for retakes.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="benefits" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-2">How will certification help my career?</h3>
                    <p className="text-gray-600">
                      Our certifications can help you stand out to employers, build credibility with clients, and demonstrate your commitment to professional development.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-2">Are these certifications recognized in the industry?</h3>
                    <p className="text-gray-600">
                      Yes, Travidox certifications are recognized by financial institutions, investment firms, and employers across Nigeria and internationally.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold mb-2">What additional benefits do certified members receive?</h3>
                    <p className="text-gray-600">
                      Certified members gain access to exclusive webinars, networking events, job opportunities, and continuing education resources.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Advance Your Financial Career?</h2>
            <p className="text-xl text-gray-200 mb-8">
              Join thousands of professionals who have boosted their careers with Travidox certifications.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <AuthButton 
                size="lg" 
                className="bg-white text-amber-900 hover:bg-gray-100 rounded-lg"
                defaultRoute="signup"
              />
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white/10 rounded-lg"
              >
                <Link href="#certifications">
                  View All Certifications
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
