"use client"

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RecommendedCourses } from '@/components/learning/RecommendedCourses'
import { coursesData } from '@/lib/course-data'
import { BookOpen, BookText, BarChart2, TrendingUp, Layers, GraduationCap, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('all')
  
  const categories = ['all', ...new Set(coursesData.map(course => course.category))]
  
  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = activeTab === 'all' || course.category === activeTab
    
    return matchesSearch && matchesCategory
  })
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nigerian Stock & Forex Courses</h1>
        <p className="text-gray-500">Master the Nigerian financial markets with our specialized courses on local stocks and forex trading</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Courses</p>
            <p className="text-xl font-semibold">{coursesData.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <BookText className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Nigerian Market Courses</p>
            <p className="text-xl font-semibold">{coursesData.filter(c => c.category.includes('Nigerian')).length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Certifications</p>
            <p className="text-xl font-semibold">{coursesData.filter(c => c.certificationIncluded).length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Trading Strategies</p>
            <p className="text-xl font-semibold">{coursesData.filter(c => c.tags.some(tag => tag.includes('Strategies'))).length}</p>
          </div>
        </div>
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Input 
            placeholder="Search courses..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-green-50 p-1">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                {category === 'all' ? 'All Courses' : category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          <RecommendedCourses limit={filteredCourses.length} />
        ) : (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
      
      {/* CTA */}
      <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Become a Nigerian Market Expert?</h3>
        <p className="text-gray-600 mb-4">Enroll in our specialized courses and learn from industry professionals</p>
        <Button className="bg-green-600 hover:bg-green-700">
          Explore All Courses
        </Button>
      </div>
    </div>
  )
} 