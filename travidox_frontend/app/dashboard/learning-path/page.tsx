"use client"

import React, { useState } from 'react'
import { coursesData } from '@/lib/course-data'
import { MarkdownContent } from '@/components/ui/markdown'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, BookOpen, BookText, BarChart2, TrendingUp, Layers, Filter, ChevronDown, Clock, Award } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function LearningPathPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [difficulty, setDifficulty] = useState('all')
  
  // Filter courses based on search query and difficulty
  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesDifficulty = difficulty === 'all' || course.difficulty === difficulty
    
    return matchesSearch && matchesDifficulty
  })
  
  // Group courses by category
  const coursesByCategory = filteredCourses.reduce((acc, course) => {
    const category = course.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(course)
    return acc
  }, {} as Record<string, typeof coursesData>)
  
  // Get icon component based on icon name
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
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Learning Paths</h1>
        <p className="text-gray-500">Structured course paths to master Nigerian stock & forex trading</p>
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Input 
            placeholder="Search courses..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setDifficulty(difficulty === 'all' ? 'beginner' : difficulty === 'beginner' ? 'intermediate' : difficulty === 'intermediate' ? 'advanced' : 'all')}
          >
            <Filter className="h-4 w-4" />
            <span>
              {difficulty === 'all' ? 'All Levels' : 
               difficulty === 'beginner' ? 'Beginner' : 
               difficulty === 'intermediate' ? 'Intermediate' : 
               'Advanced'}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Course categories */}
      {Object.entries(coursesByCategory).length > 0 ? (
        <div className="space-y-10">
          {Object.entries(coursesByCategory).map(([category, courses]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">{category}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <Card key={course.id} className="overflow-hidden border hover:shadow-md transition-all duration-300 flex flex-col h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full p-2.5 bg-green-50">
                          {getIconComponent(course.icon)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{course.title}</CardTitle>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>{course.estimatedHours} hours</span>
                            
                            <Badge 
                              className="ml-3 text-xs capitalize"
                              variant="outline"
                            >
                              {course.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1">
                      <CardDescription className="mb-4 line-clamp-2">
                        {course.description}
                      </CardDescription>
                      
                      <div className="mb-4 flex-1">
                        <div className="text-sm text-gray-700 font-medium mb-2">What you'll learn:</div>
                        <div className="line-clamp-3 text-sm">
                          <MarkdownContent content={course.longDescription.split('\n\n')[0]} />
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {course.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <Link href={`/dashboard/certifications/${course.id}`}>
                        <Button 
                          variant="default"
                          className="w-full bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          View Course
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  )
} 