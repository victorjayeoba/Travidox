"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User, Mail, LogOut, ArrowLeft, Star, Award, BookOpen, Certificate, Sparkles } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function ProfilePage() {
  const { user, userProfile, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  // Calculate XP for next level
  const calculateXpProgress = () => {
    if (!userProfile) return 0;
    
    const currentLevel = userProfile.level;
    const nextLevelXp = currentLevel * 100;
    const currentXp = userProfile.xp;
    const previousLevelXp = (currentLevel - 1) * 100;
    
    // Calculate progress to next level (0-100)
    return Math.min(100, Math.floor(((currentXp - previousLevelXp) / (nextLevelXp - previousLevelXp)) * 100));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="text-gray-600 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Profile Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-green-600" />
              <span>Account Information</span>
            </CardTitle>
            <CardDescription>
              Your personal details and account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                <AvatarFallback className="bg-green-100 text-green-700 text-lg font-semibold">
                  {user.displayName ? getInitials(user.displayName) : user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user.displayName || 'Not provided'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {user.emailVerified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Verified Account
                    </Badge>
                  )}
                  {userProfile && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Level {userProfile.level}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="text-sm text-gray-900">{user.email}</p>
                </div>
              </div>
              
              {userProfile && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-500">Experience Points</p>
                      <p className="text-sm font-medium text-blue-600">{(userProfile.xp).toFixed(2)} XP</p>
                    </div>
                    <Progress value={calculateXpProgress()} className="h-2 mt-1" />
                    <p className="text-xs text-gray-500 mt-1">
                      {calculateXpProgress()}% to Level {userProfile.level + 1}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="text-sm text-gray-900 font-mono">{user.uid}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Learning Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                  Enrolled Courses
                </span>
                <Badge variant="outline">
                  {userProfile?.enrolledCourses?.length || 0}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center">
                  <Certificate className="h-4 w-4 mr-2 text-green-500" />
                  Completed Courses
                </span>
                <Badge variant="outline">
                  {userProfile?.completedCourses || 0}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center">
                  <Award className="h-4 w-4 mr-2 text-yellow-500" />
                  Certificates Earned
                </span>
                <Badge variant="outline">
                  {userProfile?.certificates?.length || 0}
                </Badge>
              </div>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <Badge variant="outline">Free</Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium">
                    {userProfile?.createdAt 
                      ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString()
                      : user.metadata.creationTime
                        ? new Date(user.metadata.creationTime).toLocaleDateString()
                        : 'Today'
                    }
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Activity */}
      {userProfile?.lastCompletedCourse && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 p-4 bg-green-50 text-green-800 rounded-lg">
              <Certificate className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium">Course Completed!</p>
                <p className="text-sm mt-1">
                  You've completed "{userProfile.lastCompletedCourse.courseName}" on{' '}
                  {new Date(userProfile.lastCompletedCourse.completedAt.seconds * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome to Travidox, {user.displayName || user.email?.split('@')[0]}! 🎉
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              You've successfully created your account. Start exploring our courses and advance your skills.
            </p>
            <div className="pt-4 flex justify-center space-x-3">
              <Button 
                onClick={() => router.push('/dashboard')}
                className="bg-green-600 hover:bg-green-700"
              >
                Back to Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/dashboard/certifications')}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Certificate className="h-4 w-4 mr-2" />
                View Certifications
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 