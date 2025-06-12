import React from 'react'
import Link from 'next/link'
import { CheckCircle, Clock, ArrowRight, Award, BookOpen, Users, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface CertificationCardProps {
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedHours: number
  progress?: number
  isCompleted?: boolean
  skills: string[]
  slug: string
  students?: number
  category?: string
}

export function CertificationCard({
  title,
  description,
  difficulty,
  estimatedHours,
  progress = 0,
  isCompleted = false,
  skills,
  slug,
  students = 0,
  category = ''
}: CertificationCardProps) {
  // Determine difficulty label
  const difficultyLabel = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced'
  }[difficulty]

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-md border overflow-hidden flex flex-col h-full",
      isCompleted ? "border-emerald-200 bg-emerald-50/30" : ""
    )}>
      <div className="h-2 w-full bg-green-500"></div>
      <CardContent className="p-5 flex flex-col h-full">
        {/* Category & Difficulty Badge */}
        <div className="flex justify-between items-center mb-2">
          {category && (
            <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">
              {category}
            </div>
          )}
          <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-0.5">
            {difficultyLabel}
          </Badge>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{description}</p>
        
        {/* Skills & Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.length > 0 && skills.slice(0, 3).map((skill, i) => (
            <Badge key={i} variant="outline" className="text-xs px-2 py-0.5">
              {skill}
            </Badge>
          ))}
          
          {isCompleted && (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-2 py-0.5">
              <CheckCircle size={12} className="mr-1" />
              Completed
            </Badge>
          )}
        </div>
        
        {/* Course Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{estimatedHours} hours</span>
          </div>
          
          {students > 0 && (
            <div className="flex items-center">
              <Users size={14} className="mr-1" />
              <span>{students.toLocaleString()} students</span>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        {!isCompleted && progress > 0 && (
          <div className="mb-4 space-y-1">
            <Progress value={progress} className="h-1.5 bg-gray-100">
              <div className="bg-green-600 h-full w-[var(--value%)]" />
            </Progress>
            <div className="flex justify-between text-xs text-gray-500">
              <span>In progress</span>
              <span>{progress}% completed</span>
            </div>
          </div>
        )}
        
        {/* Button at the bottom */}
        <div className="mt-auto pt-2">
          <Link href={`/dashboard/certifications/${slug}`} className="w-full block">
            <Button 
              variant={isCompleted ? "outline" : "default"} 
              className={cn(
                "w-full gap-1 group",
                isCompleted ? "border-green-200 text-green-700 hover:bg-green-50" : 
                "bg-green-600 hover:bg-green-700"
              )}
              size="sm"
            >
              <span>
                {isCompleted ? 'View Certificate' : progress > 0 ? 'Continue Learning' : 'Start Learning'}
              </span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 