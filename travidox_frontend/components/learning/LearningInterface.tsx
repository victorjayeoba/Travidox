import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

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

interface Module {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  content: LearningContent[];
}

interface LearningInterfaceProps {
  module: Module;
  onClose: () => void;
  onComplete: () => void;
}

export function LearningInterface({ module, onClose, onComplete }: LearningInterfaceProps) {
  const [currentContent, setCurrentContent] = useState<LearningContent | null>(null);
  const [contentIndex, setContentIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  // Initialize content when module changes
  useEffect(() => {
    if (module?.content?.length > 0) {
      setCurrentContent(module.content[0]);
      setContentIndex(0);
    }
  }, [module]);

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

  const handleNextContent = () => {
    if (contentIndex < module.content.length - 1) {
      setContentIndex(prev => prev + 1);
      setCurrentContent(module.content[contentIndex + 1]);
    }
  };

  const handlePrevContent = () => {
    if (contentIndex > 0) {
      setContentIndex(prev => prev - 1);
      setCurrentContent(module.content[contentIndex - 1]);
    }
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === currentContent.quiz?.[0].correctAnswer) {
      handleNextContent();
    } else {
      alert("Incorrect answer. Please try again.");
    }
    setQuizAnswer(null);
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="font-semibold">{module.title}</h2>
              <p className="text-sm text-gray-500">{currentContent.title}</p>
            </div>
          </div>
          <Progress value={(contentIndex + 1) / module.content.length * 100} className="w-48" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {currentContent.type === 'video' && (
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <video
                src={currentContent.videoUrl}
                controls
                className="w-full h-full"
              />
            </div>
          )}

          {currentContent.type === 'text' && (
            <div className="prose max-w-none">
              <h3>{currentContent.title}</h3>
              <p>{currentContent.content}</p>
            </div>
          )}

          {currentContent.type === 'quiz' && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">{currentContent.quiz?.[0].question}</h3>
              <RadioGroup
                value={quizAnswer?.toString()}
                onValueChange={(value) => setQuizAnswer(parseInt(value))}
                className="space-y-4"
              >
                {currentContent.quiz?.[0].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              <Button
                className="mt-6"
                onClick={handleQuizSubmit}
                disabled={quizAnswer === null}
              >
                Submit Answer
              </Button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="border-t p-4 flex items-center justify-between">
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
            <Button onClick={onComplete}>
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
    </div>
  );
} 