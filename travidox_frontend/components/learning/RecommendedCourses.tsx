import React from 'react'
import { BookText, BarChart2, TrendingUp, Layers } from 'lucide-react'
import { CourseCard } from './CourseCard'
import { coursesData } from '@/lib/course-data'

interface RecommendedCoursesProps {
  limit?: number
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'BookText':
      return <BookText className="h-5 w-5 text-green-600" />
    case 'BarChart2':
      return <BarChart2 className="h-5 w-5 text-green-600" />
    case 'TrendingUp':
      return <TrendingUp className="h-5 w-5 text-green-600" />
    case 'Layers':
      return <Layers className="h-5 w-5 text-green-600" />
    default:
      return <BookText className="h-5 w-5 text-green-600" />
  }
}

export function RecommendedCourses({ limit = 4 }: RecommendedCoursesProps) {
  // Get first few courses to display
  const displayCourses = coursesData.slice(0, limit)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayCourses.map((course) => (
        <CourseCard
          key={course.id}
          id={course.id}
          title={course.title}
          category={course.category}
          description={course.description}
          estimatedHours={course.estimatedHours}
          icon={getIconComponent(course.icon)}
          tags={course.tags.slice(0, 3)}
          status="not-started"
        />
      ))}
    </div>
  )
} 