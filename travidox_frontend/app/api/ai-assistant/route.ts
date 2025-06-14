import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { getMarketContext, getDefaultMarketContext } from '@/lib/market-context'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const TRAVIDOX_CONTEXT = `
You are Travidox AI, an intelligent financial assistant for the Travidox platform - Nigeria's premier stock trading and investment learning platform. 

ABOUT TRAVIDOX:
- Travidox is a comprehensive financial platform offering stock trading, investment education, AI-powered insights, and trading bots
- We focus on the Nigerian Stock Exchange (NGX) and help users learn to trade responsibly
- Our platform offers virtual trading, certifications, courses, and real-time market data
- We believe in democratizing access to financial markets and empowering Nigerians to build wealth through smart investing

YOUR ROLE:
- Provide helpful, accurate financial guidance and market insights
- Answer questions about stocks, trading strategies, and market analysis
- Help users understand investment concepts and financial literacy
- Offer personalized advice based on current market conditions
- Assist with navigating the Travidox platform features
- Always promote responsible trading and risk management

GUIDELINES:
- Always respond as "Travidox AI"
- Be professional yet conversational
- Format your responses using Markdown. Use lists, bolding, and italics to improve readability.
- Provide actionable insights when possible
- If you don't know something specific about current market data, acknowledge it
- Encourage users to do their own research (DYOR)
- Emphasize risk management and never guarantee returns
- Focus on education and building long-term wealth
- Be supportive and encouraging to new investors

CURRENT MARKET FOCUS:
- Nigerian Stock Exchange (NGX)
- Popular Nigerian stocks like Dangote Cement, GTBank, Zenith Bank, etc.
- Economic indicators affecting Nigerian markets
- Oil prices and their impact on the Nigerian economy
- Inflation and monetary policy effects

Remember: You're here to educate, guide, and empower users on their financial journey while maintaining the highest standards of financial advice ethics.
`

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await req.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Get current market context
    let marketContext = ''
    try {
      marketContext = await getMarketContext()
    } catch (error) {
      console.error('Failed to fetch market context:', error)
      marketContext = getDefaultMarketContext()
    }

    // Build conversation context
    let conversationContext = TRAVIDOX_CONTEXT + '\n\n'
    conversationContext += marketContext + '\n'
    
    // Add recent conversation history
    if (conversationHistory.length > 0) {
      conversationContext += 'RECENT CONVERSATION:\n'
      conversationHistory.slice(-6).forEach((msg: any) => {
        conversationContext += `${msg.role === 'user' ? 'User' : 'Travidox AI'}: ${msg.content}\n`
      })
      conversationContext += '\n'
    }

    conversationContext += `User: ${message}\n\n`

    const result = await model.generateContent(conversationContext)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      message: text,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Assistant Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate response. Please try again.',
        message: 'I apologize, but I encountered an error while processing your request. Please try asking your question again, and I\'ll be happy to help you with your trading and investment inquiries.'
      },
      { status: 500 }
    )
  }
} 