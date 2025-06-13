"use client"

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, Loader2, Sparkles, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm Travidox AI. Ask me about Nigerian stocks, trading strategies, or market insights.",
      role: 'assistant',
      timestamp: new Date().toISOString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.slice(-10)
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message || "I apologize, but I couldn't generate a response. Please try again.",
        role: 'assistant',
        timestamp: data.timestamp || new Date().toISOString()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again.",
        role: 'assistant',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Now'
    }
  }

  const clearConversation = () => {
    setMessages([
      {
        id: '1',
        content: "Hi! I'm Travidox AI. Ask me about Nigerian stocks, trading strategies, or market insights.",
        role: 'assistant',
        timestamp: new Date().toISOString()
      }
    ])
  }

  const quickQuestions = [
    "Analyze Dangote Cement",
    "Best banking stocks?",
    "Market trends today",
    "Risk management tips"
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
            <p className="text-sm text-gray-600">Chat with Travidox AI</p>
          </div>
        </div>
        <Button
          onClick={clearConversation}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw size={14} />
          New Chat
        </Button>
      </div>

      {/* Main Chat Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 h-[calc(100vh-16rem)]">
            <CardContent className="p-0 h-full flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex items-start space-x-3",
                        message.role === 'user' ? "flex-row-reverse space-x-reverse" : ""
                      )}
                    >
                      <Avatar className="h-7 w-7 flex-shrink-0">
                        <AvatarFallback 
                          className={cn(
                            "text-xs",
                            message.role === 'user' 
                              ? "bg-blue-100 text-blue-700" 
                              : "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700"
                          )}
                        >
                          {message.role === 'user' ? 'You' : <Bot size={12} />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                        message.role === 'user'
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      )}>
                        <p className="leading-relaxed">{message.content}</p>
                        <p className={cn(
                          "text-xs mt-1 opacity-70",
                          message.role === 'user' ? "text-blue-100" : "text-gray-500"
                        )}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700">
                          <Bot size={12} />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Loader2 size={12} className="animate-spin" />
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t bg-gray-50/50">
                <div className="flex space-x-3">
                  <Input
                    ref={inputRef}
                    placeholder="Ask about stocks, trading, or market insights..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="flex-1 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-4 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Questions */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles size={16} className="text-yellow-600" />
                <CardTitle className="text-base">Quick Start</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-3 text-sm hover:bg-purple-50 hover:text-purple-700"
                  onClick={() => setInputMessage(question)}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Real-time market data</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Trading strategies</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">Risk management</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">Educational content</span>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="bg-yellow-50/80 backdrop-blur-sm border-yellow-200">
            <CardContent className="p-4">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> AI provides educational insights. Always do your own research before investing.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 