import React from 'react'
import Link from 'next/link'
import { CheckCircle, Clock, ArrowRight, Award, Star } from 'lucide-react'
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
}

export function CertificationCard({
  title,
  description,
  difficulty,
  estimatedHours,
  progress = 0,
  isCompleted = false,
  skills,
  slug
}: CertificationCardProps) {
  // Determine badge color based on difficulty
  const difficultyColor = {
    beginner: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    intermediate: 'bg-blue-100 text-blue-700 border-blue-200',
    advanced: 'bg-purple-100 text-purple-700 border-purple-200'
  }[difficulty]

  // Determine label for difficulty
  const difficultyLabel = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced'
  }[difficulty]

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-md",
      isCompleted ? "border-emerald-200 bg-emerald-50/30" : ""
    )}>
      <CardContent className="p-5">
        <div className="flex justify-between mb-3">
          <Badge className={difficultyColor}>
            {difficultyLabel}
          </Badge>
          {isCompleted && (
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              <CheckCircle size={12} className="mr-1" />
              Completed
            </Badge>
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Clock size={14} className="mr-1" />
          <span>{estimatedHours} hours</span>
          
          {skills.length > 0 && (
            <>
              <span className="mx-2">•</span>
              <div className="flex items-center gap-1">
                {skills.slice(0, 2).map((skill, i) => (
                  <Badge key={i} variant="outline" className="text-xs px-1.5 py-0">
                    {skill}
                  </Badge>
                ))}
                {skills.length > 2 && (
                  <span className="text-xs">+{skills.length - 2}</span>
                )}
              </div>
            </>
          )}
        </div>
        
        {!isCompleted && (
          <div className="mb-4 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
        
        <Link href={`/dashboard/certifications/${slug}`}>
          <Button 
            variant={isCompleted ? "outline" : "default"} 
            className="w-full gap-1 group"
          >
            <span>
              {isCompleted ? 'View Certificate' : progress > 0 ? 'Continue' : 'Start Course'}
            </span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
} 