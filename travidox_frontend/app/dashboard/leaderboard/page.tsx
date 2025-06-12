"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Trophy, 
  Medal, 
  Star, 
  Users, 
  ChevronUp, 
  ChevronDown, 
  Search,
  Award,
  TrendingUp,
  Clock,
  Sparkles,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/components/auth/auth-provider'
import { useUserProfile } from '@/hooks/useUserProfile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { getLeaderboardUsers, getWeeklyLeaderboardUsers, UserProfile } from '@/lib/firebase-user'

// Leaderboard user type
interface LeaderboardUser {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  xp: number;
  level: number;
  completedQuizzes: string[];
  rank?: number;
  isCurrentUser?: boolean;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const router = useRouter();
  
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
  const [weeklyUsers, setWeeklyUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyLoading, setWeeklyLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all-time');
  
  // Fetch real leaderboard data from Firebase
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      
      try {
        // Get users from Firebase
        const users = await getLeaderboardUsers(50);
        
        // Map to leaderboard users
        const mappedUsers: LeaderboardUser[] = users.map(user => ({
          uid: user.uid,
          displayName: user.displayName || 'Anonymous User',
          photoURL: user.photoURL,
          xp: user.xp || 0,
          level: user.level || 1,
          completedQuizzes: user.completedQuizzes || [],
          isCurrentUser: user.uid === profile?.uid
        }));
        
        // Sort by XP (descending)
        const sortedUsers = mappedUsers.sort((a, b) => b.xp - a.xp);
        
        // Add rank
        const rankedUsers = sortedUsers.map((user, index) => ({
          ...user,
          rank: index + 1
        }));
        
        setLeaderboardUsers(rankedUsers);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [user, profile]);

  // Fetch weekly leaderboard data
  useEffect(() => {
    const fetchWeeklyLeaderboard = async () => {
      if (activeTab === 'weekly') {
        setWeeklyLoading(true);
        
        try {
          // Get weekly users from Firebase
          const users = await getWeeklyLeaderboardUsers();
          
          // Map to leaderboard users
          const mappedUsers: LeaderboardUser[] = users.map(user => ({
            uid: user.uid,
            displayName: user.displayName || 'Anonymous User',
            photoURL: user.photoURL,
            xp: user.weeklyXP || 0,  // Use weekly XP instead of total XP
            level: user.level || 1,
            completedQuizzes: user.completedQuizzes || [],
            isCurrentUser: user.uid === profile?.uid
          }));
          
          // Sort by weekly XP (descending)
          const sortedUsers = mappedUsers.sort((a, b) => b.xp - a.xp);
          
          // Add rank
          const rankedUsers = sortedUsers.map((user, index) => ({
            ...user,
            rank: index + 1
          }));
          
          setWeeklyUsers(rankedUsers);
        } catch (error) {
          console.error('Error fetching weekly leaderboard:', error);
        } finally {
          setWeeklyLoading(false);
        }
      }
    };
    
    fetchWeeklyLeaderboard();
  }, [activeTab, profile]);
  
  // Filter users based on search query
  const filteredUsers = leaderboardUsers.filter(user => 
    user.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get current date info for weekly calculations
  const getCurrentWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };
  
  // Get current week number and date range for display
  const getWeekDateRange = () => {
    const weekStart = getCurrentWeekStart();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
  };
  
  // Get user rank color
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-700';
    return 'text-gray-700';
  };
  
  // Get rank icon
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="font-bold">{rank}</span>;
  };
  
  // Get current user's rank
  const currentUserRank = leaderboardUsers.find(u => u.isCurrentUser)?.rank || 0;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-green-500" />
          Leaderboard
        </h1>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1.5 bg-green-50/70 text-green-700 max-w-[120px]">
            <Star className="h-3.5 w-3.5 flex-shrink-0 fill-green-400 text-green-500" />
            <span className="truncate">Your XP: {(profile?.xp || 0).toFixed(0)}</span>
          </Badge>
        </div>
      </div>
      
      {/* Leaderboard Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Your Ranking</CardTitle>
          <CardDescription>See how you compare to other traders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold">
                  {currentUserRank || '?'}
                </div>
                <div>
                  <h3 className="font-medium">Your Rank</h3>
                  <p className="text-sm text-gray-500">Out of {leaderboardUsers.length} traders</p>
                </div>
              </div>
              
              <div className="text-right">
                <h3 className="text-2xl font-bold">{(profile?.xp || 0).toFixed(0)} XP</h3>
                <p className="text-sm text-gray-500">Level {profile?.level || 1}</p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Progress to Level {(profile?.level || 1) + 1}</span>
                <span className="font-medium">{(profile?.xp || 0) % 100}/100 XP</span>
              </div>
              <Progress value={((profile?.xp || 0) % 100)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Leaderboard Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Leaderboard Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid grid-cols-2 mb-4 bg-green-50/50 border border-green-100/70">
          <TabsTrigger 
            value="all-time" 
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            <Trophy className="h-4 w-4 mr-2" />
            <span>All-Time</span>
          </TabsTrigger>
          <TabsTrigger 
            value="weekly"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            <Clock className="h-4 w-4 mr-2" />
            <span>This Week</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-time">
          {loading ? (
            <Card className="border-dashed border-2 border-gray-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-500">Loading leaderboard...</p>
              </CardContent>
            </Card>
          ) : filteredUsers.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Rank</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trader</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Level</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">XP</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Quizzes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr 
                          key={user.uid} 
                          className={`${user.isCurrentUser ? 'bg-green-50/60' : ''} hover:bg-gray-50`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
                              user.rank === 1 ? 'bg-yellow-100' : 
                              user.rank === 2 ? 'bg-gray-100' : 
                              user.rank === 3 ? 'bg-amber-100' : 'bg-gray-50'
                            }`}>
                              {getRankIcon(user.rank || 0)}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                                <AvatarFallback className="bg-green-50 text-green-600">
                                  {user.displayName?.charAt(0) || '?'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900 flex items-center gap-1">
                                  {user.displayName}
                                  {user.isCurrentUser && (
                                    <Badge variant="outline" className="ml-2 text-xs py-0 h-5">You</Badge>
                                  )}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                            <div className="flex items-center">
                              <div className="h-6 w-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs font-medium mr-2">
                                {user.level}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-semibold">
                            {user.xp.toFixed(0)} XP
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right hidden md:table-cell">
                            {user.completedQuizzes.length}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-2 border-gray-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No users found</h3>
                <p className="text-gray-500 text-center mt-2">
                  Try adjusting your search query
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="weekly">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              Weekly Rankings
            </h2>
            <Badge variant="outline" className="bg-green-50/70 text-green-600">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {getWeekDateRange()}
            </Badge>
          </div>
          
          {weeklyLoading ? (
            <Card className="border-dashed border-2 border-gray-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-500">Loading leaderboard...</p>
              </CardContent>
            </Card>
          ) : weeklyUsers.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Rank</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trader</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Level</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Weekly XP</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {weeklyUsers.map((user) => (
                        <tr 
                          key={user.uid} 
                          className={`${user.isCurrentUser ? 'bg-green-50/60' : ''} hover:bg-gray-50`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
                              user.rank === 1 ? 'bg-yellow-100' : 
                              user.rank === 2 ? 'bg-gray-100' : 
                              user.rank === 3 ? 'bg-amber-100' : 'bg-gray-50'
                            }`}>
                              {getRankIcon(user.rank || 0)}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                                <AvatarFallback className="bg-green-50 text-green-600">
                                  {user.displayName?.charAt(0) || '?'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900 flex items-center gap-1">
                                  {user.displayName}
                                  {user.isCurrentUser && (
                                    <Badge variant="outline" className="ml-2 text-xs py-0 h-5">You</Badge>
                                  )}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                            <div className="flex items-center">
                              <div className="h-6 w-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs font-medium mr-2">
                                {user.level}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-semibold">
                            {user.xp.toFixed(0)} XP
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-2 border-gray-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No Weekly Activity Yet</h3>
                <p className="text-gray-500 text-center mt-2">
                  Complete quizzes this week to earn XP and appear on the weekly leaderboard!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Achievement Badges */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Achievement Badges</CardTitle>
          <CardDescription>Earn badges by completing quizzes and reaching milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg bg-gradient-to-b from-yellow-50 to-yellow-100">
              <div className="h-16 w-16 rounded-full bg-yellow-200 flex items-center justify-center mb-3">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-medium text-center">Quiz Master</h3>
              <p className="text-xs text-gray-500 text-center mt-1">Complete 10 quizzes</p>
            </div>
            
            <div className="flex flex-col items-center p-4 border rounded-lg bg-gray-50">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                <Star className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-center">XP Hunter</h3>
              <p className="text-xs text-gray-500 text-center mt-1">Reach 5,000 XP</p>
            </div>
            
            <div className="flex flex-col items-center p-4 border rounded-lg bg-gray-50">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                <Award className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-center">Nigerian Expert</h3>
              <p className="text-xs text-gray-500 text-center mt-1">Complete all Nigerian Stock quizzes</p>
            </div>
            
            <div className="flex flex-col items-center p-4 border rounded-lg bg-gray-50">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-center">Top 10</h3>
              <p className="text-xs text-gray-500 text-center mt-1">Reach the top 10 on the leaderboard</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 