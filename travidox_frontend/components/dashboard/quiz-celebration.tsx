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
              colors: ['#FFD700', '#FFA500', '#FF4500', '#FF6347', '#FF8C00'],
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
            origin: { y: 0.6 }
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
        <div className={`${isRetake ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-blue-600 to-purple-600'} py-6 px-4 text-white text-center`}>
          <div className="flex justify-center mb-4">
            {isRetake ? (
              <div className="h-20 w-20 rounded-full bg-indigo-400 flex items-center justify-center">
                <RefreshCw className="h-12 w-12 text-white" />
              </div>
            ) : isPerfect ? (
              <div className="h-20 w-20 rounded-full bg-yellow-500 flex items-center justify-center">
                <Trophy className="h-12 w-12 text-white" />
              </div>
            ) : isExcellent ? (
              <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center">
                <Medal className="h-12 w-12 text-white" />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-full bg-green-500 flex items-center justify-center">
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
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                    : isExcellent 
                      ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                      : 'bg-gradient-to-r from-green-400 to-green-600'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
          
          {isRetake ? (
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                <RefreshCw className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-indigo-800">Quiz Retake Complete</p>
                <p className="text-sm text-indigo-600">No additional XP for retakes</p>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">+{xpEarned} XP Earned!</p>
                <p className="text-sm text-green-600">Added to your profile</p>
              </div>
            </div>
          )}
          
          {isPerfect && !isRetake && (
            <motion.div 
              className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-yellow-800 font-medium flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                Achievement Unlocked: Perfect Score!
              </p>
            </motion.div>
          )}
          
          {isPerfect && isRetake && (
            <motion.div 
              className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-purple-800 font-medium flex items-center">
                <Star className="h-5 w-5 mr-2 text-purple-600" />
                Perfect retake! Your knowledge is solid.
              </p>
            </motion.div>
          )}
          
          <div className="flex justify-center">
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center"
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