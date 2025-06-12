"use client"

import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <motion.div 
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-10 blur-3xl transform scale-150" />
          
          <motion.div 
            className="relative flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <div className="h-20 w-20 rounded-full border-4 border-gray-200 border-t-green-600 border-r-green-600" />
          </motion.div>
          
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-green-600"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Travidox</h2>
          <p className="text-gray-600">Preparing your trading dashboard...</p>
        </motion.div>
        
        <motion.div 
          className="mt-8 w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "12rem" }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-green-500 to-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              delay: 0.8,
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
} 