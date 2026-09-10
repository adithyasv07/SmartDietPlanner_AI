import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

const Confetti = ({ active, duration = 3000 }: ConfettiProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (active) {
      const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#FFD700", "#FF69B4"];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-3 h-3"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 20,
                rotate: Math.random() * 720 - 360,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: duration / 1000,
                delay: particle.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                backgroundColor: particle.color,
                borderRadius: Math.random() > 0.5 ? "50%" : "0%",
              }}
            />
          ))}
          
          {/* Celebration text */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              🎉 Awesome! 🎉
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Confetti;
