import { motion } from "framer-motion";

const ScannerLoading = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative">
        {/* Scanning animation */}
        <motion.div className="relative w-64 h-64">
          {/* Scanner frame */}
          <div className="absolute inset-0 border-4 border-green-400 rounded-lg">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-lg" />
          </div>

          {/* Scanning line */}
          <motion.div
            className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent"
            animate={{
              y: [8, 248, 8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              boxShadow: "0 0 20px rgba(74, 222, 128, 0.8)",
            }}
          />

          {/* Center icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div className="text-6xl">🍎</div>
          </motion.div>

          {/* Rotating circles */}
          <motion.svg
            className="absolute inset-0 w-full h-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="rgba(74, 222, 128, 0.2)"
              strokeWidth="2"
              strokeDasharray="10 5"
            />
          </motion.svg>

          <motion.svg
            className="absolute inset-0 w-full h-full"
            animate={{ rotate: -360 }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <circle
              cx="128"
              cy="128"
              r="100"
              fill="none"
              stroke="rgba(74, 222, 128, 0.3)"
              strokeWidth="2"
              strokeDasharray="5 10"
            />
          </motion.svg>
        </motion.div>

        {/* Loading text */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">
            Analyzing Your Food
          </h3>
          <p className="text-gray-300 mb-4">
            AI is identifying nutrients and ingredients...
          </p>
          
          {/* Progress dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ScannerLoading;
