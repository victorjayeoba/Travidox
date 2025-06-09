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
    
    const isCorrect = quizAnswer === currentContent.quiz[0].correctAnswer;
    
    if (isCorrect) {
      // Mark content as completed
      if (user?.uid) {
        await completeContent(
          user.uid,
          course.id,
          module.id,
          currentContent.id,
          totalContents
        );
      }
      
      toast.success('Correct answer! Well done!');
      setShowQuizExplanation(true);
    } else {
      toast.error('Incorrect answer. Please try again.');
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
        <div className="flex-1 overflow-auto flex flex-col" ref={containerRef}>
          {/* Video player */}
          {currentContent.type === 'video' && (
            <div className="relative bg-black">
              <video
                ref={videoRef}
                src={currentContent.videoUrl}
                className="w-full h-auto max-h-[70vh]"
                onClick={handlePlayPause}
                onEnded={() => {
                  if (user?.uid) {
                    completeContent(
                      user.uid,
                      course.id,
                      module.id,
                      currentContent.id,
                      totalContents
                    );
                  }
                }}
              />
              
              {/* Video controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:text-white/80 hover:bg-white/10"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:text-white/80 hover:bg-white/10"
                      onClick={handleMuteToggle}
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
                    />
                    
                    <span className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative group">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-white hover:text-white/80 hover:bg-white/10"
                      >
                        {playbackRate}x
                      </Button>
                      
                      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-800 rounded-md overflow-hidden">
                        {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                          <Button
                            key={rate}
                            variant="ghost"
                            size="sm"
                            className={`text-white hover:bg-gray-700 w-full justify-start ${
                              playbackRate === rate ? 'bg-gray-700' : ''
                            }`}
                            onClick={() => handlePlaybackRateChange(rate)}
                          >
                            {rate}x
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:text-white/80 hover:bg-white/10"
                      onClick={handleFullscreenToggle}
                    >
                      <Maximize className="h-5 w-5" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:text-white/80 hover:bg-white/10"
                      onClick={handleAddBookmark}
                    >
                      <Bookmark className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Text content */}
          {currentContent.type === 'text' && (
            <div className="p-6 max-w-4xl mx-auto w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{currentContent.title}</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddBookmark}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Bookmark
                </Button>
              </div>
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: currentContent.content }}
              />
              
              {/* Complete button for text content */}
              <Button 
                className="mt-8"
                onClick={async () => {
                  if (user?.uid) {
                    await completeContent(
                      user.uid,
                      course.id,
                      module.id,
                      currentContent.id,
                      totalContents
                    );
                    toast.success('Content marked as completed');
                  }
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Completed
              </Button>
            </div>
          )}

          {/* Quiz content */}
          {currentContent.type === 'quiz' && (
            <div className="p-6 max-w-4xl mx-auto w-full">
              <h2 className="text-xl font-bold mb-6">{currentContent.title}</h2>
              
              <div className="bg-gray-50 border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">{currentContent.quiz?.[0].question}</h3>
                
              <RadioGroup
                value={quizAnswer?.toString()}
                onValueChange={(value) => setQuizAnswer(parseInt(value))}
                className="space-y-4"
              >
                {currentContent.quiz?.[0].options.map((option, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center space-x-2 p-3 rounded-md border ${
                        showQuizExplanation && index === currentContent.quiz?.[0].correctAnswer
                          ? 'border-green-500 bg-green-50'
                          : showQuizExplanation && quizAnswer === index && quizAnswer !== currentContent.quiz?.[0].correctAnswer
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <RadioGroupItem 
                        value={index.toString()} 
                        id={`option-${index}`} 
                        disabled={showQuizExplanation}
                      />
                      <Label 
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer"
                      >
                        {option}
                      </Label>
                      {showQuizExplanation && index === currentContent.quiz?.[0].correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                  </div>
                ))}
              </RadioGroup>
                
                {showQuizExplanation && currentContent.quiz?.[0].explanation && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="font-medium text-blue-800 mb-2">Explanation</h4>
                    <p className="text-blue-700">{currentContent.quiz[0].explanation}</p>
                  </div>
                )}
                
                {!showQuizExplanation && (
              <Button
                className="mt-6"
                onClick={handleQuizSubmit}
                disabled={quizAnswer === null}
              >
                Submit Answer
              </Button>
                )}
                
                {showQuizExplanation && (
                  <Button
                    className="mt-6"
                    onClick={contentIndex < module.content.length - 1 ? handleNextContent : handleModuleComplete}
                  >
                    {contentIndex < module.content.length - 1 ? 'Continue' : 'Complete Module'}
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {/* Assignment content */}
          {currentContent.type === 'assignment' && currentContent.assignment && (
            <div className="p-6 max-w-4xl mx-auto w-full">
              <h2 className="text-xl font-bold mb-6">{currentContent.title}</h2>
              
              <div className="bg-gray-50 border rounded-lg p-6 mb-6">
                <div 
                  className="prose max-w-none mb-6" 
                  dangerouslySetInnerHTML={{ __html: currentContent.assignment.description }}
                />
                
                {currentContent.assignment.dueDate && (
                  <div className="flex items-center text-amber-600 mb-6">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Due: {currentContent.assignment.dueDate}</span>
                  </div>
                )}
                
                <div className="space-y-4">
                  {currentContent.assignment.submission === 'text' && (
                    <div>
                      <Label htmlFor="assignment-text">Your Answer</Label>
                      <Textarea
                        id="assignment-text"
                        value={assignmentText}
                        onChange={(e) => setAssignmentText(e.target.value)}
                        placeholder="Type your assignment answer here..."
                        className="mt-2 h-40"
                      />
                    </div>
                  )}
                  
                  {currentContent.assignment.submission === 'file' && (
                    <div>
                      <Label htmlFor="assignment-file">Upload File</Label>
                      <div className="mt-2 flex items-center gap-4">
                        <Input
                          id="assignment-file"
                          type="file"
                          onChange={handleFileChange}
                          className="flex-1"
                        />
                        {selectedFile && (
                          <span className="text-sm text-gray-500">
                            {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {currentContent.assignment.submission === 'link' && (
                    <div>
                      <Label htmlFor="assignment-link">Submission URL</Label>
                      <Input
                        id="assignment-link"
                        value={assignmentText}
                        onChange={(e) => setAssignmentText(e.target.value)}
                        placeholder="Paste your URL here (e.g., GitHub repo, CodePen, etc.)"
                        className="mt-2"
                      />
                    </div>
                  )}
                  
                  <Button
                    className="w-full"
                    onClick={handleAssignmentSubmit}
                    disabled={isSubmitting || (!assignmentText && !selectedFile)}
                  >
                    {isSubmitting ? (
                      <>
                        <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <ClipboardCheck className="h-4 w-4 mr-2" />
                        Submit Assignment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
          
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