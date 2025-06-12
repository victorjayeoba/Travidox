"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Lock, PlayCircle, Star, Trophy, XCircle, HelpCircle, ArrowRight, Calendar, Clock, Sparkles, Medal, Flame, Zap } from 'lucide-react'
import { QuizCelebration } from '@/components/dashboard/quiz-celebration'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useAuth } from '@/components/auth/auth-provider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getAllQuizzes, getCurrentWeekQuizzes, getQuizById, Quiz, getCurrentWeekNumber } from '@/lib/quiz-data'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'

export default function LearnPage() {
  const { user } = useAuth();
  const { profile, addXpAndUpdateBalance } = useUserProfile();
  const router = useRouter();
  
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('weekly');
  const [isRetake, setIsRetake] = useState(false);
  
  // Get all quizzes
  const allQuizzes = getAllQuizzes();
  const weeklyQuizzes = getCurrentWeekQuizzes();
  const standardQuizzes = allQuizzes.filter(quiz => !quiz.isWeekly);
  
  const completedQuizzes = profile?.completedQuizzes || [];
  
  const activeQuiz = getQuizById(selectedQuiz || '');
  const currentQuestion = activeQuiz?.questions[currentQuestionIndex];
  
  // Get current week number for display
  const getCurrentWeek = () => {
    return getCurrentWeekNumber();
  };
  
  const handleStartQuiz = (quizId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Check if this is a retake
    const isQuizRetake = completedQuizzes.includes(quizId);
    setIsRetake(isQuizRetake);
    
    setSelectedQuiz(quizId);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setXpEarned(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };
  
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };
  
  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !activeQuiz || !currentQuestion) return;
    
    setIsAnswered(true);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      // Calculate XP for this question (total quiz XP divided by number of questions)
      const questionXp = Math.round(activeQuiz.xpReward / activeQuiz.questions.length);
      setXpEarned(xpEarned + questionXp);
      
      // Trigger confetti for correct answer
      triggerConfetti();
    }
  };
  
  const handleNextQuestion = () => {
    if (!activeQuiz) return;
    
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };
  
  const [showCelebration, setShowCelebration] = useState(false);
  
  const handleFinishQuiz = async () => {
    if (!user || !activeQuiz) return;
    
    setIsSubmitting(true);
    
    try {
      // Find the quiz in our data
      const quizData = allQuizzes.find(q => q.id === activeQuiz.id);
      if (!quizData) {
        throw new Error('Quiz data not found');
      }
      
      // Check if the user has already completed this quiz
      const isRetake = completedQuizzes.includes(activeQuiz.id);
      
      // Update user profile with XP and mark quiz as completed
      // Only award XP if this is the first time completing the quiz
      await addXpAndUpdateBalance(
        isRetake ? 0 : xpEarned, // Award 0 XP for retakes
        activeQuiz.id,
        score, // Pass the user's score
        activeQuiz.questions.length, // Pass the total number of questions
        isRetake // Pass whether this is a retake
      );
      
      // Show celebration modal
      setShowCelebration(true);
    } catch (error) {
      console.error('Error completing quiz:', error);
      setIsSubmitting(false);
      setSelectedQuiz(null);
    }
  };
  
  const handleCloseCelebration = () => {
    setShowCelebration(false);
    setIsSubmitting(false);
    setSelectedQuiz(null);
  };
  
  // Calculate completion stats
  const totalQuizzes = allQuizzes.length;
  const completedCount = completedQuizzes.length;
  const completionPercentage = totalQuizzes > 0 ? (completedCount / totalQuizzes) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Quiz Celebration Modal */}
      {showCelebration && activeQuiz && (
        <QuizCelebration
          score={score}
          totalQuestions={activeQuiz.questions.length}
          xpEarned={xpEarned}
          isRetake={isRetake}
          onClose={handleCloseCelebration}
        />
      )}
      
      {!selectedQuiz ? (
        <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Learning Center</h1>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1.5 bg-green-50 text-green-800 max-w-[100px]">
            <Star className="h-3.5 w-3.5 flex-shrink-0 fill-green-500 text-green-500" />
            <span className="truncate">{(profile?.xp || 0).toFixed(0)} XP</span>
          </Badge>
        </div>
      </div>
      
      {/* Progress Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Your Learning Progress</CardTitle>
              <CardDescription>Test your knowledge with quizzes and earn XP</CardDescription>
          </CardHeader>
          <CardContent>
          <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 mb-1">Total XP Earned</div>
                    <div className="text-2xl font-bold">{(profile?.xp || 0).toFixed(0)} XP</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-600 mb-1">Balance Earned</div>
                <div className="text-2xl font-bold">₦{(profile?.balance || 0).toFixed(2)}</div>
              </div>
            </div>
            </div>
          </CardContent>
        </Card>
        
          {/* Quiz Tabs */}
          <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Weekly Quizzes</span>
              </TabsTrigger>
              <TabsTrigger value="standard" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>Standard Quizzes</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="weekly" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Week {getCurrentWeek()} Quizzes
                </h2>
                <Badge variant="outline" className="bg-blue-50 text-blue-600">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  Updates Weekly
                </Badge>
              </div>
              
              {weeklyQuizzes.length > 0 ? (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {weeklyQuizzes.map((quiz) => {
                    const isCompleted = completedQuizzes.includes(quiz.id);
          
          return (
                      <Card key={quiz.id} className={`${isCompleted ? 'border-green-200 bg-green-50' : 'border-blue-200'} flex flex-col h-full`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  {isCompleted ? (
                    <Badge className="bg-green-100 text-green-800">
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 whitespace-nowrap max-w-[90px]">
                                <Star className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                                <span className="truncate">{quiz.xpReward} XP</span>
                              </Badge>
                  )}
                </div>
                          <CardDescription className="min-h-[40px]">{quiz.description}</CardDescription>
                </CardHeader>
                        <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                                <HelpCircle className="h-4 w-4 mr-1" />
                                {quiz.questions.length} Questions
                              </div>
                              <div className="text-gray-500">Level: {quiz.difficulty}</div>
                            </div>
                    </div>
                        </CardContent>
                        <CardFooter className="pt-0 mt-auto h-[60px]">
                          <Button 
                            className="w-full"
                            variant={isCompleted ? "outline" : "default"}
                            onClick={() => handleStartQuiz(quiz.id)}
                          >
                            {isCompleted ? 'Retake Quiz' : 'Start Quiz'}
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
            </div>
              ) : (
                <Card className="border-dashed border-2 border-gray-200">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">No Weekly Quizzes Available</h3>
                    <p className="text-gray-500 text-center mt-2">
                      Check back soon for new weekly quizzes to earn XP and improve your trading knowledge!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="standard" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Standard Quizzes</h2>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {standardQuizzes.map((quiz) => {
                  const isCompleted = completedQuizzes.includes(quiz.id);
                  
                  return (
                    <Card key={quiz.id} className={`${isCompleted ? 'border-green-200 bg-green-50' : ''} flex flex-col h-full`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    {isCompleted ? (
                            <Badge className="bg-green-100 text-green-800">
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 whitespace-nowrap max-w-[90px]">
                              <Star className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                              <span className="truncate">{quiz.xpReward} XP</span>
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="min-h-[40px]">{quiz.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center text-gray-500">
                              <HelpCircle className="h-4 w-4 mr-1" />
                              {quiz.questions.length} Questions
                            </div>
                            <div className="text-gray-500">Level: {quiz.difficulty}</div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 mt-auto h-[60px]">
                      <Button 
                        className="w-full"
                          variant={isCompleted ? "outline" : "default"}
                          onClick={() => handleStartQuiz(quiz.id)}
                        >
                          {isCompleted ? 'Retake Quiz' : 'Start Quiz'}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : quizCompleted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-2xl mx-auto overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2">
                {score >= activeQuiz!.questions.length * 0.8 ? (
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <Trophy className="h-10 w-10 text-white" />
                  </div>
                ) : score >= activeQuiz!.questions.length * 0.5 ? (
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Medal className="h-10 w-10 text-white" />
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <Check className="h-10 w-10 text-white" />
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
              <CardDescription className="text-lg">
                You've completed the {activeQuiz?.title} quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-3xl font-bold mb-3">Your Score: {score}/{activeQuiz?.questions.length}</h3>
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mb-6">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(score / (activeQuiz?.questions.length || 1)) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                  <Zap className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-lg font-medium text-green-800">
                      +{xpEarned} XP Earned!
                    </p>
                    <p className="text-sm text-green-600">Added to your profile</p>
                  </div>
                </div>
                
                {score === activeQuiz?.questions.length && (
                  <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <p className="text-yellow-800 font-medium">Perfect Score! You're a trading genius!</p>
                  </div>
                )}
                
                {score >= activeQuiz!.questions.length * 0.8 && score < activeQuiz!.questions.length && (
                  <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center gap-3">
                    <Flame className="h-6 w-6 text-blue-500" />
                    <p className="text-blue-800 font-medium">Excellent work! You're on fire!</p>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="text-center">
                <p className="mb-6 text-gray-600">
                  Great job! Keep learning and testing your knowledge to earn more XP and climb the leaderboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={handleFinishQuiz} 
                    size="lg"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isSubmitting ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Saving Progress...
                          </>
                        ) : (
                      <>
                        <Star className="mr-2 h-4 w-4" />
                        Claim XP & Continue
                      </>
                        )}
                      </Button>
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/dashboard/leaderboard')}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    View Leaderboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{activeQuiz?.title}</CardTitle>
                <CardDescription>Question {currentQuestionIndex + 1} of {activeQuiz?.questions.length}</CardDescription>
              </div>
              <Badge variant="outline" className="flex items-center gap-1.5 bg-blue-50 text-blue-700 max-w-[100px]">
                <Star className="h-3.5 w-3.5 flex-shrink-0 fill-blue-500 text-blue-500" />
                <span className="truncate">+{xpEarned} XP</span>
              </Badge>
            </div>
            <Progress 
              value={((currentQuestionIndex + 1) / (activeQuiz?.questions.length || 1)) * 100} 
              className="h-2 mt-4" 
            />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg font-medium">{currentQuestion?.question}</div>
            
            <RadioGroup value={selectedAnswer?.toString()} disabled={isAnswered}>
              {currentQuestion?.options.map((option, index) => (
                <div 
                  key={index} 
                  className={`flex items-center space-x-2 p-3 rounded-md border ${
                    isAnswered && index === currentQuestion.correctAnswer 
                      ? 'bg-green-50 border-green-200' 
                      : isAnswered && index === selectedAnswer && index !== currentQuestion.correctAnswer
                        ? 'bg-red-50 border-red-200'
                        : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <RadioGroupItem 
                    value={index.toString()} 
                    id={`option-${index}`} 
                    onClick={() => !isAnswered && setSelectedAnswer(index)}
                  />
                  <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                    {option}
                  </Label>
                  {isAnswered && index === currentQuestion.correctAnswer && (
                    <Check className="h-5 w-5 text-green-600" />
                  )}
                  {isAnswered && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              ))}
            </RadioGroup>
            
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Alert className={selectedAnswer === currentQuestion?.correctAnswer 
                  ? "bg-green-50 border-green-200" 
                  : "bg-amber-50 border-amber-200"
                }>
                  <div className="flex items-center gap-2">
                    {selectedAnswer === currentQuestion?.correctAnswer ? (
                      <>
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <AlertTitle className="flex items-center gap-2">
                            Correct! <Zap className="h-4 w-4 text-yellow-500" /> +{Math.round(activeQuiz!.xpReward / activeQuiz!.questions.length)} XP
                          </AlertTitle>
                          <AlertDescription>
                            {currentQuestion?.explanation}
                          </AlertDescription>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <XCircle className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <AlertTitle>Not quite right</AlertTitle>
                          <AlertDescription>
                            {currentQuestion?.explanation}
                          </AlertDescription>
                        </div>
                      </>
                    )}
                  </div>
                </Alert>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setSelectedQuiz(null)}
            >
              Exit Quiz
            </Button>
            
            {!isAnswered ? (
              <Button onClick={handleAnswerSubmit} disabled={selectedAnswer === null}>
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {currentQuestionIndex < (activeQuiz?.questions.length || 0) - 1 ? (
                  <>Next Question <ArrowRight className="ml-2 h-4 w-4" /></>
                ) : (
                  'Finish Quiz'
                )}
              </Button>
            )}
          </CardFooter>
            </Card>
      )}
    </div>
  );
} 