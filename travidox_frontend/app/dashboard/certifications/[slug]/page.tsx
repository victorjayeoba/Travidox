"use client"

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, BookOpen, Clock, Award, CheckCircle2, GraduationCap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Technology icon mapping (same as in the parent page)
const techIcons: Record<string, string> = {
  'angular': '/angular.svg',
  'react': '/react.svg',
  'vue': '/vue.svg',
  'node': '/node.svg',
  'laravel': '/laravel.svg',
  'python': '/python.svg',
  'java': '/java.svg',
  'csharp': '/csharp.svg',
  'javascript': '/javascript.svg',
  'html': '/html.svg',
  'css': '/css.svg',
  'bootstrap': '/bootstrap.svg',
  'firebase': '/firebase.svg',
  'github': '/github.svg',
  'trading': '/trading.svg',
  'forex': '/forex.svg',
  'stocks': '/stocks.svg',
  'crypto': '/crypto.svg',
};

// Status badge colors
const statusBadges: Record<string, string> = {
  'ongoing': 'bg-blue-100 text-blue-600 border-blue-200',
  'done': 'bg-green-100 text-green-600 border-green-200',
  'paused': 'bg-orange-100 text-orange-600 border-orange-200',
};

export default function CertificationPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  // For a real application, you would fetch the course data
  // based on the slug from an API or database
  const certificationData = {
    title: "Technical Analysis",
    description: "Understand chart patterns, indicators, and basic technical analysis methods to improve your trading decisions. Learn to identify trends, support and resistance levels, and potential market reversals.",
    category: "trading",
    technology: "stocks",
    estimatedHours: 5,
    progress: 60,
    status: "ongoing",
    instructor: {
      name: "Jane Smith",
      title: "Senior Market Analyst",
      avatar: "/instructors/jane.jpg"
    },
    lastUpdated: "August 2023",
    modules: [
      {
        title: "Introduction to Technical Analysis",
        duration: "45 min",
        isCompleted: true
      },
      {
        title: "Chart Types and Timeframes",
        duration: "30 min",
        isCompleted: true
      },
      {
        title: "Support and Resistance",
        duration: "60 min",
        isCompleted: true
      },
      {
        title: "Trend Lines and Channels",
        duration: "45 min",
        isCompleted: false,
        currentProgress: 25
      },
      {
        title: "Common Chart Patterns",
        duration: "90 min",
        isCompleted: false
      },
      {
        title: "Introduction to Indicators",
        duration: "60 min",
        isCompleted: false
      },
      {
        title: "Final Assessment",
        duration: "30 min",
        isCompleted: false
      }
    ],
    skills: ["Chart Patterns", "Indicators", "Trend Analysis", "Support & Resistance", "Candlesticks"]
  }

  // Find the current module (first incomplete one)
  const currentModule = certificationData.modules.find(module => !module.isCompleted);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} />
        </Button>
        <span className="text-sm text-gray-500">Back to courses</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                  {techIcons[certificationData.technology] ? (
                    <img 
                      src={techIcons[certificationData.technology]} 
                      alt={certificationData.technology}
                      className="w-8 h-8"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center">
                      {certificationData.technology.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <Badge className={statusBadges[certificationData.status]}>
                    {certificationData.status.charAt(0).toUpperCase() + certificationData.status.slice(1)}
                  </Badge>
                  <h1 className="text-3xl font-bold mt-2">{certificationData.title}</h1>
                  <div className="text-sm text-gray-500">
                    {certificationData.category.charAt(0).toUpperCase() + certificationData.category.slice(1)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10">
                  {certificationData.instructor.avatar ? (
                    <AvatarImage src={certificationData.instructor.avatar} alt={certificationData.instructor.name} />
                  ) : (
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                      {certificationData.instructor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{certificationData.instructor.name}</p>
                  <p className="text-xs text-gray-500">{certificationData.instructor.title}</p>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600">{certificationData.description}</p>
            
            <div className="flex flex-wrap gap-4 py-2">
              <div className="flex items-center gap-1 text-gray-600">
                <Clock size={16} />
                <span>{certificationData.estimatedHours} hours</span>
              </div>
              
              <div className="flex items-center gap-1 text-gray-600">
                <BookOpen size={16} />
                <span>{certificationData.modules.length} modules</span>
              </div>
              
              <div className="flex items-center gap-1 text-gray-600">
                <Award size={16} />
                <span>Certification included</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Course progress</span>
              <span className="font-medium">{certificationData.progress}%</span>
            </div>
            <Progress 
              value={certificationData.progress} 
              className="h-2" 
              indicatorClassName={certificationData.status === 'paused' ? 'bg-orange-500' : 'bg-blue-500'}
            />
          </div>
          
          <Tabs defaultValue="curriculum">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="curriculum" className="space-y-4 pt-4">
              <h2 className="text-xl font-semibold">Course Content</h2>
              
              <div className="space-y-3">
                {certificationData.modules.map((module, index) => (
                  <Card key={index} className={module.isCompleted ? "border-green-200 bg-green-50/30" : ""}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          {module.isCompleted ? (
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                              <CheckCircle2 size={14} />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                              {index + 1}
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{module.title}</p>
                            <p className="text-xs text-gray-500">{module.duration}</p>
                          </div>
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant={module.isCompleted ? "outline" : "default"}
                          className="text-xs"
                        >
                          {module.isCompleted ? "Review" : "Start"}
                        </Button>
                      </div>
                      
                      {/* Show progress for current module */}
                      {!module.isCompleted && module.currentProgress && (
                        <div className="mt-3">
                          <Progress value={module.currentProgress} className="h-1 mt-2" />
                          <p className="text-xs text-gray-500 mt-1">{module.currentProgress}% complete</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Button className="w-full mt-4">Continue Course</Button>
            </TabsContent>
            
            <TabsContent value="overview" className="space-y-6 pt-4">
              <div>
                <h2 className="text-xl font-semibold mb-3">Skills You'll Gain</h2>
                <div className="flex flex-wrap gap-2">
                  {certificationData.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">About the Instructor</h2>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    {certificationData.instructor.avatar ? (
                      <AvatarImage src={certificationData.instructor.avatar} alt={certificationData.instructor.name} />
                    ) : (
                      <AvatarFallback className="bg-gray-200 text-gray-600 text-lg">
                        {certificationData.instructor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium text-lg">{certificationData.instructor.name}</p>
                    <p className="text-sm text-gray-500">{certificationData.instructor.title}</p>
                    <p className="text-sm mt-2">
                      Expert in technical analysis with over 10 years of experience in financial markets. 
                      Specializes in chart pattern recognition and trading strategy development.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Course Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Last updated</p>
                    <p>{certificationData.lastUpdated}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Certification</p>
                    <p>Available after completion</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p>{certificationData.category.charAt(0).toUpperCase() + certificationData.category.slice(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Technology</p>
                    <p>{certificationData.technology.charAt(0).toUpperCase() + certificationData.technology.slice(1)}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>
                {certificationData.progress}% Complete
              </CardDescription>
              <Progress 
                value={certificationData.progress} 
                className="h-2 mt-2" 
                indicatorClassName={certificationData.status === 'paused' ? 'bg-orange-500' : 'bg-blue-500'}
              />
            </CardHeader>
            <CardContent className="space-y-4">
              {currentModule && (
                <div className="space-y-2">
                  <h3 className="font-medium">Current Module</h3>
                  <p className="text-sm">{currentModule.title}</p>
                  {currentModule.currentProgress && (
                    <>
                      <Progress value={currentModule.currentProgress} className="h-1.5" />
                      <p className="text-xs text-gray-500">{currentModule.currentProgress}% complete</p>
                    </>
                  )}
                </div>
              )}
              
              <Button className="w-full">Continue Learning</Button>
              
              <div className="p-4 bg-blue-50 rounded-lg text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="text-blue-600" size={18} />
                  <p className="font-medium text-blue-700">Certificate Available</p>
                </div>
                <p className="text-blue-600 text-xs">Complete this course to earn your certificate and showcase your skills.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 