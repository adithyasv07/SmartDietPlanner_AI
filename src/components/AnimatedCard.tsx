import { motion, useMotionValue, useTransform } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedCard = ({ children, className = "", delay = 0 }: AnimatedCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ scale: 1.02 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          x.set(e.clientX - centerX);
          y.set(e.clientY - centerY);
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        className="relative"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg opacity-0"
          whileHover={{ opacity: 0.3 }}
          transition={{ duration: 0.3 }}
          style={{ filter: "blur(20px)" }}
        />
        
        {/* Card content */}
        <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          />
          
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
                animation: "shine 1s ease-in-out",
              }}
            />
          </motion.div>
          
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedCard;
