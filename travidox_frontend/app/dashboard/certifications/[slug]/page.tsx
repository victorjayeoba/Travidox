"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowLeft, BookOpen, Clock, Award, CheckCircle2, 
  GraduationCap, Loader2, Play, Pause, ChevronRight, 
  ChevronLeft, Star, StarHalf, BookText, BarChart2, 
  TrendingUp, Layers, Download, ClipboardCheck
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/hooks/useAuth'
import { 
  fetchUserCourseProgress, 
  fetchCourseProgress,
  completeModule, 
  CourseProgress,
  getCourseReviews,
  getUserCertificates,
  Certificate
} from '@/lib/firebase-courses'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { LearningInterface } from '@/components/learning/LearningInterface'
import { ReviewDialog } from '@/components/learning/ReviewDialog'
import { getCourseById } from '@/lib/course-data'
import { toast } from 'sonner'

// Status badge colors
const statusBadges: Record<string, string> = {
  'in-progress': 'bg-blue-100 text-blue-600 border-blue-200',
  'completed': 'bg-green-100 text-green-600 border-green-200',
  'not-started': 'bg-gray-100 text-gray-600 border-gray-200',
};

// Icon component mapper
const IconComponent = ({ name }: { name: string }) => {
  switch (name) {
    case "BookText":
      return <BookText className="h-10 w-10 text-blue-500" />;
    case "BarChart2":
      return <BarChart2 className="h-10 w-10 text-purple-500" />;
    case "TrendingUp":
      return <TrendingUp className="h-10 w-10 text-red-500" />;
    case "Layers":
      return <Layers className="h-10 w-10 text-green-500" />;
    default:
      return <BookText className="h-10 w-10 text-gray-500" />;
  }
};

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
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [courseReviews, setCourseReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [totalContentCount, setTotalContentCount] = useState(0);
  
  // Find the course data based on the slug
  const courseData = getCourseById(slug);
  
  // Calculate total content count for progress tracking
  useEffect(() => {
    if (courseData) {
      let count = 0;
      courseData.modules.forEach(module => {
        count += module.content ? module.content.length : 0;
      });
      setTotalContentCount(count);
    }
  }, [courseData]);
  
  // Fetch user progress for this course
  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.uid || !courseData) return;
      
      try {
        setLoading(true);
        const progress = await fetchCourseProgress(user.uid, courseData.id);
        setCourseProgress(progress);
        
        // Get certificate if course is completed
        if (progress?.completedAt && progress?.certificateId) {
          const userCertificates = await getUserCertificates(user.uid);
          const thisCertificate = userCertificates.find(c => c.id === progress.certificateId);
          if (thisCertificate) {
            setCertificate(thisCertificate);
          }
        }
        
        // Get course reviews
        const reviews = await getCourseReviews(courseData.id);
        setCourseReviews(reviews);
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
    
    return {
      ...module,
      isCompleted,
      isCurrent
    };
  });
  
  // Sort modules by order property
  const sortedModules = [...updatedModules].sort((a, b) => a.order - b.order);
  
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
      
      // Get next module
      const moduleIndex = sortedModules.findIndex(m => m.id === currentModule.id);
      const nextModule = moduleIndex < sortedModules.length - 1 ? sortedModules[moduleIndex + 1] : null;
      
      // Check if this would be the last module (course will be completed)
      const completedModules = courseProgress?.completedModuleIds || [];
      const isLastModule = moduleIndex === sortedModules.length - 1 || 
                          (completedModules.length + 1) >= courseData.modules.length;
      
      const success = await completeModule(
        user?.uid || "",
        courseData?.id || "",
        currentModule.id,
        nextModule?.id || null,
        courseData?.modules.length || 0
      );

      if (success) {
        // Refresh progress
        const progress = await fetchCourseProgress(user?.uid || "", courseData?.id || "");
        setCourseProgress(progress);
        
        if (isLastModule || progress?.completedAt) {
          toast.success('Congratulations! You have completed the course and earned a certificate!');
          
          // Force refresh status to completed
          status = 'completed';
          progressPercentage = 100;
          
          // Get certificate
          if (progress?.certificateId) {
            const userCertificates = await getUserCertificates(user?.uid || "");
            const thisCertificate = userCertificates.find(c => c.id === progress.certificateId);
            if (thisCertificate) {
              setCertificate(thisCertificate);
              // Redirect to certificate page
              setIsLearning(false); // Close learning interface
              router.push(`/dashboard/certifications/${slug}/certificate`);
              return;
            }
          }
        }
        
        // Show review dialog if not redirecting to certificate
        setShowReview(true);
      }
    } catch (error) {
      console.error('Error completing module:', error);
      toast.error('Failed to complete module');
    } finally {
      setUpdatingModule(null);
    }
  };

  // Handle review submission
  const handleSubmitReview = async (rating: number, review: string) => {
    // Here you would typically save the review to your database
    setShowReview(false);
    setIsLearning(false);
    toast.success('Thank you for your feedback!');
  };

  // Continue course function
  const handleContinueCourse = () => {
    const nextModule = sortedModules.find(module => !module.isCompleted);
    if (nextModule) {
      handleStartModule(nextModule);
    } else {
      // If all modules are completed, go to the first one
      handleStartModule(sortedModules[0]);
    }
  };

  // Format course duration
  const formatCourseDuration = () => {
    const totalMinutes = courseData.modules.reduce((acc, module) => {
      const durationStr = module.duration;
      const minutes = parseInt(durationStr.match(/\d+/)?.[0] || "0");
      return acc + minutes;
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  // Calculate average rating
  const averageRating = courseData.averageRating || 
    (courseReviews.length ? 
      courseReviews.reduce((acc, review) => acc + review.rating, 0) / courseReviews.length : 
      0);

  // Render stars for rating
  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
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
        <>
          {/* Course header */}
            <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  <IconComponent name={courseData.icon} />
                  </div>
                  <div>
                    <Badge className={statusBadges[status]}>
                      {status === 'in-progress' ? 'In Progress' : 
                       status === 'completed' ? 'Completed' : 'Not Started'}
                    </Badge>
                    <h1 className="text-3xl font-bold mt-2">{courseData.title}</h1>
                  <p className="text-lg text-gray-600 mt-1">{courseData.subtitle}</p>
                  <div className="flex items-center mt-2 gap-2">
                    <div className="flex items-center">
                      {renderRatingStars(averageRating)}
                      <span className="ml-2 text-sm font-medium">{averageRating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-gray-500">({courseData.totalStudents || courseReviews.length} students)</span>
                    <span className="text-sm text-gray-500">• {courseData.category}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>{formatCourseDuration()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <BookOpen size={16} />
                      <span>{courseData.modules.length} modules</span>
                    </div>
                    {courseData.certificationIncluded && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <Award size={16} />
                        <span>Certificate Included</span>
                </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <div className="flex flex-col gap-4">
                  {status === 'not-started' ? (
                    <Button size="lg" onClick={handleContinueCourse}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Course
                    </Button>
                  ) : status === 'in-progress' ? (
                    <Button size="lg" onClick={handleContinueCourse}>
                      <Play className="h-4 w-4 mr-2" />
                      Continue Course
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      onClick={() => router.push(`/dashboard/certifications/${slug}/certificate`)}
                    >
                      <Award className="h-4 w-4 mr-2" />
                      View Certificate
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            {status !== 'not-started' && (
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm font-medium">{progressPercentage}% complete</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )}
            </div>
            
          {/* Course content tabs */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Course</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: courseData.longDescription }} />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>What You'll Learn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {courseData.skills.map((skill, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  {courseData.prerequisites.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Prerequisites</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {courseData.prerequisites.map((prereq, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium">{prereq.title}</p>
                                <p className="text-sm text-gray-600">{prereq.description}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Instructor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-16 w-16">
                          {courseData.instructor.avatar ? (
                            <AvatarImage src={courseData.instructor.avatar} alt={courseData.instructor.name} />
                          ) : (
                            <AvatarFallback className="text-lg">
                              {courseData.instructor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{courseData.instructor.name}</h3>
                          <p className="text-sm text-gray-600">{courseData.instructor.title}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{courseData.instructor.bio}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Level</span>
                        <span className="font-medium capitalize">{courseData.difficulty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total duration</span>
                        <span className="font-medium">{formatCourseDuration()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Modules</span>
                        <span className="font-medium">{courseData.modules.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Certificate</span>
                        <span className="font-medium">{courseData.certificationIncluded ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last updated</span>
                        <span className="font-medium">{courseData.lastUpdated}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Language</span>
                        <span className="font-medium">{courseData.language}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <CardDescription>
                    {courseData.modules.length} modules • {formatCourseDuration()} total duration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion 
                    type="multiple" 
                    defaultValue={sortedModules.map(m => m.id)}
                    className="space-y-4"
                  >
                    {sortedModules.map((module) => (
                      <AccordionItem 
                        key={module.id} 
                        value={module.id}
                        className="border rounded-lg overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 data-[state=open]:bg-gray-50">
                          <div className="flex items-center gap-3 text-left">
                            {module.isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                            ) : module.isCurrent ? (
                              <Play className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            )}
                            <div>
                              <h3 className="font-medium">{module.title}</h3>
                              <div className="text-sm text-gray-500">
                                {module.content?.length || 0} lectures • {module.duration}
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-gray-50">
                          <div className="px-4 py-2 border-b text-sm text-gray-600">
                            {module.description}
                          </div>
                          <ul className="divide-y">
                            {module.content?.map((content, i) => (
                              <li key={content.id} className="px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {content.type === 'video' && <Play className="h-4 w-4 text-gray-500" />}
                                  {content.type === 'text' && <BookText className="h-4 w-4 text-gray-500" />}
                                  {content.type === 'quiz' && <BarChart2 className="h-4 w-4 text-gray-500" />}
                                  {content.type === 'assignment' && <ClipboardCheck className="h-4 w-4 text-gray-500" />}
                                  <span className="text-sm">{content.title}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-gray-500">{content.duration}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                          <div className="p-4 flex justify-end border-t">
                          <Button 
                            size="sm" 
                              onClick={() => handleStartModule(module)}
                            >
                              {module.isCompleted ? 'Review Module' : module.isCurrent ? 'Continue Module' : 'Start Module'}
                          </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                      </CardContent>
                    </Card>
              </TabsContent>
              
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                  <CardDescription>
                    {courseReviews.length} reviews • {averageRating.toFixed(1)} average rating
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-4">
                    <div className="md:col-span-1 flex flex-col items-center justify-center p-6 border rounded-lg">
                      <div className="text-5xl font-bold text-center mb-2">
                        {averageRating.toFixed(1)}
                      </div>
                      <div className="flex mb-2">
                        {renderRatingStars(averageRating)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {courseData.totalStudents || courseReviews.length} students
                  </div>
                </div>
                
                    <div className="md:col-span-3">
                      {courseReviews.length > 0 ? (
                        <div className="space-y-6">
                          {courseReviews.map((review) => (
                            <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-10 w-10">
                                    {review.userAvatar ? (
                                      <AvatarImage src={review.userAvatar} alt={review.userName} />
                                    ) : (
                                      <AvatarFallback>
                                        {review.userName.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                                    <h4 className="font-medium">{review.userName}</h4>
                                    <div className="flex items-center mt-1">
                                      {renderRatingStars(review.rating)}
                                      <span className="ml-2 text-sm text-gray-500">
                                        {new Date(review.createdAt.toDate()).toLocaleDateString()}
                                      </span>
                                    </div>
                    </div>
                  </div>
                </div>
                              <p className="text-gray-700">{review.comment}</p>
                              
                              {review.replyFromInstructor && (
                                <div className="mt-4 ml-12 p-4 bg-gray-50 rounded-lg">
                                  <h5 className="font-medium text-sm">
                                    {review.replyFromInstructor.instructorName} <span className="text-blue-600">(Instructor)</span>
                                  </h5>
                                  <p className="mt-2 text-sm">{review.replyFromInstructor.text}</p>
                                </div>
                              )}
                    </div>
                          ))}
                    </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                          <p className="text-gray-500 mb-4">No reviews yet for this course.</p>
                          <p className="text-sm text-gray-400">Be the first to share your experience!</p>
                    </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              </TabsContent>
            </Tabs>
        </>
      )}
      
      {/* Learning Interface */}
      {isLearning && currentModule && (
        <LearningInterface
          course={{
            id: courseData.id,
            title: courseData.title
          }}
          module={currentModule}
          onClose={() => setIsLearning(false)}
          onComplete={handleCompleteModule}
          allModules={sortedModules}
          totalContents={totalContentCount}
        />
      )}
      
      {/* Review Dialog */}
      <ReviewDialog
        open={showReview}
        onOpenChange={setShowReview}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
} 