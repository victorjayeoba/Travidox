"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Home, RefreshCcw, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
  
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
  
  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
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
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-md">
                Something went wrong
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Oops! We hit a snag
            </motion.h1>
            
            <motion.div 
              variants={lineVariants}
              className="h-1 w-24 bg-gradient-to-r from-amber-500 to-red-500 mb-6"
            />
            
            <motion.p 
              variants={itemVariants}
              className="text-gray-600 mb-8 text-lg"
            >
              We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
              In the meantime, you can try refreshing the page or return to the dashboard.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                onClick={() => reset()}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              
              <Button 
                asChild
                variant="outline"
                className="border-gray-300"
              >
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </motion.div>
            
            {error.digest && (
              <motion.div 
                variants={itemVariants}
                className="mt-6 text-xs text-gray-500"
              >
                Error ID: {error.digest}
              </motion.div>
            )}
          </div>
          
          {/* Right/Bottom Section */}
          <div className="bg-gradient-to-br from-amber-50 to-red-50 p-8 md:p-12 flex items-center justify-center md:w-2/5">
            <motion.div
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              className="text-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500 rounded-full opacity-10 blur-2xl transform scale-110" />
                <div className="relative">
                  <AlertCircle className="h-32 w-32 text-amber-500 mx-auto" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 text-center text-sm text-gray-500 border-t">
          <motion.p variants={itemVariants}>
            If this problem persists, please contact our support team at{" "}
            <a href="mailto:support@travidox.com" className="text-amber-600 hover:underline">
              support@travidox.com
            </a>
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
} 