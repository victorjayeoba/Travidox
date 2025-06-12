'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Star, Medal, Zap, Award, RefreshCw } from 'lucide-react';

interface QuizCelebrationProps {
  score: number;
  totalQuestions: number;
  xpEarned: number;
  isRetake?: boolean;
  onClose?: () => void;
}

export function QuizCelebration({ 
  score, 
  totalQuestions, 
  xpEarned, 
  isRetake = false,
  onClose 
}: QuizCelebrationProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Calculate percentage score
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Determine achievement level
  const isPerfect = score === totalQuestions;
  const isExcellent = percentage >= 80 && !isPerfect;
  const isGood = percentage >= 60 && percentage < 80;
  
  useEffect(() => {
    // Show celebration after a short delay
    const timer = setTimeout(() => {
      setShowCelebration(true);
      
      // Only trigger confetti for first-time completions or perfect retakes
      if (!isRetake || (isRetake && isPerfect)) {
        // Trigger confetti
        const duration = 3 * 1000;
        const end = Date.now() + duration;
        
        // For perfect score, create a more spectacular confetti effect
        if (isPerfect) {
          const perfectConfetti = () => {
            confetti({
              particleCount: 100,
              startVelocity: 30,
              spread: 360,
              origin: { x: Math.random(), y: Math.random() * 0.5 },
              colors: ['#84cc16', '#65a30d', '#4d7c0f', '#a3e635', '#d9f99d'],
            });
            
            if (Date.now() < end) {
              requestAnimationFrame(perfectConfetti);
            }
          };
          perfectConfetti();
        } else {
          // Standard confetti for good scores
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#84cc16', '#65a30d', '#4d7c0f', '#a3e635', '#d9f99d'],
          });
        }
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isPerfect, isRetake]);
  
  if (!showCelebration) return null;
  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
        initial={{ scale: 0.8, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: 0.2
        }}
      >
        <div className={`${isRetake ? 'bg-gradient-to-r from-lime-500 to-green-600' : 'bg-gradient-to-r from-lime-500 to-green-600'} py-6 px-4 text-white text-center`}>
          <div className="flex justify-center mb-4">
            {isRetake ? (
              <div className="h-20 w-20 rounded-full bg-lime-400 flex items-center justify-center">
                <RefreshCw className="h-12 w-12 text-white" />
              </div>
            ) : isPerfect ? (
              <div className="h-20 w-20 rounded-full bg-lime-400 flex items-center justify-center">
                <Trophy className="h-12 w-12 text-white" />
              </div>
            ) : isExcellent ? (
              <div className="h-20 w-20 rounded-full bg-lime-500 flex items-center justify-center">
                <Medal className="h-12 w-12 text-white" />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-full bg-lime-600 flex items-center justify-center">
                <Award className="h-12 w-12 text-white" />
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold mb-1">
            {isRetake ? 'Quiz Retaken!' : isPerfect ? 'Perfect Score!' : isExcellent ? 'Excellent Work!' : 'Good Job!'}
          </h2>
          <p className="text-white text-opacity-90">
            You scored {score} out of {totalQuestions} questions
          </p>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Score</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div 
                className={`h-3 rounded-full ${
                  isPerfect 
                    ? 'bg-gradient-to-r from-lime-400 to-lime-600' 
                    : isExcellent 
                      ? 'bg-gradient-to-r from-lime-400 to-lime-600'
                      : 'bg-gradient-to-r from-lime-400 to-lime-600'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
          
          {isRetake ? (
            <div className="bg-lime-50 border border-lime-100 rounded-lg p-4 flex items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-lime-100 flex items-center justify-center mr-4">
                <RefreshCw className="h-6 w-6 text-lime-600" />
              </div>
              <div>
                <p className="font-medium text-lime-800">Quiz Retake Complete</p>
                <p className="text-sm text-lime-600">No additional XP for retakes</p>
              </div>
            </div>
          ) : (
            <div className="bg-lime-50 border border-lime-100 rounded-lg p-4 flex items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-lime-100 flex items-center justify-center mr-4">
                <Zap className="h-6 w-6 text-lime-600" />
              </div>
              <div>
                <p className="font-medium text-lime-800">+{xpEarned} XP Earned!</p>
                <p className="text-sm text-lime-600">Added to your profile</p>
              </div>
            </div>
          )}
          
          {isPerfect && !isRetake && (
            <motion.div 
              className="bg-lime-50 border border-lime-100 rounded-lg p-4 mb-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-lime-800 font-medium flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-lime-600" />
                Achievement Unlocked: Perfect Score!
              </p>
            </motion.div>
          )}
          
          {isPerfect && isRetake && (
            <motion.div 
              className="bg-lime-50 border border-lime-100 rounded-lg p-4 mb-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-lime-800 font-medium flex items-center">
                <Star className="h-5 w-5 mr-2 text-lime-600" />
                Perfect retake! Your knowledge is solid.
              </p>
            </motion.div>
          )}
          
          <div className="flex justify-center">
            <motion.button
              className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-2 rounded-lg font-medium flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
            >
              <Star className="h-4 w-4 mr-2" />
              Continue
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 