"use client"

import { useState } from 'react'
import { 
  Trophy, Users, User, Timer, Star, 
  Medal, BookOpen, TrendingUp, ChevronRight,
  DollarSign, BarChart2, Clock, Award, 
  Sparkles, Zap, Lightbulb, CheckCircle, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

// Mock leaderboard data
const leaderboardData = [
  { id: 1, name: "Alex Johnson", xp: 8750, level: 24 },
  { id: 2, name: "Maria Garcia", xp: 7320, level: 20 },
  { id: 3, name: "Sam Wilson", xp: 6540, level: 18 },
  { id: 4, name: "Taylor Chen", xp: 5890, level: 16 },
  { id: 5, name: "Jordan Smith", xp: 5150, level: 14 },
  { id: 6, name: "Robin Lee", xp: 4700, level: 13 },
  { id: 7, name: "Casey Brown", xp: 4200, level: 11 },
  { id: 8, name: "Morgan Taylor", xp: 3800, level: 10 },
  { id: 9, name: "Jamie Rivera", xp: 3400, level: 9 },
  { id: 10, name: "Quinn Adams", xp: 3100, level: 8 }
];

// Sample question data
const sampleQuestions = [
  {
    id: 1,
    question: "What is the main difference between saving and investing?",
    options: [
      { id: "a", text: "Saving is for short-term goals, investing is for long-term growth" },
      { id: "b", text: "Saving always earns more interest than investing" },
      { id: "c", text: "Investing is always risk-free compared to saving" },
      { id: "d", text: "Saving requires more money to start than investing" }
    ],
    correctAnswer: "a",
    explanation: "Saving typically means putting money aside in a secure account for short-term goals or emergencies, while investing means buying assets that can potentially grow in value over time but come with risks.",
    difficulty: "beginner",
    category: "basics",
    xpReward: 25
  }
];

export default function LearnPage() {
  const [selectedGameMode, setSelectedGameMode] = useState('single-player');
  const [currentQuestion, setCurrentQuestion] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  
  // Function to handle starting a game
  const startGame = (categoryId: string) => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
  };
  
  // Function to handle selecting an answer
  const selectAnswer = (answerId: string) => {
    if (!answerSubmitted) {
      setSelectedAnswer(answerId);
    }
  };
  
  // Function to handle submitting an answer
  const submitAnswer = () => {
    if (selectedAnswer && currentQuestion !== null) {
      setAnswerSubmitted(true);
    }
  };
  
  // Function to go to the next question
  const nextQuestion = () => {
    if (currentQuestion !== null && sampleQuestions.length > currentQuestion + 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswerSubmitted(false);
    } else {
      setCurrentQuestion(null);
    }
  };
  
  // Calculate if the selected answer is correct
  const isCorrect = currentQuestion !== null && selectedAnswer === sampleQuestions[currentQuestion].correctAnswer;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Learn & Earn</h1>
        <p className="text-gray-500 mt-1">Master financial concepts through fun, interactive games</p>
      </div>
      
      {/* User Progress and Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* User progress card */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <Zap className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                <div className="text-xl font-bold text-blue-700">3450</div>
                <div className="text-xs text-gray-500">Total XP</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <CheckCircle className="h-5 w-5 mx-auto text-green-500 mb-1" />
                <div className="text-xl font-bold text-green-700">81%</div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <Award className="h-5 w-5 mx-auto text-purple-500 mb-1" />
                <div className="text-xl font-bold text-purple-700">12</div>
                <div className="text-xs text-gray-500">Badges</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg text-center">
                <Clock className="h-5 w-5 mx-auto text-amber-500 mb-1" />
                <div className="text-xl font-bold text-amber-700">7</div>
                <div className="text-xs text-gray-500">Day Streak</div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-blue-50 border-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                    <h4 className="font-semibold">Financial Basics</h4>
                  </div>
                  <Progress value={65} className="h-1.5 mb-2" />
                  <div className="text-xs text-gray-600">6/10 levels completed</div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    <h4 className="font-semibold">Investing</h4>
                  </div>
                  <Progress value={40} className="h-1.5 mb-2" />
                  <div className="text-xs text-gray-600">4/12 levels completed</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        {/* Leaderboard card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Leaderboard
            </CardTitle>
            <CardDescription>Top performers this week</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px]">
              {leaderboardData.map((user, index) => (
                <div
                  key={user.id}
                  className={cn(
                    "flex items-center justify-between p-3 border-b border-gray-100",
                    index < 3 ? "bg-yellow-50/50" : ""
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      index === 0 ? "bg-yellow-400 text-white" : 
                      index === 1 ? "bg-gray-300 text-gray-700" :
                      index === 2 ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600"
                    )}>
                      {index + 1}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-gray-500">Level {user.level}</div>
                    </div>
                  </div>
                  <div className="font-semibold text-sm">
                    {user.xp} XP
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      
      {/* Game Modes */}
      {currentQuestion === null ? (
        <div className="space-y-6">
          <Tabs defaultValue="single-player" onValueChange={setSelectedGameMode}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="single-player">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>Single Player</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="multiplayer">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Multiplayer</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="tournament" disabled>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  <span>Tournament</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="single-player">
              <Card>
                <CardHeader>
                  <CardTitle>Choose a learning topic</CardTitle>
                  <CardDescription>Select a financial topic to test your knowledge</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="bg-blue-50 hover:shadow-md cursor-pointer transition-all" onClick={() => startGame('basics')}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-blue-500" />
                            <div>
                              <h4 className="font-semibold">Financial Basics</h4>
                              <p className="text-xs text-gray-600">Fundamentals of personal finance</p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-purple-50 hover:shadow-md cursor-pointer transition-all" onClick={() => startGame('investing')}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-purple-500" />
                            <div>
                              <h4 className="font-semibold">Investing</h4>
                              <p className="text-xs text-gray-600">Learn how to grow your money</p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-amber-50 hover:shadow-md cursor-pointer transition-all" onClick={() => startGame('trading')}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <BarChart2 className="h-5 w-5 text-amber-500" />
                            <div>
                              <h4 className="font-semibold">Trading</h4>
                              <p className="text-xs text-gray-600">Stock and forex trading techniques</p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-green-50 hover:shadow-md cursor-pointer transition-all" onClick={() => startGame('analysis')}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-green-500" />
                            <div>
                              <h4 className="font-semibold">Market Analysis</h4>
                              <p className="text-xs text-gray-600">Technical and fundamental analysis</p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="multiplayer">
              <Card>
                <CardHeader>
                  <CardTitle>Challenge other traders</CardTitle>
                  <CardDescription>Compete in real-time against other players</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Looking for opponents...</p>
                    <Button>Create a Challenge</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tournament">
              <Card>
                <CardHeader>
                  <CardTitle>Tournament Mode</CardTitle>
                  <CardDescription>Reach level 25 to unlock tournament mode</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Unlock tournaments by reaching level 25</p>
                    <Progress value={60} className="mb-4 max-w-md mx-auto" />
                    <p className="text-sm text-gray-500">15 more levels to go</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        // Question/Game Screen
        <Card className="border-2 border-blue-100">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500">Question {currentQuestion + 1}/{sampleQuestions.length}</div>
                <CardTitle>{sampleQuestions[currentQuestion].question}</CardTitle>
              </div>
              <Badge className="bg-green-100 text-green-700">
                Beginner
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {sampleQuestions[currentQuestion].options.map(option => (
                <div
                  key={option.id}
                  className={cn(
                    "p-4 border rounded-lg cursor-pointer transition-all",
                    selectedAnswer === option.id && !answerSubmitted ? "border-blue-500 bg-blue-50" : 
                    answerSubmitted && option.id === sampleQuestions[currentQuestion].correctAnswer ? "border-green-500 bg-green-50" :
                    answerSubmitted && selectedAnswer === option.id ? "border-red-500 bg-red-50" : 
                    "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                  )}
                  onClick={() => selectAnswer(option.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mt-0.5",
                      selectedAnswer === option.id && !answerSubmitted ? "bg-blue-500 text-white" : 
                      answerSubmitted && option.id === sampleQuestions[currentQuestion].correctAnswer ? "bg-green-500 text-white" :
                      answerSubmitted && selectedAnswer === option.id ? "bg-red-500 text-white" : 
                      "bg-gray-100 text-gray-700"
                    )}>
                      {option.id.toUpperCase()}
                    </div>
                    <div>{option.text}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {answerSubmitted && (
              <div className={cn(
                "mt-6 p-4 rounded-lg",
                isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              )}>
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white mt-0.5">
                      <CheckCircle size={14} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white mt-0.5">
                      <X size={14} />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">
                      {isCorrect ? "Correct!" : "Incorrect"}
                    </div>
                    <div className="text-sm mt-1">
                      {sampleQuestions[currentQuestion].explanation}
                    </div>
                    {isCorrect && (
                      <div className="text-sm mt-2 text-green-600 font-medium">
                        + {sampleQuestions[currentQuestion].xpReward} XP
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="text-yellow-500" size={18} />
              <span className="text-sm text-gray-600">Tip: Read each option carefully before answering</span>
            </div>
            
            {answerSubmitted ? (
              <Button onClick={nextQuestion}>
                {currentQuestion < sampleQuestions.length - 1 ? "Next Question" : "Finish"}
              </Button>
            ) : (
              <Button 
                onClick={submitAnswer} 
                disabled={!selectedAnswer}
                className={!selectedAnswer ? "opacity-50 cursor-not-allowed" : ""}
              >
                Submit Answer
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  )
} 