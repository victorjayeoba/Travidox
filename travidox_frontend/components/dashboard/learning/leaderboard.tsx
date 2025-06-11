"use client"

import React from 'react'
import { Trophy } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export interface LeaderboardUser {
  id: number
  name: string
  xp: number
  level: number
  avatar?: string
}

interface LeaderboardProps {
  title?: string
  description?: string
  users: LeaderboardUser[]
  highlightUserId?: number
  className?: string
}

export function Leaderboard({ 
  title = "Leaderboard", 
  description = "Top performers this week", 
  users,
  highlightUserId,
  className
}: LeaderboardProps) {
  return (
    <Card className={cn("bg-gradient-to-br from-gray-50 to-slate-100", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          {users.length > 0 ? (
            users.map((user, index) => (
              <div
                key={user.id}
                className={cn(
                  "flex items-center justify-between p-3 border-b border-gray-100",
                  index < 3 ? "bg-yellow-50/50" : "",
                  user.id === highlightUserId ? "bg-blue-50" : ""
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    index === 0 ? "bg-yellow-400 text-white" : 
                    index === 1 ? "bg-gray-300 text-gray-700" :
                    index === 2 ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600"
                  )}>
                    {index + 1}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-xs text-gray-500">Level {user.level}</div>
                  </div>
                </div>
                <div className="font-semibold text-sm">
                  {user.xp.toFixed(2)} XP
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No data available
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 