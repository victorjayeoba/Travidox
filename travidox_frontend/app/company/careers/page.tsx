"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, Users, Search, Briefcase, 
  MapPin, Building, ChevronDown, ChevronUp,
  Code, LineChart, HeartHandshake, ShieldCheck,
  Clock, CheckCircle, DollarSign, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock job data
const jobOpenings = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    remote: true,
    experience: '3+ years',
    description: 'We are looking for a Senior Frontend Developer to join our team and help build our next-generation trading platform. You will work closely with our product and design teams to create intuitive and responsive user interfaces.',
    requirements: [
      'Strong experience with React, TypeScript, and Next.js',
      'Experience with responsive design and CSS frameworks like Tailwind',
      'Understanding of state management solutions',
      'Experience with testing frameworks',
      'Strong problem-solving skills'
    ],
    responsibilities: [
      'Develop new user-facing features using React.js',
      'Build reusable components and libraries for future use',
      'Ensure the technical feasibility of UI/UX designs',
      'Optimize applications for maximum speed and scalability',
      'Collaborate with other team members and stakeholders'
    ]
  },
  {
    id: 'job-2',
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    remote: true,
    experience: '2+ years',
    description: 'We are seeking a talented Backend Engineer to help design and implement our API services and database architecture. You will be responsible for server-side logic, ensuring high performance and responsiveness to requests from the front-end.',
    requirements: [
      'Experience with Node.js, Python, or similar backend technologies',
      'Knowledge of database design and ORM technologies',
      'Understanding of server-side templating languages',
      'Familiarity with cloud services (AWS, GCP, or Azure)',
      'Basic understanding of frontend technologies'
    ],
    responsibilities: [
      'Design and implement robust API endpoints',
      'Optimize database queries for performance',
      'Implement security and data protection measures',
      'Integrate with third-party services and APIs',
      'Collaborate with frontend developers to integrate user-facing elements'
    ]
  },
  {
    id: 'job-3',
    title: 'Financial Analyst',
    department: 'Finance',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    remote: false,
    experience: '2+ years',
    description: 'We are looking for a Financial Analyst to join our team and provide financial insights to help drive business decisions. You will be responsible for analyzing financial data, preparing reports, and making recommendations based on your findings.',
    requirements: [
      'Bachelor\'s degree in Finance, Accounting, or related field',
      'Experience with financial modeling and analysis',
      'Strong Excel skills and familiarity with financial software',
      'Knowledge of financial markets and investment principles',
      'Excellent analytical and problem-solving skills'
    ],
    responsibilities: [
      'Analyze financial data and prepare regular reports',
      'Develop financial models to support decision-making',
      'Monitor financial performance and identify trends',
      'Research market trends and competitor activities',
      'Support budget planning and forecasting processes'
    ]
  },
  {
    id: 'job-4',
    title: 'Product Manager',
    department: 'Product',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    remote: true,
    experience: '3+ years',
    description: 'We are seeking an experienced Product Manager to lead our product development efforts. You will be responsible for defining product strategy, gathering requirements, and working with cross-functional teams to deliver exceptional user experiences.',
    requirements: [
      'Experience in product management for digital products',
      'Strong understanding of user-centered design principles',
      'Excellent communication and stakeholder management skills',
      'Ability to translate business requirements into product features',
      'Experience with agile development methodologies'
    ],
    responsibilities: [
      'Define product vision, strategy, and roadmap',
      'Gather and prioritize product requirements',
      'Work closely with engineering, design, and marketing teams',
      'Analyze market trends and competitor products',
      'Measure and optimize product performance metrics'
    ]
  },
  {
    id: 'job-5',
    title: 'Customer Support Specialist',
    department: 'Customer Service',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    remote: true,
    experience: '1+ years',
    description: 'We are looking for a Customer Support Specialist to provide exceptional service to our users. You will be responsible for addressing customer inquiries, resolving issues, and ensuring a positive user experience.',
    requirements: [
      'Excellent communication and interpersonal skills',
      'Experience in customer service or support roles',
      'Ability to explain technical concepts in simple terms',
      'Problem-solving skills and attention to detail',
      'Basic understanding of financial products'
    ],
    responsibilities: [
      'Respond to customer inquiries via email, chat, and phone',
      'Troubleshoot and resolve customer issues',
      'Document customer feedback and escalate when necessary',
      'Contribute to knowledge base and support documentation',
      'Provide insights to improve customer experience'
    ]
  }
];

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  
  // Get unique departments and locations for filters
  const departments = ['all', ...new Set(jobOpenings.map(job => job.department))];
  const locations = ['all', ...new Set(jobOpenings.map(job => job.location))];
  
  // Filter jobs based on search term and filters
  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = departmentFilter === 'all' || job.department === departmentFilter;
    const matchesLocation = locationFilter === 'all' || job.location === locationFilter;
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });
  
  // Toggle job details expansion
  const toggleJobExpansion = (jobId: string) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
    } else {
      setExpandedJob(jobId);
    }
  };
  
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white pt-20 pb-24 md:pt-24 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Join Our Mission to <span className="text-blue-300">Transform Finance</span> in Nigeria
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              We're building the future of investing and financial technology. 
              Join our talented team and help make a difference.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
                <Link href="#openings" className="flex items-center">
                  View Open Positions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link href="#culture">Our Culture</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Join Us Section */}
      <section id="culture" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              <span>Why Join Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Be Part of Something Meaningful
            </h2>
            <p className="text-lg text-gray-600">
              At Travidox, we're not just building a company; we're on a mission to democratize 
              financial opportunities for all Nigerians. Join us and make an impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Impactful Work</h3>
              <p className="text-gray-600">
                Your work directly helps thousands of Nigerians access investment opportunities and build wealth for their future.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <LineChart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Growth & Learning</h3>
              <p className="text-gray-600">
                We invest in your development with continuous learning opportunities, mentorship programs, and career advancement paths.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation Culture</h3>
              <p className="text-gray-600">
                We embrace new ideas and technologies. You'll work with cutting-edge tools and have the freedom to innovate and experiment.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <HeartHandshake className="w-4 h-4" />
              <span>Benefits & Perks</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              We Take Care of Our Team
            </h2>
            <p className="text-lg text-gray-600">
              We offer competitive compensation and benefits to ensure our team members thrive both professionally and personally.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">Competitive Salary</h3>
              </div>
              <p className="text-gray-600 text-sm">
                We offer above-market compensation packages with performance bonuses.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900">Health Insurance</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Comprehensive health coverage for you and your dependents.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-bold text-gray-900">Flexible Working</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Remote work options and flexible hours to maintain work-life balance.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900">Stock Options</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Equity packages so you can share in the company's success.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900">Paid Time Off</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Generous vacation policy and paid holidays to rest and recharge.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-bold text-gray-900">Modern Office</h3>
              </div>
              <p className="text-gray-600 text-sm">
                State-of-the-art workspace with amenities for those who prefer in-office work.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900">Professional Development</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Learning stipend and time for conferences, courses, and certifications.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <HeartHandshake className="w-5 h-5 text-pink-600" />
                </div>
                <h3 className="font-bold text-gray-900">Parental Leave</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Generous parental leave policy for new parents to bond with their children.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Job Openings Section */}
      <section id="openings" className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Briefcase className="w-4 h-4" />
              <span>Open Positions</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Current Job Openings
            </h2>
            <p className="text-lg text-gray-600">
              Join our team and help build the future of finance in Nigeria. We're looking for talented individuals across various departments.
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search positions..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>
                      {loc === 'all' ? 'All Locations' : loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div 
                  key={job.id} 
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-200 hover:shadow-md transition-all duration-300"
                >
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => toggleJobExpansion(job.id)}
                  >
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {job.department}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {job.type}
                          </Badge>
                          {job.remote && (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                              Remote Eligible
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center">
                        {expandedJob === job.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {expandedJob === job.id && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                      <Tabs defaultValue="description">
                        <TabsList className="mb-4">
                          <TabsTrigger value="description">Description</TabsTrigger>
                          <TabsTrigger value="requirements">Requirements</TabsTrigger>
                          <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="description" className="space-y-4">
                          <p className="text-gray-600">{job.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>Experience: {job.experience}</span>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="requirements" className="space-y-2">
                          <h4 className="font-medium text-gray-900">Requirements</h4>
                          <ul className="space-y-2">
                            {job.requirements.map((req, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </TabsContent>
                        
                        <TabsContent value="responsibilities" className="space-y-2">
                          <h4 className="font-medium text-gray-900">Responsibilities</h4>
                          <ul className="space-y-2">
                            {job.responsibilities.map((resp, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </TabsContent>
                      </Tabs>
                      
                      <div className="mt-6">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Apply for this Position
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Matching Positions</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any positions matching your criteria. Try adjusting your filters or search term.
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setDepartmentFilter('all');
                  setLocationFilter('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Don't See a Perfect Fit?</h2>
            <p className="text-xl text-blue-100 mb-8">
              We're always looking for talented individuals to join our team. Send us your resume, and we'll keep you in mind for future opportunities.
            </p>
            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
              <Link href="/contact" className="flex items-center">
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
} 