import { motion, AnimatePresence } from "framer-motion";
import { useState, ReactNode } from "react";

interface AnimatedTooltipProps {
  children: ReactNode;
  content: string | ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

const AnimatedTooltip = ({
  children,
  content,
  position = "top",
  delay = 500,
}: AnimatedTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const positions = {
    top: {
      initial: { opacity: 0, y: 10, x: "-50%" },
      animate: { opacity: 1, y: 0, x: "-50%" },
      className: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    },
    bottom: {
      initial: { opacity: 0, y: -10, x: "-50%" },
      animate: { opacity: 1, y: 0, x: "-50%" },
      className: "top-full left-1/2 -translate-x-1/2 mt-2",
    },
    left: {
      initial: { opacity: 0, x: 10, y: "-50%" },
      animate: { opacity: 1, x: 0, y: "-50%" },
      className: "right-full top-1/2 -translate-y-1/2 mr-2",
    },
    right: {
      initial: { opacity: 0, x: -10, y: "-50%" },
      animate: { opacity: 1, x: 0, y: "-50%" },
      className: "left-full top-1/2 -translate-y-1/2 ml-2",
    },
  };

  const arrowPositions = {
    top: "top-full left-1/2 -translate-x-1/2 -mt-1",
    bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-1",
    left: "left-full top-1/2 -translate-y-1/2 -ml-1",
    right: "right-full top-1/2 -translate-y-1/2 -mr-1",
  };

  const arrowStyles = {
    top: "border-t-gray-900 border-x-transparent border-b-transparent",
    bottom: "border-b-gray-900 border-x-transparent border-t-transparent",
    left: "border-l-gray-900 border-y-transparent border-r-transparent",
    right: "border-r-gray-900 border-y-transparent border-l-transparent",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 pointer-events-none ${positions[position].className}`}
            initial={positions[position].initial}
            animate={positions[position].animate}
            exit={positions[position].initial}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          >
            {/* Tooltip content */}
            <motion.div
              className="relative bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl whitespace-nowrap"
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: 1,
                boxShadow: [
                  "0 10px 25px rgba(0,0,0,0.2)",
                  "0 10px 35px rgba(168,85,247,0.3)",
                  "0 10px 25px rgba(0,0,0,0.2)",
                ],
              }}
              transition={{
                scale: { duration: 0.2 },
                boxShadow: { duration: 2, repeat: Infinity },
              }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg" />
              
              {/* Content */}
              <div className="relative z-10 text-sm font-medium">
                {content}
              </div>

              {/* Arrow */}
              <div
                className={`absolute w-0 h-0 border-4 ${arrowPositions[position]} ${arrowStyles[position]}`}
              />

              {/* Sparkle decoration */}
              <motion.div
                className="absolute -top-1 -right-1 text-xs"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                ✨
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedTooltip;
