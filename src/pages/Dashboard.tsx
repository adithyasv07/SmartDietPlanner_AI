import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flame, Droplet, Apple, Dumbbell, Plus, Trash2, TrendingUp, Target, Coffee, Utensils, Cookie, Salad, Egg, Fish, Beef, ChefHat, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNutrition } from '@/contexts/NutritionContext';
import AddMealDialog from '@/components/AddMealDialog';
import { useState, useEffect } from 'react';
import AnimatedCard from '@/components/AnimatedCard';
import AnimatedProgressRing from '@/components/AnimatedProgressRing';
import SimpleFoodIcon from '@/components/SimpleFoodIcon';
import AnimatedTooltip from '@/components/AnimatedTooltip';
import Confetti from '@/components/Confetti';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { currentDay, goals, addWater, getMealsByType, removeMeal, clearMealsByType, getProgress, getWeeklyStats, addMeal } = useNutrition();
  const [waterAnimation, setWaterAnimation] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast');
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();
  const progress = getProgress();
  const weeklyStats = getWeeklyStats();

  // Check for achievements
  useEffect(() => {
    if (progress.calories >= 100 && progress.protein >= 100 && progress.carbs >= 100 && progress.fats >= 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [progress]);

  // Quick add foods organized by category
  const quickAddFoods = {
    breakfast: [
      { name: 'Oatmeal with Milk', calories: 150, protein: 6, carbs: 27, fats: 3, icon: '🥣' },
      { name: 'Scrambled Eggs (2)', calories: 180, protein: 12, carbs: 2, fats: 14, icon: '🍳' },
      { name: 'Toast with Butter (2 slices)', calories: 200, protein: 4, carbs: 24, fats: 10, icon: '🍞' },
      { name: 'Banana', calories: 105, protein: 1, carbs: 27, fats: 0, icon: '🍌' },
      { name: 'Greek Yogurt', calories: 100, protein: 10, carbs: 6, fats: 0, icon: '🥛' },
      { name: 'Cornflakes with Milk', calories: 180, protein: 5, carbs: 32, fats: 2, icon: '🥣' },
      { name: 'Idli (2 pieces)', calories: 120, protein: 3, carbs: 25, fats: 1, icon: '🍚' },
      { name: 'Dosa', calories: 140, protein: 4, carbs: 20, fats: 5, icon: '🫓' },
      { name: 'Poha', calories: 180, protein: 3, carbs: 30, fats: 5, icon: '🍛' },
      { name: 'Upma', calories: 170, protein: 4, carbs: 28, fats: 5, icon: '🍲' },
    ],
    lunch: [
      { name: 'Chicken Breast (Grilled)', calories: 165, protein: 31, carbs: 0, fats: 4, icon: '🍗' },
      { name: 'Rice (1 cup)', calories: 205, protein: 4, carbs: 45, fats: 0, icon: '🍚' },
      { name: 'Dal (1 bowl)', calories: 150, protein: 9, carbs: 20, fats: 3, icon: '🍛' },
      { name: 'Roti (2 pieces)', calories: 140, protein: 4, carbs: 30, fats: 1, icon: '🫓' },
      { name: 'Mixed Vegetables', calories: 80, protein: 2, carbs: 15, fats: 2, icon: '🥗' },
      { name: 'Paneer Curry', calories: 250, protein: 12, carbs: 10, fats: 18, icon: '🍛' },
      { name: 'Chicken Curry', calories: 280, protein: 25, carbs: 8, fats: 16, icon: '🍗' },
      { name: 'Fish Curry', calories: 200, protein: 22, carbs: 5, fats: 10, icon: '🐟' },
      { name: 'Biryani (1 plate)', calories: 400, protein: 15, carbs: 55, fats: 15, icon: '🍛' },
      { name: 'Curd Rice', calories: 180, protein: 6, carbs: 30, fats: 4, icon: '🍚' },
    ],
    dinner: [
      { name: 'Grilled Salmon', calories: 200, protein: 22, carbs: 0, fats: 12, icon: '🐟' },
      { name: 'Quinoa Salad', calories: 220, protein: 8, carbs: 39, fats: 4, icon: '🥗' },
      { name: 'Vegetable Soup', calories: 80, protein: 2, carbs: 15, fats: 2, icon: '🍲' },
      { name: 'Chapati (2 pieces)', calories: 140, protein: 4, carbs: 30, fats: 1, icon: '🫓' },
      { name: 'Khichdi', calories: 200, protein: 6, carbs: 35, fats: 4, icon: '🍛' },
      { name: 'Egg Curry', calories: 220, protein: 14, carbs: 8, fats: 15, icon: '🥚' },
      { name: 'Palak Paneer', calories: 230, protein: 10, carbs: 12, fats: 16, icon: '🥬' },
      { name: 'Tandoori Chicken', calories: 260, protein: 30, carbs: 5, fats: 14, icon: '🍗' },
      { name: 'Vegetable Pulao', calories: 250, protein: 5, carbs: 45, fats: 6, icon: '🍚' },
      { name: 'Moong Dal', calories: 140, protein: 8, carbs: 22, fats: 2, icon: '🍛' },
    ],
    snacks: [
      { name: 'Apple', calories: 95, protein: 0, carbs: 25, fats: 0, icon: '🍎' },
      { name: 'Almonds (10 pieces)', calories: 70, protein: 3, carbs: 3, fats: 6, icon: '🥜' },
      { name: 'Protein Bar', calories: 200, protein: 20, carbs: 22, fats: 7, icon: '🍫' },
      { name: 'Samosa (1 piece)', calories: 150, protein: 3, carbs: 20, fats: 7, icon: '🥟' },
      { name: 'Bhel Puri', calories: 180, protein: 4, carbs: 30, fats: 5, icon: '🍿' },
      { name: 'Fruit Salad', calories: 100, protein: 1, carbs: 24, fats: 0, icon: '🍓' },
      { name: 'Roasted Peanuts', calories: 160, protein: 7, carbs: 6, fats: 14, icon: '🥜' },
      { name: 'Dhokla (2 pieces)', calories: 120, protein: 4, carbs: 20, fats: 2, icon: '🧁' },
      { name: 'Tea with Biscuits', calories: 150, protein: 2, carbs: 22, fats: 6, icon: '☕' },
      { name: 'Banana Shake', calories: 180, protein: 5, carbs: 35, fats: 2, icon: '🥤' },
    ],
    beverages: [
      { name: 'Coffee with Milk', calories: 50, protein: 2, carbs: 6, fats: 2, icon: '☕' },
      { name: 'Green Tea', calories: 2, protein: 0, carbs: 0, fats: 0, icon: '🍵' },
      { name: 'Orange Juice', calories: 110, protein: 2, carbs: 26, fats: 0, icon: '🥤' },
      { name: 'Lassi', calories: 140, protein: 5, carbs: 20, fats: 4, icon: '🥛' },
      { name: 'Coconut Water', calories: 45, protein: 1, carbs: 9, fats: 0, icon: '🥥' },
      { name: 'Protein Shake', calories: 180, protein: 25, carbs: 10, fats: 3, icon: '🥤' },
      { name: 'Buttermilk', calories: 40, protein: 2, carbs: 5, fats: 1, icon: '🥛' },
      { name: 'Mango Shake', calories: 200, protein: 4, carbs: 40, fats: 3, icon: '🥭' },
    ],
  };

  const handleQuickAdd = (food: any, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks') => {
    addMeal({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
      mealType: mealType,
    });
    
    toast({
      title: `Added to ${mealType}`,
      description: `${food.name} has been added to your ${mealType}`,
    });
  };

  const stats = [
    { 
      icon: Flame, 
      label: 'Calories', 
      value: `${currentDay.calories} / ${goals.calories}`, 
      color: 'text-red-500',
      progress: progress.calories,
      unit: 'cal'
    },
    { 
      icon: Dumbbell, 
      label: 'Protein', 
      value: `${currentDay.protein}g / ${goals.protein}g`, 
      color: 'text-blue-500',
      progress: progress.protein,
      unit: 'g'
    },
    { 
      icon: Apple, 
      label: 'Carbs', 
      value: `${currentDay.carbs}g / ${goals.carbs}g`, 
      color: 'text-orange-500',
      progress: progress.carbs,
      unit: 'g'
    },
    { 
      icon: Droplet, 
      label: 'Water', 
      value: `${currentDay.water} / ${goals.water}`, 
      color: 'text-cyan-500',
      progress: progress.water,
      unit: 'glasses'
    },
  ];

  const meals = [
    { type: 'breakfast' as const, name: 'Breakfast', icon: '☀️' },
    { type: 'lunch' as const, name: 'Lunch', icon: '🌤️' },
    { type: 'dinner' as const, name: 'Dinner', icon: '🌙' },
    { type: 'snacks' as const, name: 'Snacks', icon: '🍎' },
  ];

  const handleAddWater = () => {
    addWater(1);
    setWaterAnimation(true);
    setTimeout(() => setWaterAnimation(false), 500);
  };

  const calculateMealCalories = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks') => {
    const mealItems = getMealsByType(mealType);
    return mealItems.reduce((total, item) => total + item.calories, 0);
  };

  return (
    <>
      <Confetti active={showConfetti} />
      <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-4xl font-bold">Daily Dashboard</h1>
        <div className="flex gap-2">
          <Card className="px-4 py-2 dark:bg-[#0d0d0d]">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">7-Day Avg</p>
                <p className="text-sm font-bold">{weeklyStats.avgCalories} cal</p>
              </div>
            </div>
          </Card>
          <Card className="px-4 py-2 dark:bg-[#0d0d0d]">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Daily Goal</p>
                <p className="text-sm font-bold">{goals.calories} cal</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <AnimatedCard
            key={stat.label}
            className="w-full"
            delay={index * 0.1}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-3">
                <AnimatedTooltip content={`Track your daily ${stat.label.toLowerCase()}`}>
                  <div className={`p-3 rounded-full bg-secondary ${stat.color}`}>
                    <stat.icon className={`w-6 h-6 ${stat.label === 'Water' && waterAnimation ? 'animate-pulse' : ''}`} />
                  </div>
                </AnimatedTooltip>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold text-card-foreground">{stat.value}</p>
                </div>
              </div>
              
              <Progress 
                value={Math.min(100, stat.progress)} 
                className="h-2 mb-2"
              />
              <p className="text-xs text-muted-foreground text-right">
                {Math.round(stat.progress)}% of daily goal
              </p>
              
              {stat.label === 'Water' && (
                <Button 
                  className="w-full mt-3" 
                  size="sm"
                  onClick={handleAddWater}
                  variant={currentDay.water >= goals.water ? 'secondary' : 'default'}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Glass
                </Button>
              )}
              
              {stat.progress > 100 && (
                <Badge className="absolute top-2 right-2" variant="destructive">
                  Over limit
                </Badge>
              )}
            </CardContent>
          </AnimatedCard>
        ))}
      </div>

      <Card className="dark:bg-[#0d0d0d] dark:border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            Today's Meals
            <span>🍽️</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {meals.map((meal) => {
              const mealItems = getMealsByType(meal.type);
              const mealCalories = calculateMealCalories(meal.type);
              const hasItems = mealItems.length > 0;
              
              return (
                <div
                  key={meal.type}
                  className="bg-secondary dark:bg-[#0d0d0d] dark:border-0 rounded-xl p-4 hover:bg-muted dark:hover:bg-[#111111] relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <SimpleFoodIcon emoji={meal.icon} size="sm" />
                      <h3 className="font-semibold text-base text-card-foreground">{meal.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={hasItems ? 'default' : 'secondary'}>
                        {mealCalories} cal
                      </Badge>
                      {hasItems && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                              title={`Clear all ${meal.name} items`}
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="ml-1 text-xs">Clear</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Clear all {meal.name} items?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove all {mealItems.length} item{mealItems.length > 1 ? 's' : ''} from your {meal.name}, totaling {mealCalories} calories.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => clearMealsByType(meal.type)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Clear All
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                    {hasItems ? (
                      mealItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-xs bg-background/50 dark:bg-[#1a1a1a] rounded p-2">
                          <div className="flex-1">
                            <p className="font-medium truncate">{item.name}</p>
                            <p className="text-muted-foreground">{item.calories} cal</p>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 className="w-3 h-3 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove {item.name}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove {item.name} ({item.calories} calories) from your {meal.name}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => removeMeal(item.id)}>
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No items logged
                      </p>
                    )}
                  </div>
                  
                  <AddMealDialog mealType={meal.type} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-[#0d0d0d]">
        <CardHeader>
          <CardTitle className="text-xl">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-secondary dark:bg-[#0d0d0d] rounded-lg">
              <p className="text-2xl font-bold text-green-500">
                {Math.round((currentDay.calories / goals.calories) * 100)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Daily Progress</p>
            </div>
            <div className="text-center p-3 bg-secondary dark:bg-[#0d0d0d] rounded-lg">
              <p className="text-2xl font-bold text-blue-500">
                {weeklyStats.totalDays}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Days Tracked</p>
            </div>
            <div className="text-center p-3 bg-secondary dark:bg-[#0d0d0d] rounded-lg">
              <p className="text-2xl font-bold text-orange-500">
                {goals.calories - currentDay.calories}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Calories Left</p>
            </div>
            <div className="text-center p-3 bg-secondary dark:bg-[#0d0d0d] rounded-lg">
              <p className="text-2xl font-bold text-cyan-500">
                {currentDay.water}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Water Glasses</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Foods Section */}
      <Card className="dark:bg-[#0d0d0d]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <ChefHat className="w-6 h-6" />
                Quick Add Foods
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Tap any food to quickly add it to your meals
              </p>
            </div>
            <Select value={selectedMealType} onValueChange={(value: any) => setSelectedMealType(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
                <SelectItem value="lunch">☀️ Lunch</SelectItem>
                <SelectItem value="dinner">🌙 Dinner</SelectItem>
                <SelectItem value="snacks">🍿 Snacks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="breakfast" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="breakfast" className="text-xs">
                <Coffee className="w-3 h-3 mr-1" />
                Breakfast
              </TabsTrigger>
              <TabsTrigger value="lunch" className="text-xs">
                <Utensils className="w-3 h-3 mr-1" />
                Lunch
              </TabsTrigger>
              <TabsTrigger value="dinner" className="text-xs">
                <Utensils className="w-3 h-3 mr-1" />
                Dinner
              </TabsTrigger>
              <TabsTrigger value="snacks" className="text-xs">
                <Cookie className="w-3 h-3 mr-1" />
                Snacks
              </TabsTrigger>
              <TabsTrigger value="beverages" className="text-xs">
                <Coffee className="w-3 h-3 mr-1" />
                Drinks
              </TabsTrigger>
            </TabsList>

            {Object.entries(quickAddFoods).map(([category, foods]) => (
              <TabsContent key={category} value={category} className="mt-4">
                <ScrollArea className="h-[280px] w-full pr-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {foods.map((food, index) => (
                      <Card
                        key={index}
                        className="p-3 cursor-pointer hover:shadow-md transition-all hover:scale-105 group"
                        onClick={() => handleQuickAdd(food, selectedMealType)}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{food.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                              {food.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {food.calories} cal
                              </Badge>
                            </div>
                            <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Dumbbell className="w-3 h-3" />
                                {food.protein}g
                              </span>
                              <span className="flex items-center gap-1">
                                <Apple className="w-3 h-3" />
                                {food.carbs}g
                              </span>
                              <span className="flex items-center gap-1">
                                <Droplet className="w-3 h-3" />
                                {food.fats}g
                              </span>
                            </div>
                          </div>
                          <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="mt-3 p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    Items will be added to: 
                    <Badge variant="outline" className="text-xs">
                      {selectedMealType === 'breakfast' ? '🌅 Breakfast' :
                       selectedMealType === 'lunch' ? '☀️ Lunch' :
                       selectedMealType === 'dinner' ? '🌙 Dinner' : '🍿 Snacks'}
                    </Badge>
                  </p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default Dashboard;
