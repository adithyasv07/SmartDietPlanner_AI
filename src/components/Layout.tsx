import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Menu, Moon, Plus, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import PageTransition from './PageTransition';
import PlateAndFork from './icons/PlateAndFork';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    // Check authentication
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate('/');
      } else {
        setUser(user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate('/');
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Food Scanner', path: '/scanner' },
    { name: 'Meal Plans', path: '/meal-plans' },
    { name: 'Progress', path: '/progress' },
    { name: 'Profile', path: '/profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen relative bg-background">
  <AnimatedBackground />

  <header
    className="bg-white/80 dark:bg-[#000000] backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/20 dark:border-b dark:border-[#1a1a1a]"
  >
    <div className="container mx-auto px-4 py-4">

      {/* Top navigation row */}
      <div className="flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <PlateAndFork
              className="w-6 h-6 text-white"
              size={24}
            />
          </div>

          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Eatellect
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg transition-all hover:bg-primary/10 ${
                isActive(item.path)
                  ? "text-primary font-semibold border-b-2 border-primary"
                  : "text-gray-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center gap-3">

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden rounded-full border-2 border-primary/20"
            onClick={() =>
              setIsMobileMenuOpen(!isMobileMenuOpen)
            }
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-primary" />
            ) : (
              <Menu className="w-5 h-5 text-primary" />
            )}
          </Button>

          {/* Dark Mode */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="rounded-full hover:bg-primary/10 border-2 border-primary/20"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-primary" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
          </Button>

          {/* Logout */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            className="rounded-full hover:bg-destructive/10 border-2 border-primary/20"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-primary" />
          </Button>

          {/* Profile */}
          <Avatar
            className="cursor-pointer hover:ring-2 ring-primary transition-all"
            onClick={() => navigate("/profile")}
          >
            <AvatarFallback className="bg-primary text-white">
              {user?.email?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden mt-4 pt-3 border-t border-primary/10">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-gray-600 hover:bg-primary/10"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      )}

    </div>
  </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      <Button
        onClick={() => navigate('/scanner')}
        size="icon"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform animate-scale-in"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default Layout;
