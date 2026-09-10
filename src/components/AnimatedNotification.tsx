import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

interface AnimatedNotificationProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  show: boolean;
}

const AnimatedNotification = ({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  show,
}: AnimatedNotificationProps) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <XCircle className="w-6 h-6" />,
    warning: <AlertCircle className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />,
  };

  const colors = {
    success: "from-green-400 to-emerald-500",
    error: "from-red-400 to-rose-500",
    warning: "from-yellow-400 to-orange-500",
    info: "from-blue-400 to-indigo-500",
  };

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-[90] max-w-md"
          initial={{ x: 400, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 400, opacity: 0, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
        >
          <motion.div
            className={`relative overflow-hidden rounded-lg shadow-2xl ${bgColors[type]} border backdrop-blur-sm`}
            whileHover={{ scale: 1.02 }}
            layout
          >
            {/* Animated gradient bar */}
            <motion.div
              className={`absolute top-0 left-0 h-1 bg-gradient-to-r ${colors[type]}`}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{
                duration: duration / 1000,
                ease: "linear",
              }}
            />

            {/* Glow effect */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${colors[type]} opacity-10`}
              animate={{
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative p-4">
              <div className="flex items-start">
                {/* Animated icon */}
                <motion.div
                  className={`flex-shrink-0 bg-gradient-to-r ${colors[type]} text-white p-2 rounded-full`}
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1,
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.5,
                    }}
                  >
                    {icons[type]}
                  </motion.div>
                </motion.div>

                {/* Content */}
                <div className="ml-3 flex-1">
                  <motion.h3
                    className="text-sm font-semibold text-gray-900"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {title}
                  </motion.h3>
                  {message && (
                    <motion.p
                      className="mt-1 text-sm text-gray-600"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {message}
                    </motion.p>
                  )}
                </div>

                {/* Close button */}
                <motion.button
                  className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => {
                    setIsVisible(false);
                    onClose?.();
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Sparkle effects */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ✨
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedNotification;
