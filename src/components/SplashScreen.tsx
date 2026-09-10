import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlateAndFork from './icons/PlateAndFork';

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1500),
      setTimeout(() => setStage(3), 2500),
      setTimeout(() => onComplete(), 4000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(255, 219, 98, 0.3) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 20,
              }}
              animate={{
                y: -20,
                x: Math.random() * window.innerWidth,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center">
          {/* Logo animation */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: stage >= 0 ? 1 : 0, 
              rotate: stage >= 0 ? 0 : -180 
            }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              duration: 1 
            }}
          >
            <motion.div
              className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(255,255,255,0.5)",
                  "0 0 60px rgba(255,255,255,0.8)",
                  "0 0 20px rgba(255,255,255,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <PlateAndFork className="text-white" size={64} />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Title animation */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: stage >= 1 ? 1 : 0, 
              y: stage >= 1 ? 0 : 20 
            }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="inline-block"
              animate={{
                backgroundImage: [
                  "linear-gradient(45deg, #fff, #fff)",
                  "linear-gradient(45deg, #ffd700, #ff6b6b)",
                  "linear-gradient(45deg, #4ecdc4, #44a8ff)",
                  "linear-gradient(45deg, #fff, #fff)",
                ],
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Eatellect
            </motion.span>
          </motion.h1>

          {/* Tagline animation */}
          <motion.p
            className="text-xl md:text-2xl text-white/90 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: stage >= 2 ? 1 : 0, 
              y: stage >= 2 ? 0 : 20 
            }}
            transition={{ duration: 0.8 }}
          >
            Your AI-Powered Nutrition Companion
          </motion.p>

          {/* Loading animation */}
          <motion.div
            className="flex justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 3 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Circular waves */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute border-2 border-white/20 rounded-full"
              initial={{ width: 0, height: 0 }}
              animate={{
                width: [0, 600, 800],
                height: [0, 600, 800],
                opacity: [0.8, 0.3, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
