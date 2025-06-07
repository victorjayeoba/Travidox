"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, BookOpen, Clock, Award, CheckCircle2, GraduationCap, Loader2, Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { fetchUserCourseProgress, completeModule, CourseProgress } from '@/lib/firebase-courses'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { LearningInterface } from '@/components/learning/LearningInterface'
import { ReviewDialog } from '@/components/learning/ReviewDialog'
import { getCourseById } from '@/lib/course-data'

// Status badge colors
const statusBadges: Record<string, string> = {
  'in-progress': 'bg-blue-100 text-blue-600 border-blue-200',
  'completed': 'bg-green-100 text-green-600 border-green-200',
  'not-started': 'bg-gray-100 text-gray-600 border-gray-200',
};

// Add new interfaces for learning content
interface LearningContent {
  id: string;
  type: 'video' | 'text' | 'quiz';
  title: string;
  duration: string;
  content: string;
  videoUrl?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export default function CertificationPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
  const [updatingModule, setUpdatingModule] = useState<string | null>(null);
  const [currentModule, setCurrentModule] = useState<any>(null);
  const [isLearning, setIsLearning] = useState(false);
  const [showReview, setShowReview] = useState(false);
  
  // Find the course data based on the slug
  const courseData = getCourseById(slug);
  
  // Fetch user progress for this courses
  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.uid || !courseData) return;
      
      try {
        setLoading(true);
        const progressData = await fetchUserCourseProgress(user.uid);
        const thisCourseProgress = progressData.find(p => p.courseId === courseData.id);
        setCourseProgress(thisCourseProgress || null);
      } catch (error) {
        console.error('Error loading course progress:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProgress();
  }, [user?.uid, courseData]);
  
  // If course doesn't exist, show error
  if (!courseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <p className="text-gray-500 mb-6">The course you are looking for does not exist.</p>
        <Button onClick={() => router.push('/dashboard/certifications')}>
          Back to Courses
        </Button>
      </div>
    );
  }
  
  // Determine course status and progress
  let status: string = 'not-started';
  let progressPercentage: number = 0;
  
  if (courseProgress) {
    progressPercentage = courseProgress.percentComplete;
    status = courseProgress.completedAt ? 'completed' : 'in-progress';
  }
  
  // Update modules with completion status
  const updatedModules = courseData.modules.map(module => {
    const isCompleted = courseProgress?.completedModuleIds.includes(module.id) || false;
    const isCurrent = courseProgress?.lastModuleId === module.id;
    let currentProgress = 0;
    
    if (isCurrent && !isCompleted) {
      currentProgress = 10; // Default to 10% started
    }
    
    return {
      ...module,
      isCompleted,
      isCurrent,
      currentProgress
    };
  });
  
  // Handle starting a module
  const handleStartModule = (module: any) => {
    setCurrentModule(module);
    setIsLearning(true);
  };

  // Handle module review
  const handleModuleReview = (moduleId: string) => {
    const module = courseData.modules.find(m => m.id === moduleId);
    if (module) {
      setCurrentModule(module);
      setShowReview(true);
    }
  };

  // Handle module completion
  const handleCompleteModule = async () => {
    if (!currentModule) return;

    try {
      setUpdatingModule(currentModule.id);
      const success = await completeModule(
        user?.uid || "",
        courseData?.id || "",
        currentModule.id,
        null,
        courseData?.modules.length || 0
      );

      if (success) {
        // Refresh progress
        const progressData = await fetchUserCourseProgress(user?.uid || "");
        const thisCourseProgress = progressData.find(p => p.courseId === courseData?.id);
        setCourseProgress(thisCourseProgress || null);
        
        // Show review dialog
        setShowReview(true);
      }
    } catch (error) {
      console.error('Error completing module:', error);
    } finally {
      setUpdatingModule(null);
    }
  };

  // Handle review submission
  const handleSubmitReview = async (rating: number, review: string) => {
    // Here you would typically save the review to your database
    setShowReview(false);
    setIsLearning(false);
  };

  // Continue course function
  const handleContinueCourse = () => {
    const nextModule = updatedModules.find(module => !module.isCompleted);
    if (nextModule) {
      handleStartModule(nextModule);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => router.push('/dashboard/certifications')}
        >
          <ArrowLeft size={16} />
        </Button>
        <span className="text-sm text-gray-500">Back to courses</span>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading course data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center">
                      {courseData.icon ? courseData.icon.charAt(0) : courseData.title.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <Badge className={statusBadges[status]}>
                      {status === 'in-progress' ? 'In Progress' : 
                       status === 'completed' ? 'Completed' : 'Not Started'}
                    </Badge>
                    <h1 className="text-3xl font-bold mt-2">{courseData.title}</h1>
                    <div className="text-sm text-gray-500">
                      {courseData.category}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Avatar className="w-10 h-10">
                    {courseData.instructor.avatar ? (
                      <AvatarImage src={courseData.instructor.avatar} alt={courseData.instructor.name} />
                    ) : (
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        {courseData.instructor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{courseData.instructor.name}</p>
                    <p className="text-xs text-gray-500">{courseData.instructor.title}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600">{courseData.description}</p>
              
              <div className="flex flex-wrap gap-4 py-2">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock size={16} />
                  <span>{courseData.estimatedHours} hours</span>
                </div>
                
                <div className="flex items-center gap-1 text-gray-600">
                  <BookOpen size={16} />
                  <span>{courseData.modules.length} modules</span>
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
                <span className="font-medium">{progressPercentage}%</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2" 
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
                  {updatedModules.map((module, index) => (
                    <Card key={module.id} className={module.isCompleted ? "border-green-200 bg-green-50/30" : ""}>
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
                            onClick={() => module.isCompleted ? handleModuleReview(module.id) : handleStartModule(module)}
                            disabled={updatingModule === module.id || (!module.isCompleted && !module.isCurrent && !courseProgress)}
                          >
                            {updatingModule === module.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : module.isCompleted ? (
                              "Review"
                            ) : (
                              "Start"
                            )}
                          </Button>
                        </div>
                        
                        {/* Show progress for current module */}
                        {!module.isCompleted && module.currentProgress > 0 && (
                          <div className="mt-3">
                            <Progress value={module.currentProgress} className="h-1 mt-2" />
                            <p className="text-xs text-gray-500 mt-1">{module.currentProgress}% complete</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  onClick={handleContinueCourse}
                  disabled={!updatedModules.find(m => !m.isCompleted) || status === 'completed' || updatingModule !== null}
                >
                  {updatingModule ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : status === 'completed' ? (
                    "Course Completed"
                  ) : (
                    "Continue Course"
                  )}
                </Button>
              </TabsContent>
              
              <TabsContent value="overview" className="space-y-6 pt-4">
                <div>
                  <h2 className="text-xl font-semibold mb-3">Skills You'll Gain</h2>
                  <div className="flex flex-wrap gap-2">
                    {courseData.skills.map((skill, index) => (
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
                      {courseData.instructor.avatar ? (
                        <AvatarImage src={courseData.instructor.avatar} alt={courseData.instructor.name} />
                      ) : (
                        <AvatarFallback className="bg-gray-200 text-gray-600 text-lg">
                          {courseData.instructor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium text-lg">{courseData.instructor.name}</p>
                      <p className="text-sm text-gray-500">{courseData.instructor.title}</p>
                      <p className="text-sm mt-2">
                        Expert in {courseData.category.toLowerCase()} with over 5 years of experience.
                        Specializes in {courseData.skills.slice(0, 2).join(' and ')}.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-3">Course Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Last updated</p>
                      <p>{courseData.lastUpdated}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Certification</p>
                      <p>Available after completion</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p>{courseData.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Time</p>
                      <p>{courseData.estimatedHours} hours</p>
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
                  {progressPercentage}% Complete
                </CardDescription>
                <Progress 
                  value={progressPercentage} 
                  className="h-2 mt-2" 
                />
              </CardHeader>
              <CardContent className="space-y-4">
                {currentModule && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Current Module</h3>
                    <p className="text-sm">{currentModule.title}</p>
                    {currentModule.currentProgress > 0 && (
                      <>
                        <Progress value={currentModule.currentProgress} className="h-1.5" />
                        <p className="text-xs text-gray-500">{currentModule.currentProgress}% complete</p>
                      </>
                    )}
                  </div>
                )}
                
                <Button 
                  className="w-full"
                  onClick={handleContinueCourse}
                  disabled={!updatedModules.find(m => !m.isCompleted) || status === 'completed' || updatingModule !== null}
                >
                  {updatingModule ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : status === 'completed' ? (
                    "View Certificate"
                  ) : status === 'not-started' ? (
                    "Start Learning"
                  ) : (
                    "Continue Learning"
                  )}
                </Button>
                
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
      )}
      
      {/* Add Learning Interface */}
      {isLearning && currentModule && (
        <LearningInterface
          module={currentModule}
          onClose={() => setIsLearning(false)}
          onComplete={handleCompleteModule}
        />
      )}
      
      {/* Add Review Dialog */}
      <ReviewDialog
        open={showReview}
        onOpenChange={setShowReview}
        onSubmit={handleSubmitReview}
      />
    </div>
  )
} 