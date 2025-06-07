"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BookOpen, Clock, CheckCircle, ChevronRight, 
  BarChart2, TrendingUp, DollarSign, BookText, 
  Layers, ArrowUpRight, Award, BookMarked
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import { 
  fetchUserCourseProgress, 
  enrollInCourse,
  CourseProgress
} from '@/lib/firebase-courses'

// Types for our course progress tracking
interface CourseModule {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
}

interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  estimatedHours: number;
  icon: string;
  modules: CourseModule[];
}

// Mock courses data
const coursesData: Course[] = [
  {
    id: "course-1",
    title: "Stock Market Terminology",
    category: "Market Education",
    description: "Master the essential vocabulary and concepts that every stock market investor needs to understand before trading.",
    tags: ["Market Vocabulary", "Financial Terms", "Trading Jargon"],
    estimatedHours: 3,
    icon: "BookText",
    modules: [
      { id: "m1-1", title: "Basic Market Terminology", duration: "30 min", isCompleted: false },
      { id: "m1-2", title: "Order Types Explained", duration: "45 min", isCompleted: false },
      { id: "m1-3", title: "Understanding Financial Statements", duration: "60 min", isCompleted: false },
      { id: "m1-4", title: "Market Indicators Overview", duration: "45 min", isCompleted: false }
    ]
  },
  {
    id: "course-2",
    title: "Candlestick Pattern Recognition",
    category: "Chart Analysis",
    description: "Learn to identify and trade powerful Japanese candlestick patterns for better market timing.",
    tags: ["Reversal Patterns", "Continuation Patterns", "Multi-Candle Patterns"],
    estimatedHours: 5,
    icon: "BarChart2",
    modules: [
      { id: "m2-1", title: "Candlestick Basics", duration: "40 min", isCompleted: false },
      { id: "m2-2", title: "Single Candlestick Patterns", duration: "60 min", isCompleted: false },
      { id: "m2-3", title: "Double Candlestick Patterns", duration: "60 min", isCompleted: false },
      { id: "m2-4", title: "Triple Candlestick Patterns", duration: "60 min", isCompleted: false },
      { id: "m2-5", title: "Pattern Trading Strategies", duration: "80 min", isCompleted: false }
    ]
  },
  {
    id: "course-3",
    title: "Sector Rotation Strategies",
    category: "Market Dynamics",
    description: "Optimize portfolio performance by understanding market cycles and sector movements in different economic phases.",
    tags: ["Economic Cycles", "Sector Analysis", "Rotation Timing"],
    estimatedHours: 4,
    icon: "TrendingUp",
    modules: [
      { id: "m3-1", title: "Economic Cycle Fundamentals", duration: "45 min", isCompleted: false },
      { id: "m3-2", title: "Sector Performance Analysis", duration: "60 min", isCompleted: false },
      { id: "m3-3", title: "Identifying Rotation Signals", duration: "45 min", isCompleted: false },
      { id: "m3-4", title: "Building a Sector Rotation Portfolio", duration: "90 min", isCompleted: false }
    ]
  },
  {
    id: "course-4",
    title: "Risk Management Essentials",
    category: "Trading Strategy",
    description: "Learn to protect your capital with proper position sizing, stop-loss strategies, and risk-reward optimization.",
    tags: ["Position Sizing", "Stop-Loss Techniques", "Risk-Reward Ratio"],
    estimatedHours: 3.5,
    icon: "Layers",
    modules: [
      { id: "m4-1", title: "Understanding Trading Risk", duration: "40 min", isCompleted: false },
      { id: "m4-2", title: "Position Sizing Strategies", duration: "50 min", isCompleted: false },
      { id: "m4-3", title: "Effective Stop-Loss Placement", duration: "45 min", isCompleted: false },
      { id: "m4-4", title: "Risk-Reward Optimization", duration: "45 min", isCompleted: false },
      { id: "m4-5", title: "Creating a Risk Management Plan", duration: "30 min", isCompleted: false }
    ]
  }
];

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
      return <BookMarked className="h-10 w-10 text-gray-500" />;
  }
};

export default function CertificationsPage() {
  const router = useRouter();
  const { user } = useAuth(); // Get current user from auth hook
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<CourseProgress[]>([]);
  
  // Fetch user progress on component mount
  useEffect(() => {
    const loadUserProgress = async () => {
      setLoading(true);
      try {
        // Fetch user progress if user is logged in
        if (user?.uid) {
          const progressData = await fetchUserCourseProgress(user.uid);
          setUserProgress(progressData);
        }
      } catch (error) {
        console.error('Error loading user progress:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProgress();
  }, [user?.uid]);
  
  // Get unique categories for filter
  const categories = ["all", ...new Set(coursesData.map(course => course.category))];
  
  // Filter courses based on search, category, and status
  const filteredCourses = coursesData.filter(course => {
    // Search filter
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    // Category filter
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter !== "all") {
      const progress = userProgress.find(p => p.courseId === course.id);
      if (statusFilter === "not-started") {
        matchesStatus = !progress;
      } else if (statusFilter === "in-progress") {
        matchesStatus = !!progress && !progress.completedAt;
      } else if (statusFilter === "completed") {
        matchesStatus = !!progress && !!progress.completedAt;
      }
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Get course status and progress
  const getCourseStatus = (courseId: string) => {
    const progress = userProgress.find(p => p.courseId === courseId);
    
    if (!progress) {
      return { status: "not-started", progress: 0, lastModule: null };
    }
    
    if (progress.completedAt) {
      return { status: "completed", progress: 100, lastModule: null };
    }
    
    return { 
      status: "in-progress", 
      progress: progress.percentComplete,
      lastModule: coursesData
        .find(c => c.id === courseId)?.modules
        .find(m => m.id === progress.lastModuleId)
    };
  };
  
  // Calculate totals for the stats cards
  const totalCourses = coursesData.length;
  const completedCourses = userProgress.filter(p => p.completedAt).length;
  const inProgressCourses = userProgress.filter(p => !p.completedAt).length;
  const notStartedCourses = totalCourses - completedCourses - inProgressCourses;
  
  // Handle course action based on status
  const handleCourseAction = async (courseId: string) => {
    if (!user?.uid) {
      // If user is not logged in, redirect to login page
      router.push('/login?redirect=/dashboard/certifications');
      return;
    }
    
    const { status } = getCourseStatus(courseId);
    const course = coursesData.find(c => c.id === courseId);
    
    if (!course) return;
    
    if (status === "not-started") {
      try {
        setLoading(true);
        // Enroll in course - Make an API call to Firebase
        const firstModuleId = course.modules[0].id;
        const success = await enrollInCourse(user.uid, courseId, firstModuleId);
        
        if (success) {
          // Refresh user progress after enrollment
          const progressData = await fetchUserCourseProgress(user.uid);
          setUserProgress(progressData);
          
          // Navigate to course detail page
          router.push(`/dashboard/certifications/${courseId}`);
        }
      } catch (error) {
        console.error('Error enrolling in course:', error);
      } finally {
        setLoading(false);
      }
    } else if (status === "in-progress") {
      // Continue course
      router.push(`/dashboard/certifications/${courseId}`);
    } else {
      // View certificate
      router.push(`/dashboard/certifications/${courseId}/certificate`);
    }
  };
  
  // Loading state
  if (loading && userProgress.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4" />
        <p className="text-muted-foreground">Loading courses...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stock Market Courses</h1>
        <p className="text-gray-500">Enhance your trading and investing knowledge with our expert-led courses</p>
      </div>
      
      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Courses</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex items-center justify-between">
            <span className="text-3xl font-bold">{totalCourses}</span>
            <BookOpen className="h-8 w-8 text-gray-400" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex items-center justify-between">
            <span className="text-3xl font-bold">{completedCourses}</span>
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex items-center justify-between">
            <span className="text-3xl font-bold">{inProgressCourses}</span>
            <Clock className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Not Started</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex items-center justify-between">
            <span className="text-3xl font-bold">{notStartedCourses}</span>
            <BookMarked className="h-8 w-8 text-blue-400" />
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="w-48">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const { status, progress, lastModule } = getCourseStatus(course.id);
          
          return (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-start space-y-0 space-x-4">
                <div className="bg-gray-50 p-2 rounded-md">
                  <IconComponent name={course.icon} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold">{course.title}</CardTitle>
                  <CardDescription className="text-sm">{course.category}</CardDescription>
                </div>
                
                {/* Status Badge */}
                {status === "completed" && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 ml-auto">Completed</Badge>
                )}
                {status === "in-progress" && (
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 ml-auto">In Progress</Badge>
                )}
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                
                {/* Course Progress */}
                {status === "in-progress" && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium">Current module:</span> {lastModule?.title}
                    </p>
                  </div>
                )}
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {course.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {course.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{course.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between items-center border-t bg-gray-50 py-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.estimatedHours} hours
                </div>
                
                <Button 
                  variant={status === "completed" ? "outline" : "default"}
                  size="sm"
                  className={`gap-1 ${status === "completed" ? "text-green-600" : ""}`}
                  onClick={() => handleCourseAction(course.id)}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1" />
                  ) : status === "not-started" ? (
                    <>Enroll Now<ArrowUpRight className="h-4 w-4" /></>
                  ) : status === "in-progress" ? (
                    <>Continue Learning<ChevronRight className="h-4 w-4" /></>
                  ) : (
                    <>View Certificate<Award className="h-4 w-4" /></>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {/* Empty State */}
      {filteredCourses.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
} 