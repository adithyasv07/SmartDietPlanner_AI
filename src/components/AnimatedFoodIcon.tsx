import { motion } from "framer-motion";
import { useState } from "react";

interface AnimatedFoodIconProps {
  emoji: string;
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  onClick?: () => void;
  pulseColor?: string;
}

const AnimatedFoodIcon = ({
  emoji,
  size = "md",
  animate = true,
  onClick,
  pulseColor = "rgba(168, 85, 247, 0.5)",
}: AnimatedFoodIconProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const sizes = {
    sm: "text-2xl w-12 h-12",
    md: "text-4xl w-16 h-16",
    lg: "text-6xl w-24 h-24",
    xl: "text-8xl w-32 h-32",
  };

  const handleClick = () => {
    setIsClicked(true);
    onClick?.();
    setTimeout(() => setIsClicked(false), 600);
  };

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${sizes[size]} cursor-pointer select-none`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulse effect */}
      {animate && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: pulseColor }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: pulseColor }}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </>
      )}

      {/* Main emoji */}
      <motion.div
        className="relative z-10"
        animate={
          animate
            ? {
                y: [0, -5, 0],
              }
            : {}
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.span
          className="block"
          animate={isHovered ? { rotate: 360 } : {}}
          transition={{ duration: 0.5 }}
        >
          {emoji}
        </motion.span>
      </motion.div>

      {/* Click effect - stars */}
      {isClicked && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-400"
              initial={{
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI) / 3) * 50,
                y: Math.sin((i * Math.PI) / 3) * 50,
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
            >
              ⭐
            </motion.div>
          ))}
        </>
      )}

      {/* Hover effect - sparkles */}
      {isHovered && (
        <motion.div
          className="absolute -top-2 -right-2 text-xl"
          initial={{ scale: 0 }}
          animate={{
            scale: 1,
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          ✨
        </motion.div>
      )}

      {/* Shadow effect */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-black/20 rounded-full blur-md"
        style={{ transformOrigin: "center" }}
        animate={
          animate
            ? {
                scaleX: [1, 0.8, 1],
                opacity: [0.3, 0.1, 0.3],
              }
            : {}
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

export default AnimatedFoodIcon;
