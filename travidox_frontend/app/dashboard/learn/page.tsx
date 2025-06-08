"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Lock, PlayCircle, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useAuth } from '@/components/auth/auth-provider'

// Course data
const courses = [
  {
    id: 'intro-to-investing',
    title: 'Introduction to Investing',
    description: 'Learn the basics of investing and how to get started in the stock market.',
    duration: '45 minutes',
    xpReward: 300,
    level: 'Beginner',
    image: '/images/courses/intro-investing.jpg',
    modules: [
      { id: 'module-1', title: 'What is Investing?' },
      { id: 'module-2', title: 'Types of Investments' },
      { id: 'module-3', title: 'Risk and Return' },
      { id: 'module-4', title: 'Getting Started' }
    ]
  },
  {
    id: 'stock-market-basics',
    title: 'Stock Market Basics',
    description: 'Understand how the stock market works and learn to analyze stock data.',
    duration: '1 hour',
    xpReward: 500,
    level: 'Beginner',
    image: '/images/courses/stock-market.jpg',
    modules: [
      { id: 'module-1', title: 'Stock Market Overview' },
      { id: 'module-2', title: 'How to Read Stock Charts' },
      { id: 'module-3', title: 'Fundamental Analysis' },
      { id: 'module-4', title: 'Technical Analysis' }
    ]
  },
  {
    id: 'portfolio-management',
    title: 'Portfolio Management',
    description: 'Learn how to build and manage a balanced investment portfolio.',
    duration: '1.5 hours',
    xpReward: 800,
    level: 'Intermediate',
    image: '/images/courses/portfolio.jpg',
    modules: [
      { id: 'module-1', title: 'Asset Allocation' },
      { id: 'module-2', title: 'Diversification Strategies' },
      { id: 'module-3', title: 'Portfolio Rebalancing' },
      { id: 'module-4', title: 'Tax Optimization' }
    ]
  }
];

export default function LearnPage() {
  const { user } = useAuth();
  const { profile, addXpAndUpdateBalance } = useUserProfile();
  const router = useRouter();
  const [completingCourse, setCompletingCourse] = useState<string | null>(null);
  
  const completedCourses = profile?.completedCourses || [];
  
  const handleCompleteCourse = async (courseId: string, xpReward: number) => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setCompletingCourse(courseId);
    
    try {
      // Update user profile with XP and mark course as completed
      await addXpAndUpdateBalance(xpReward, courseId);
      
      // Show success message or modal
      alert(`Congratulations! You've earned ${xpReward} XP and ₦${xpReward.toFixed(2)} has been added to your balance.`);
    } catch (error) {
      console.error('Error completing course:', error);
    } finally {
      setCompletingCourse(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Learning Center</h1>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1.5 bg-green-50 text-green-800">
            <Star className="h-3.5 w-3.5 fill-green-500 text-green-500" />
            <span>{profile?.xp || 0} XP</span>
          </Badge>
        </div>
      </div>
      
      {/* Progress Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Your Learning Progress</CardTitle>
          <CardDescription>Track your course completion and learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Courses Completed</span>
                <span className="font-medium">{completedCourses.length}/{courses.length}</span>
              </div>
              <Progress value={(completedCourses.length / courses.length) * 100} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 mb-1">Total XP Earned</div>
                <div className="text-2xl font-bold">{profile?.xp || 0} XP</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-600 mb-1">Balance Earned</div>
                <div className="text-2xl font-bold">₦{(profile?.balance || 0).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Course List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const isCompleted = completedCourses.includes(course.id);
          
          return (
            <Card key={course.id} className={isCompleted ? 'border-green-200 bg-green-50' : ''}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  {isCompleted ? (
                    <Badge className="bg-green-100 text-green-800">
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      <Star className="h-3.5 w-3.5 mr-1" />
                      {course.xpReward} XP
                    </Badge>
                  )}
                </div>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <PlayCircle className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="text-gray-500">Level: {course.level}</div>
                  </div>
                  
                  <div className="pt-2">
                    {isCompleted ? (
                      <Button variant="outline" className="w-full" onClick={() => router.push(`/dashboard/learn/${course.id}`)}>
                        Review Course
                      </Button>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={() => handleCompleteCourse(course.id, course.xpReward)}
                        disabled={!!completingCourse}
                      >
                        {completingCourse === course.id ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                            Completing...
                          </>
                        ) : (
                          'Start Course'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 