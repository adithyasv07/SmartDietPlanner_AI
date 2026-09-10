import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Apple, Carrot, Cherry } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PlateAndFork from '@/components/icons/PlateAndFork';

const Auth = () => {
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Account created successfully. You can now log in.",
        });
        
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400"
        animate={{
          background: [
            "linear-gradient(to bottom right, #9333ea, #ec4899, #fb923c)",
            "linear-gradient(to bottom right, #ec4899, #fb923c, #9333ea)",
            "linear-gradient(to bottom right, #fb923c, #9333ea, #ec4899)",
            "linear-gradient(to bottom right, #9333ea, #ec4899, #fb923c)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating food icons */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
            }}
            animate={{
              y: -100,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear",
            }}
          >
            {['🥗', '🍎', '🥕', '🍊', '🥦', '🍇', '🥑', '🍓'][i % 8]}
          </motion.div>
        ))}
      </div>

      {/* Glowing orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
      />
      
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md backdrop-blur-xl bg-white/90 dark:bg-gray-900/95 shadow-2xl border-0">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              className="relative w-20 h-20 mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(168, 85, 247, 0.5)",
                    "0 0 40px rgba(236, 72, 153, 0.5)",
                    "0 0 20px rgba(168, 85, 247, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <PlateAndFork className="w-12 h-12 text-white" size={48} />
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Eatellect
            </motion.h1>
            <motion.p 
              className="text-gray-700 dark:text-gray-300 font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Your AI-Powered Nutrition Companion
            </motion.p>
          </div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              className="space-y-2"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Input
                type="email"
                placeholder="Email"
                className="h-12 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-600 dark:placeholder:text-gray-400 font-medium border-gray-300 dark:border-gray-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Input
                type="password"
                placeholder="Password"
                className="h-12 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-600 dark:placeholder:text-gray-400 font-medium border-gray-300 dark:border-gray-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isLogin ? 'Logging in...' : 'Creating account...'}
                  </>
                ) : (
                  <>{isLogin ? 'Login' : 'Sign Up'}</>
                )}
              </Button>
            </motion.div>
          </motion.form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary dark:text-green-400 hover:underline font-bold"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
  );
};

export default Auth;
