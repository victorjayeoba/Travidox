import React from 'react'
import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CourseCardProps {
  id: string
  title: string
  category: string
  description: string
  estimatedHours: number
  icon: React.ReactNode
  tags: string[]
  status?: 'not-started' | 'in-progress' | 'completed'
  progress?: number
}

export function CourseCard({
  id,
  title,
  category,
  description,
  estimatedHours,
  icon,
  tags,
  status = 'not-started',
  progress = 0
}: CourseCardProps) {
  return (
    <Card className="overflow-hidden border hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <div className={`h-1.5 w-full ${
        status === 'completed' ? "bg-emerald-500" : 
        status === 'in-progress' ? "bg-green-500" : 
        "bg-green-600"
      }`}></div>
      
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start gap-3 mb-3">
          <div className={`rounded-full p-2.5 ${
            status === 'completed' ? "bg-emerald-50" : 
            status === 'in-progress' ? "bg-green-50" : 
            "bg-green-50"
          }`}>
            {icon}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-0.5 line-clamp-1">{title}</h3>
            <p className="text-xs text-gray-500 mb-1">{category}</p>
            
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{estimatedHours} hours</span>
              
              <Badge 
                className={`ml-auto text-xs px-1.5 py-0 ${
                  status === 'completed' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : 
                  status === 'in-progress' ? "bg-green-50 text-green-700 border-green-200" : 
                  "bg-gray-50 text-gray-600 border-gray-200"
                }`}
              >
                {status === 'completed' ? 'Completed' : 
                 status === 'in-progress' ? `${progress}% Complete` : 
                 'Not Started'}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="mb-3 flex-1">
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">{description}</p>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Link href={`/dashboard/certifications/${id}`} className="mt-auto">
          <Button 
            variant={status === 'completed' ? 'outline' : 'default'}
            className={`w-full gap-1 ${
              status === 'completed' ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50" : 
              status === 'in-progress' ? "bg-green-600 hover:bg-green-700" : 
              "bg-green-600 hover:bg-green-700"
            }`}
            size="sm"
          >
            <span>
              {status === 'completed' ? 'View Certificate' : 
               status === 'in-progress' ? 'Continue Learning' : 
               'Start Learning'}
            </span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
} 