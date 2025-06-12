"use client"

import React, { useState, useEffect } from 'react'
import { QuestionCard, Question } from './question-card'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Clock, Trophy, Star, ArrowLeft, Award, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface GameSessionProps {
  mode: 'single-player' | 'multiplayer' | 'tournament'
  category: string
  questions: Question[]
  onComplete: (results: GameResults) => void
  onBack: () => void
}

export interface GameResults {
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  totalXP: number
  timeSpent: number
  accuracy: number
  completionTime: string
}

export function GameSession({
  mode,
  category,
  questions,
  onComplete,
  onBack
}: GameSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [gameStartTime] = useState(Date.now())
  const [results, setResults] = useState<GameResults>({
    totalQuestions: questions.length,
    correctAnswers: 0,
    incorrectAnswers: 0,
    totalXP: 0,
    timeSpent: 0,
    accuracy: 0,
    completionTime: ''
  })
  const [gameStatus, setGameStatus] = useState<'playing' | 'completed'>('playing')
  
  // Function to handle moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Game is over
      const totalTimeSpent = Math.floor((Date.now() - gameStartTime) / 1000)
      
      // Format time as MM:SS
      const minutes = Math.floor(totalTimeSpent / 60)
      const seconds = totalTimeSpent % 60
      const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`
      
      // Calculate accuracy
      const accuracy = results.correctAnswers / questions.length * 100
      
      setResults(prev => ({
        ...prev,
        timeSpent: totalTimeSpent,
        accuracy: accuracy,
        completionTime: formattedTime
      }))
      
      setGameStatus('completed')
    }
  }
  
  // Function to handle question completion
  const handleQuestionComplete = (isCorrect: boolean, xpEarned: number) => {
    setResults(prev => ({
      ...prev,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      incorrectAnswers: !isCorrect ? prev.incorrectAnswers + 1 : prev.incorrectAnswers,
      totalXP: prev.totalXP + xpEarned
    }))
  }
  
  // When game is completed, call the onComplete callback
  useEffect(() => {
    if (gameStatus === 'completed') {
      onComplete(results)
    }
  }, [gameStatus, results, onComplete])
  
  // Render game summary if completed
  if (gameStatus === 'completed') {
    return (
      <Card className="border-2 border-green-100">
        <CardHeader className="bg-green-50 border-b border-green-100">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {mode === 'tournament' ? 'Tournament Completed' : 'Challenge Completed'}
          </CardTitle>
          <CardDescription>
            You've completed the {category} challenge!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Your Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Accuracy</span>
                    <span className="font-medium">{Math.round(results.accuracy)}%</span>
                  </div>
                  <Progress 
                    value={results.accuracy} 
                    className="h-2" 
                    indicatorClassName={cn(
                      results.accuracy >= 80 ? "bg-green-500" :
                      results.accuracy >= 60 ? "bg-yellow-500" :
                      "bg-red-500"
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Correct</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{results.correctAnswers}</div>
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Incorrect</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{results.incorrectAnswers}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Rewards Earned</h3>
              <div className="bg-lime-50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-lime-500" />
                    <span className="font-medium">Total XP</span>
                  </div>
                  <div className="text-2xl font-bold text-lime-600">+{results.totalXP.toFixed(2)}</div>
                </div>
              </div>
              
              {results.accuracy >= 80 && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Achievements</span>
                  </div>
                  <div className="space-y-2">
                    {results.accuracy >= 90 && (
                      <Badge className="bg-yellow-100 text-yellow-800 mr-2">Expert {category}</Badge>
                    )}
                    {results.accuracy >= 80 && results.timeSpent < questions.length * 20 && (
                      <Badge className="bg-lime-100 text-lime-800 mr-2">Speed Demon</Badge>
                    )}
                    {results.correctAnswers === questions.length && (
                      <Badge className="bg-green-100 text-green-800">Perfect Score</Badge>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Completion Time: {results.completionTime}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Challenges
          </Button>
          
          <Button onClick={() => {
            // Reset the game to play again
            setCurrentQuestionIndex(0)
            setResults({
              totalQuestions: questions.length,
              correctAnswers: 0,
              incorrectAnswers: 0,
              totalXP: 0,
              timeSpent: 0,
              accuracy: 0,
              completionTime: ''
            })
            setGameStatus('playing')
          }}>
            Play Again
          </Button>
        </CardFooter>
      </Card>
    )
  }
  
  // Render current question
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Exit Challenge
        </Button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Progress:</span>
          <Progress 
            value={(currentQuestionIndex / questions.length) * 100} 
            className="w-32 h-2" 
          />
          <span className="text-sm font-medium">
            {currentQuestionIndex}/{questions.length}
          </span>
        </div>
      </div>
      
      <QuestionCard 
        question={questions[currentQuestionIndex]}
        currentIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        onNext={handleNextQuestion}
        onComplete={handleQuestionComplete}
      />
    </div>
  )
} 