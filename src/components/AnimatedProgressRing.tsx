import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  icon?: React.ReactNode;
  showPercentage?: boolean;
}

const AnimatedProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = "url(#gradient)",
  backgroundColor = "#e5e7eb",
  label,
  icon,
  showPercentage = true,
}: AnimatedProgressRingProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{ scale: 1.05 }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
          style={{
            strokeDasharray: circumference,
          }}
        />
        
        {/* Glow effect */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth * 2}
          fill="none"
          strokeLinecap="round"
          initial={{ opacity: 0, strokeDashoffset: circumference }}
          animate={{ 
            opacity: [0, 0.3, 0],
            strokeDashoffset,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            strokeDasharray: circumference,
            filter: "blur(8px)",
          }}
        />
      </svg>
      
      {/* Center content */}
      <motion.div
        className="absolute flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {icon && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {icon}
          </motion.div>
        )}
        
        {showPercentage && (
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.8,
              type: "spring",
              stiffness: 200,
            }}
          >
            {Math.round(animatedProgress)}%
          </motion.div>
        )}
        
        {label && (
          <motion.div
            className="text-xs text-gray-600 mt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {label}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedProgressRing;
