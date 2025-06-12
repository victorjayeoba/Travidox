import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, 
  Play, Pause, SkipForward, SkipBack,
  Volume2, VolumeX, Maximize, Bookmark, MessageSquare,
  ThumbsUp, ThumbsDown, FileText, CheckCircle, Clock,
  Download, RotateCcw, Settings, ClipboardCheck
} from 'lucide-react';
import { 
  completeContent, 
  completeModule, 
  updateLastAccessed,
  addNote,
  addBookmark
} from '@/lib/firebase-courses';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { MarkdownContent } from '@/components/ui/markdown';

interface LearningContent {
  id: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  title: string;
  duration: string;
  content: string;
  videoUrl?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }[];
  resources?: {
    id: string;
    title: string;
    type: 'pdf' | 'link' | 'code' | 'file';
    url: string;
    description: string;
  }[];
  assignment?: {
    description: string;
    submission: 'text' | 'file' | 'link';
    dueDate?: string;
  };
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  isCompleted: boolean;
  content: LearningContent[];
  order: number;
}

interface LearningInterfaceProps {
  course: {
    id: string;
    title: string;
  };
  module: Module;
  onClose: () => void;
  onComplete: () => void;
  allModules: Module[];
  totalContents: number;
}

export function LearningInterface({ 
  course,
  module, 
  onClose, 
  onComplete, 
  allModules,
  totalContents
}: LearningInterfaceProps) {
  const { user } = useAuth();
  const [currentContent, setCurrentContent] = useState<LearningContent | null>(null);
  const [contentIndex, setContentIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [note, setNote] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [assignmentText, setAssignmentText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuizExplanation, setShowQuizExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize content when module changes
  useEffect(() => {
    // Create placeholder content if module has no content
    if (!module?.content || module.content.length === 0) {
      // Create a placeholder content item
      const placeholderContent = {
        id: `placeholder-${module.id}`,
        type: 'text' as const,
        title: 'Module Content',
        duration: module.duration,
        content: `<div>
          <h2>Module: ${module.title}</h2>
          <p>This module content is currently being developed. You can mark this module as completed to continue with your course.</p>
        </div>`
      };
      
      // Set the placeholder content
      setCurrentContent(placeholderContent);
      setContentIndex(0);
      
      // Update last accessed in Firebase
      if (user?.uid) {
        updateLastAccessed(
          user.uid,
          course.id,
          module.id,
          placeholderContent.id
        );
      }
    } else if (module?.content?.length > 0) {
      setCurrentContent(module.content[0]);
      setContentIndex(0);
      
      // Update last accessed in Firebase
      if (user?.uid && module.content[0]) {
        updateLastAccessed(
          user.uid,
          course.id,
          module.id,
          module.content[0].id
        );
      }
    }
  }, [module, course, user]);

  // Handle video events
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
      
      // Mark content as completed if watched 80% of the video
      if (videoElement.currentTime > videoElement.duration * 0.8 && 
          currentContent && 
          currentContent.type === 'video' &&
          user?.uid) {
        completeContent(
          user.uid,
          course.id,
          module.id,
          currentContent.id,
          totalContents
        );
      }
    };
    
    const handleDurationChange = () => {
      setDuration(videoElement.duration);
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('durationchange', handleDurationChange);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    
    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('durationchange', handleDurationChange);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [currentContent, course.id, module.id, totalContents, user]);

  // If no content is available, show a message
  if (!module?.content?.length || !currentContent) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <div className="h-full flex flex-col">
          <div className="border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="font-semibold">{module?.title || 'Module'}</h2>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">No Content Available</h3>
              <p className="text-gray-500 mb-4">This module doesn't have any content yet.</p>
              <Button onClick={onClose}>Return to Course</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
      setIsMuted(value === 0);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCurrentTime(value);
    if (videoRef.current) {
      videoRef.current.currentTime = value;
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleFullscreenToggle = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
    
    setIsFullscreen(!isFullscreen);
  };

  const handleNextContent = async () => {
    // If module has no content or placeholder content, just mark module as completed
    if (!module.content || module.content.length === 0) {
      if (user?.uid && currentContent) {
        // Complete the placeholder content
        await completeContent(
          user.uid,
          course.id,
          module.id,
          currentContent.id,
          1 // Only one content item (the placeholder)
        );
      }
      return;
    }
    
    if (contentIndex < module.content.length - 1) {
      // Mark current content as completed
      if (user?.uid && currentContent) {
        await completeContent(
          user.uid,
          course.id,
          module.id,
          currentContent.id,
          totalContents
        );
      }
      
      const nextIndex = contentIndex + 1;
      setContentIndex(nextIndex);
      setCurrentContent(module.content[nextIndex]);
      
      // Update last accessed content
      if (user?.uid && module.content[nextIndex]) {
        await updateLastAccessed(
          user.uid,
          course.id,
          module.id,
          module.content[nextIndex].id
        );
      }
      
      // Reset UI states
      setQuizAnswer(null);
      setShowQuizExplanation(false);
      setNote('');
    }
  };

  const handlePrevContent = async () => {
    if (contentIndex > 0) {
      const prevIndex = contentIndex - 1;
      setContentIndex(prevIndex);
      setCurrentContent(module.content[prevIndex]);
      
      // Update last accessed content
      if (user?.uid && module.content[prevIndex]) {
        await updateLastAccessed(
          user.uid,
          course.id,
          module.id,
          module.content[prevIndex].id
        );
      }
      
      // Reset UI states
      setQuizAnswer(null);
      setShowQuizExplanation(false);
      setNote('');
    }
  };

  const handleQuizSubmit = async () => {
    if (quizAnswer === undefined || quizAnswer === null || !currentContent.quiz) return;
    
    const currentQuestion = currentContent.quiz[currentQuizIndex];
    const isCorrect = quizAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      toast.success('Correct answer! Well done!');
      setShowQuizExplanation(true);
      
      // If this is the last question and it's correct, mark content as completed
      if (currentQuizIndex === currentContent.quiz.length - 1 && user?.uid) {
        await completeContent(
          user.uid,
          course.id,
          module.id,
          currentContent.id,
          totalContents
        );
      }
    } else {
      toast.error('Incorrect answer. Please try again.');
      setShowQuizExplanation(true);
    }
  };
  
  const handleNextQuizQuestion = () => {
    if (!currentContent.quiz) return;
    
    if (currentQuizIndex < currentContent.quiz.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setQuizAnswer(null);
      setShowQuizExplanation(false);
    } else {
      // All questions completed
      toast.success('Quiz completed!');
    }
  };
  
  const handlePrevQuizQuestion = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
      setQuizAnswer(null);
      setShowQuizExplanation(false);
    }
  };

  const handleModuleComplete = async () => {
    setLoading(true);
    
    try {
      // Get next module id
      const currentModuleIndex = allModules.findIndex(m => m.id === module.id);
      const nextModule = currentModuleIndex < allModules.length - 1 
        ? allModules[currentModuleIndex + 1] 
        : null;
      
      // If module has no content or just placeholder content, make sure to mark content as completed
      if (!module.content || module.content.length === 0) {
        if (user?.uid && currentContent) {
          await completeContent(
            user.uid,
            course.id,
            module.id,
            currentContent.id,
            1 // Only one content item (the placeholder)
          );
        }
      }
      
      if (user?.uid) {
        const success = await completeModule(
          user.uid,
          course.id,
          module.id,
          nextModule?.id || null,
          allModules.length
        );
        
        if (success) {
          // If this was the last module, the course is now completed
          if (currentModuleIndex === allModules.length - 1) {
            toast.success('Congratulations! Course completed! You have earned a certificate.');
          } else {
            toast.success('Module completed! Moving to the next module.');
          }
        }
      }
      
      onComplete();
    } catch (error) {
      console.error('Error completing module:', error);
      toast.error('Failed to complete module. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim() || !user?.uid || !currentContent) return;
    
    try {
      const timeInVideo = currentContent.type === 'video' && videoRef.current
        ? videoRef.current.currentTime
        : undefined;
      
      await addNote(
        user.uid,
        course.id,
        module.id,
        currentContent.id,
        note,
        timeInVideo
      );
      
      toast.success('Note added successfully');
      setNote('');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  };

  const handleAddBookmark = async () => {
    if (!user?.uid || !currentContent) return;
    
    try {
      const timeInVideo = currentContent.type === 'video' && videoRef.current
        ? videoRef.current.currentTime
        : undefined;
      
      await addBookmark(
        user.uid,
        course.id,
        module.id,
        currentContent.id,
        currentContent.title,
        timeInVideo
      );
      
      toast.success('Bookmark added successfully');
    } catch (error) {
      console.error('Error adding bookmark:', error);
      toast.error('Failed to add bookmark');
    }
  };

  const handleAssignmentSubmit = async () => {
    if (!user?.uid || !currentContent || (!assignmentText && !selectedFile)) return;
    
    setIsSubmitting(true);
    
    try {
      // Submit assignment functionality would go here
      
      toast.success('Assignment submitted successfully');
      
      // Mark content as completed
      await completeContent(
        user.uid,
        course.id,
        module.id,
        currentContent.id,
        totalContents
      );
      
      setAssignmentText('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Render content based on type
  const renderContent = () => {
    if (!currentContent) return null;
    
    switch (currentContent.type) {
      case 'video':
        return (
          <div className="px-4 py-8 flex justify-center">
            <div className="max-w-3xl w-full">
              <div className="relative">
              <video
                ref={videoRef}
                src={currentContent.videoUrl}
                  className="w-full rounded-md"
                  controlsList="nodownload"
              />
              
                {/* Custom video controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs">{formatTime(currentTime)}</span>
                      <div className="flex-1">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                          className="w-full"
                  />
                      </div>
                      <span className="text-white text-xs">{formatTime(duration)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-white">
                          <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white" onClick={handlePlayPause}>
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                        <Button variant="ghost" size="icon" className="text-white">
                          <SkipForward className="h-4 w-4" />
                    </Button>
                    
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="text-white" onClick={handleMuteToggle}>
                            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          </Button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                            step={0.1}
                      value={volume}
                      onChange={handleVolumeChange}
                            className="w-16"
                    />
                        </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                        <div className="relative">
                          <Button variant="ghost" size="icon" className="text-white">
                            <Settings className="h-4 w-4" />
                      </Button>
                          {/* Playback rate dropdown would go here */}
                        </div>
                        <Button variant="ghost" size="icon" className="text-white" onClick={handleFullscreenToggle}>
                          <Maximize className="h-4 w-4" />
                          </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              </div>
        );
      
      case 'text':
        return (
          <div className="px-4 py-8 flex justify-center">
            <div className="prose prose-green max-w-prose">
              <MarkdownContent 
                content={currentContent.content}
              />
            </div>
          </div>
        );
      
      case 'quiz':
        if (!currentContent.quiz || currentContent.quiz.length === 0) {
          return <div className="text-center p-8">No quiz questions available</div>;
        }
        
        const currentQuestion = currentContent.quiz[currentQuizIndex];
        
        return (
          <div className="px-4 py-8 flex justify-center">
            <div className="max-w-prose w-full" key={currentQuizIndex}>
              <div className="mb-6 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Question {currentQuizIndex + 1} of {currentContent.quiz.length}
                </div>
                <Progress 
                  value={((currentQuizIndex + 1) / currentContent.quiz.length) * 100} 
                  className="w-48" 
                />
              </div>
              
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6 text-gray-900">{currentQuestion.question}</h3>
                
              <RadioGroup
                value={quizAnswer?.toString()}
                onValueChange={(value) => setQuizAnswer(parseInt(value))}
                  className="mb-6"
              >
                  <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => (
                    <div 
                      key={index} 
                        className={`flex items-start p-3 rounded-md border ${
                          showQuizExplanation && index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-50'
                            : showQuizExplanation && quizAnswer === index && quizAnswer !== currentQuestion.correctAnswer
                          ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem 
                        value={index.toString()} 
                        id={`option-${index}`} 
                        disabled={showQuizExplanation}
                      />
                        <Label htmlFor={`option-${index}`} className="ml-2 flex-1 cursor-pointer">
                        {option}
                      </Label>
                        {showQuizExplanation && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                  </div>
                ))}
                  </div>
              </RadioGroup>
                
                {showQuizExplanation && currentQuestion.explanation && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="font-medium text-blue-800 mb-2">Explanation</h4>
                    <p className="text-blue-700">{currentQuestion.explanation}</p>
                  </div>
                )}
                
                <div className="mt-6 flex justify-between">
              <Button
                    variant="outline"
                    onClick={handlePrevQuizQuestion}
                    disabled={currentQuizIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  {!showQuizExplanation ? (
                    <Button 
                onClick={handleQuizSubmit}
                disabled={quizAnswer === null}
              >
                Submit Answer
              </Button>
                  ) : (
                  <Button
                      onClick={currentQuizIndex < currentContent.quiz.length - 1 ? handleNextQuizQuestion : handleNextContent}
                  >
                      {currentQuizIndex < currentContent.quiz.length - 1 ? (
                        <>
                          Next Question
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        'Complete Quiz'
                      )}
                  </Button>
                )}
              </div>
            </div>
            </div>
          </div>
        );
      
      case 'assignment':
        return (
          <div className="px-4 py-8 flex justify-center">
            <div className="max-w-prose w-full">
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Assignment</h3>
                
                {currentContent.assignment?.dueDate && (
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Due: {currentContent.assignment.dueDate}</span>
                  </div>
                )}
                
                <div className="prose prose-green max-w-none mb-6">
                  <MarkdownContent 
                    content={currentContent.assignment?.description || ''}
                  />
                </div>
                
                {currentContent.assignment?.submission === 'text' && (
                <div className="space-y-4">
                      <Textarea
                      placeholder="Type your answer here..." 
                        value={assignmentText}
                        onChange={(e) => setAssignmentText(e.target.value)}
                      className="min-h-[200px]"
                      />
                    </div>
                  )}
                  
                {currentContent.assignment?.submission === 'file' && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                          type="file"
                        id="file-upload"
                        className="hidden"
                          onChange={handleFileChange}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <FileText className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm font-medium mb-1">
                            {selectedFile ? selectedFile.name : 'Click to upload a file'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOC, DOCX, up to 10MB'}
                          </p>
                        </div>
                      </label>
                      </div>
                    </div>
                  )}
                  
                {currentContent.assignment?.submission === 'link' && (
                  <div className="space-y-4">
                      <Input
                      placeholder="Paste your link here (e.g., https://example.com)" 
                        value={assignmentText}
                        onChange={(e) => setAssignmentText(e.target.value)}
                      />
                    </div>
                  )}
                  
                  <Button
                    onClick={handleAssignmentSubmit}
                  className="w-full mt-4" 
                    disabled={isSubmitting || (!assignmentText && !selectedFile)}
                  >
                    {isSubmitting ? (
                      <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Submitting...
                      </>
                    ) : (
                    'Submit Assignment'
                    )}
                  </Button>
                </div>
              </div>
            </div>
        );
      
      default:
        return <div>Unknown content type</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="font-semibold">{course.title}</h2>
            <p className="text-sm text-gray-500">{module.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Notes
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowResources(!showResources)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Resources
            </Button>
          </div>
          <Progress 
            value={(contentIndex + 1) / module.content.length * 100} 
            className="w-48 hidden md:block" 
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-auto" ref={containerRef}>
          <div className="min-h-full flex flex-col">
            {renderContent()}
          </div>
          
          {/* Resources section, only visible when resources are available */}
          {currentContent.resources && currentContent.resources.length > 0 && (
            <div className="p-6 border-t">
              <h3 className="text-lg font-medium mb-4">Resources</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {currentContent.resources.map((resource) => (
                  <div 
                    key={resource.id}
                    className="border rounded-md p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          {resource.type === 'pdf' ? 'PDF' : 
                           resource.type === 'link' ? 'Link' : 
                           resource.type === 'code' ? 'Code' : 'File'}
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar panels */}
        {(showNotes || showResources) && (
          <div className="border-t md:border-t-0 md:border-l w-full md:w-80 flex-shrink-0 overflow-auto">
            <Tabs defaultValue="notes" className="h-full flex flex-col">
              <TabsList className="mx-4 my-2 grid grid-cols-2">
                <TabsTrigger 
                  value="notes"
                  onClick={() => {
                    setShowNotes(true);
                    setShowResources(false);
                  }}
                >
                  Notes
                </TabsTrigger>
                <TabsTrigger 
                  value="resources"
                  onClick={() => {
                    setShowNotes(false);
                    setShowResources(true);
                  }}
                >
                  Resources
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="notes" className="flex-1 p-4 overflow-auto">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Add notes about this section..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button 
                    onClick={handleAddNote}
                    disabled={!note.trim()}
                    className="w-full"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Save Note
                  </Button>
                  
                  <div className="h-px bg-gray-200 my-6"></div>
                  
                  <div className="text-sm text-gray-500">
                    Your notes will appear here. Notes are tied to specific content and you can review them later.
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="resources" className="flex-1 p-4 overflow-auto">
                {currentContent.resources && currentContent.resources.length > 0 ? (
                  <div className="space-y-4">
                    {currentContent.resources.map((resource) => (
                      <div 
                        key={resource.id}
                        className="border rounded-md p-4"
                      >
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="mt-4"
                          asChild
                        >
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Download {resource.type.toUpperCase()}
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No resources available for this section
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="border-t p-4 flex items-center justify-between bg-white">
          <Button
            variant="outline"
            onClick={handlePrevContent}
            disabled={contentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {contentIndex + 1} of {module.content.length}
            </span>
          </div>

          {contentIndex === module.content.length - 1 ? (
          <Button 
            onClick={handleModuleComplete}
            disabled={loading}
          >
            {loading ? (
              <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
              Complete Module
            </Button>
          ) : (
            <Button onClick={handleNextContent}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
      </div>
    </div>
  );
} 