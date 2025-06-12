"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, Search, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.6 
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }
  
  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  }
  
  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
  
  if (!mounted) return null
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div 
        className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left/Top Section */}
          <div className="p-8 md:p-12 flex-1">
            <motion.div variants={itemVariants} className="mb-2">
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-md">
                Error 404
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Page not found
            </motion.h1>
            
            <motion.div 
              variants={lineVariants}
              className="h-1 w-24 bg-gradient-to-r from-green-500 to-blue-500 mb-6"
            />
            
            <motion.p 
              variants={itemVariants}
              className="text-gray-600 mb-8 text-lg"
            >
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track to your investment journey.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                asChild
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline"
                className="border-gray-300"
              >
                <Link href="/dashboard/markets">
                  <Search className="mr-2 h-4 w-4" />
                  Explore Markets
                </Link>
              </Button>
            </motion.div>
          </div>
          
          {/* Right/Bottom Section */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 md:p-12 flex items-center justify-center md:w-2/5">
            <motion.div
              variants={floatVariants}
              initial="initial"
              animate="animate"
              className="text-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full opacity-10 blur-2xl transform scale-110" />
                <div className="relative">
                  <div className="text-[120px] md:text-[150px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                    404
                  </div>
                  <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mt-4" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 text-center text-sm text-gray-500 border-t">
          <motion.p variants={itemVariants}>
            Lost? Try searching for what you need or contact our support team at{" "}
            <a href="mailto:support@travidox.com" className="text-green-600 hover:underline">
              support@travidox.com
            </a>
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
} 