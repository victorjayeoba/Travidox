"use client"

import React, { useState } from 'react'
import { CheckCircle, Lightbulb, X } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface QuestionOption {
  id: string
  text: string
}

export interface Question {
  id: number
  question: string
  options: QuestionOption[]
  correctAnswer: string
  explanation: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  xpReward: number
}

interface QuestionCardProps {
  question: Question
  currentIndex: number
  totalQuestions: number
  onNext: () => void
  onComplete: (isCorrect: boolean, xpEarned: number) => void
}

export function QuestionCard({ 
  question, 
  currentIndex, 
  totalQuestions, 
  onNext, 
  onComplete 
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime] = useState(Date.now())
  
  // Function to handle selecting an answer
  const selectAnswer = (answerId: string) => {
    if (!answerSubmitted) {
      setSelectedAnswer(answerId)
    }
  }
  
  // Function to handle submitting an answer
  const submitAnswer = () => {
    if (selectedAnswer) {
      setAnswerSubmitted(true)
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
      
      const isCorrect = selectedAnswer === question.correctAnswer
      const timeBonus = Math.max(0, 30 - timeSpent) // Bonus for quick answers
      const totalXP = isCorrect ? question.xpReward + timeBonus : 0
      
      onComplete(isCorrect, totalXP)
    }
  }
  
  // Calculate if the selected answer is correct
  const isCorrect = selectedAnswer === question.correctAnswer
  
  // Determine badge color based on difficulty
  const difficultyColor = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700'
  }[question.difficulty]
  
  return (
    <Card className="border-2 border-blue-100">
      <CardHeader className="bg-blue-50 border-b border-blue-100">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">Question {currentIndex + 1}/{totalQuestions}</div>
            <CardTitle>{question.question}</CardTitle>
          </div>
          <Badge className={difficultyColor}>
            {question.difficulty.charAt(0).toUpperCase() + 
             question.difficulty.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {question.options.map(option => (
            <div
              key={option.id}
              className={cn(
                "p-4 border rounded-lg cursor-pointer transition-all",
                selectedAnswer === option.id && !answerSubmitted ? "border-blue-500 bg-blue-50" : 
                answerSubmitted && option.id === question.correctAnswer ? "border-green-500 bg-green-50" :
                answerSubmitted && selectedAnswer === option.id ? "border-red-500 bg-red-50" : 
                "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
              )}
              onClick={() => selectAnswer(option.id)}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mt-0.5",
                  selectedAnswer === option.id && !answerSubmitted ? "bg-blue-500 text-white" : 
                  answerSubmitted && option.id === question.correctAnswer ? "bg-green-500 text-white" :
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
                  {question.explanation}
                </div>
                {isCorrect && (
                  <div className="flex items-center gap-4 mt-2">
                    <div className="text-sm text-green-600 font-medium">
                      +{question.xpReward} XP base
                    </div>
                    {timeSpent < 30 && (
                      <div className="text-sm text-blue-600 font-medium">
                        +{Math.max(0, 30 - timeSpent)} XP time bonus
                      </div>
                    )}
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
          <span className="text-sm text-gray-600">
            {!answerSubmitted ? "Tip: Read each option carefully before answering" : 
             `You answered in ${timeSpent} seconds`}
          </span>
        </div>
        
        {answerSubmitted ? (
          <Button onClick={onNext}>
            {currentIndex < totalQuestions - 1 ? "Next Question" : "Finish"}
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
  )
} 