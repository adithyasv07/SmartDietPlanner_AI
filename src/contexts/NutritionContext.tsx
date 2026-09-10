import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MealItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  timestamp: Date;
}

interface DailyNutrition {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  water: number; // in glasses
  meals: MealItem[];
}

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  water: number;
}

interface WeeklyData {
  [date: string]: DailyNutrition;
}

interface NutritionContextType {
  currentDay: DailyNutrition;
  weeklyData: WeeklyData;
  goals: NutritionGoals;
  addMeal: (meal: Omit<MealItem, 'id' | 'timestamp'>) => void;
  removeMeal: (mealId: string) => void;
  clearMealsByType: (type: MealItem['mealType']) => void;
  addWater: (glasses: number) => void;
  updateGoals: (newGoals: Partial<NutritionGoals>) => void;
  getMealsByType: (type: MealItem['mealType']) => MealItem[];
  getProgress: () => {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    water: number;
  };
  resetDay: () => void;
  getWeeklyStats: () => {
    avgCalories: number;
    avgProtein: number;
    avgCarbs: number;
    avgFats: number;
    avgWater: number;
    totalDays: number;
  };
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

const getToday = () => new Date().toISOString().split('T')[0];

const getDefaultDailyNutrition = (): DailyNutrition => ({
  date: getToday(),
  calories: 0,
  protein: 0,
  carbs: 0,
  fats: 0,
  water: 0,
  meals: [],
});

const defaultGoals: NutritionGoals = {
  calories: 2000,
  protein: 50,
  carbs: 250,
  fats: 65,
  water: 8,
};

function computeCalorieTargetFromProfile(profile: any): number | null {
  const sex: string | undefined = profile?.sex;
  const age: number | undefined = profile?.age;
  const weightKg: number | undefined = profile?.weight_kg;
  const heightCm: number | undefined = profile?.height_cm;
  const goal: string | undefined = profile?.dietary_goal;

  if (!sex || age == null || weightKg == null || heightCm == null) return null;

  const sexConst = sex === 'male' ? 5 : sex === 'female' ? -161 : 0;
  // Mifflin-St Jeor BMR
  const bmr = 10 * Number(weightKg) + 6.25 * Number(heightCm) - 5 * Number(age) + sexConst;
  // No activity multiplier requested; adjust for goal
  let target = bmr;
  if (goal === 'weight-loss') target = bmr - 500;
  if (goal === 'muscle-gain') target = bmr + 500;
  // Clamp to reasonable range
  target = Math.max(1200, Math.min(4500, Math.round(target)));
  return target;
}

export const NutritionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [currentDay, setCurrentDay] = useState<DailyNutrition>(getDefaultDailyNutrition());
  const [weeklyData, setWeeklyData] = useState<WeeklyData>({});
  const [goals, setGoals] = useState<NutritionGoals>(defaultGoals);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage and user profile on mount
  useEffect(() => {
    const loadData = async () => {
      // First load from localStorage
      const loadedData = localStorage.getItem('nutritionData');
      const loadedGoals = localStorage.getItem('nutritionGoals');
      
      if (loadedData) {
        const parsed = JSON.parse(loadedData);
        setWeeklyData(parsed.weeklyData || {});
        
        // Check if we have data for today
        const today = getToday();
        if (parsed.weeklyData && parsed.weeklyData[today]) {
          setCurrentDay(parsed.weeklyData[today]);
        }
      }
      
      // Load goals from localStorage first
      if (loadedGoals) {
        setGoals(JSON.parse(loadedGoals));
      }
      
      // Then try to load user's profile from Supabase
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (!error && profile) {
            // Determine calorie target: auto-calc if enabled and enough data, else use saved value
            let calorieTarget = profile.daily_calorie_target || 2000;
            if (profile.auto_calc_calories) {
              const computed = computeCalorieTargetFromProfile(profile);
              if (computed) calorieTarget = computed;
            }

            const userGoals: NutritionGoals = {
              calories: calorieTarget,
              protein: Math.round(calorieTarget * 0.025), // ~10% of calories from protein (4 cal/g)
              carbs: Math.round(calorieTarget * 0.125), // ~50% of calories from carbs (4 cal/g)
              fats: Math.round(calorieTarget * 0.0361), // ~30% of calories from fats (9 cal/g)
              water: profile.daily_water_target || 8,
            };
            
            // Adjust macros based on dietary goal
            if (profile.dietary_goal === 'muscle-gain') {
              userGoals.protein = Math.round(calorieTarget * 0.035); // Higher protein for muscle gain
              userGoals.carbs = Math.round(calorieTarget * 0.15); // More carbs for energy
            } else if (profile.dietary_goal === 'weight-loss') {
              userGoals.protein = Math.round(calorieTarget * 0.03); // Higher protein to preserve muscle
              userGoals.carbs = Math.round(calorieTarget * 0.1); // Lower carbs
              userGoals.fats = Math.round(calorieTarget * 0.033); // Moderate fats
            }
            
            setGoals(userGoals);
            localStorage.setItem('nutritionGoals', JSON.stringify(userGoals));
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Set up real-time subscription for profile changes
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
        },
        async (payload) => {
          if (payload.new) {
            // Update goals when profile changes
            const profile = payload.new as any;
            let calorieTarget = profile.daily_calorie_target || 2000;
            if (profile.auto_calc_calories) {
              const computed = computeCalorieTargetFromProfile(profile);
              if (computed) calorieTarget = computed;
            }
            const userGoals: NutritionGoals = {
              calories: calorieTarget,
              protein: Math.round(calorieTarget * 0.025),
              carbs: Math.round(calorieTarget * 0.125),
              fats: Math.round(calorieTarget * 0.0361),
              water: profile.daily_water_target || 8,
            };
            
            if (profile.dietary_goal === 'muscle-gain') {
              userGoals.protein = Math.round(calorieTarget * 0.035);
              userGoals.carbs = Math.round(calorieTarget * 0.15);
            } else if (profile.dietary_goal === 'weight-loss') {
              userGoals.protein = Math.round(calorieTarget * 0.03);
              userGoals.carbs = Math.round(calorieTarget * 0.1);
              userGoals.fats = Math.round(calorieTarget * 0.033);
            }
            
            setGoals(userGoals);
            localStorage.setItem('nutritionGoals', JSON.stringify(userGoals));
          }
        }
      )
      .subscribe();
    
    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const today = getToday();
    const updatedWeeklyData = {
      ...weeklyData,
      [today]: currentDay,
    };
    
    // Keep only last 30 days of data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const filteredWeeklyData = Object.entries(updatedWeeklyData).reduce((acc, [date, data]) => {
      if (new Date(date) >= thirtyDaysAgo) {
        acc[date] = data;
      }
      return acc;
    }, {} as WeeklyData);
    
    setWeeklyData(filteredWeeklyData);
    
    localStorage.setItem('nutritionData', JSON.stringify({
      weeklyData: filteredWeeklyData,
    }));
  }, [currentDay]);

  useEffect(() => {
    localStorage.setItem('nutritionGoals', JSON.stringify(goals));
  }, [goals]);

  // Check if it's a new day and reset if needed
  useEffect(() => {
    const checkNewDay = () => {
      const today = getToday();
      if (currentDay.date !== today) {
        setCurrentDay(getDefaultDailyNutrition());
      }
    };

    const interval = setInterval(checkNewDay, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [currentDay.date]);

  const addMeal = (meal: Omit<MealItem, 'id' | 'timestamp'>) => {
    const newMeal: MealItem = {
      ...meal,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setCurrentDay(prev => ({
      ...prev,
      calories: prev.calories + meal.calories,
      protein: prev.protein + meal.protein,
      carbs: prev.carbs + meal.carbs,
      fats: prev.fats + meal.fats,
      meals: [...prev.meals, newMeal],
    }));

    toast({
      title: "Meal Added",
      description: `${meal.name} has been added to ${meal.mealType}`,
    });
  };

  const removeMeal = (mealId: string) => {
    const mealToRemove = currentDay.meals.find(m => m.id === mealId);
    if (!mealToRemove) return;

    setCurrentDay(prev => ({
      ...prev,
      calories: Math.max(0, prev.calories - mealToRemove.calories),
      protein: Math.max(0, prev.protein - mealToRemove.protein),
      carbs: Math.max(0, prev.carbs - mealToRemove.carbs),
      fats: Math.max(0, prev.fats - mealToRemove.fats),
      meals: prev.meals.filter(m => m.id !== mealId),
    }));

    toast({
      title: "Meal Removed",
      description: `${mealToRemove.name} has been removed`,
    });
  };

  const clearMealsByType = (type: MealItem['mealType']) => {
    const mealsToRemove = currentDay.meals.filter(m => m.mealType === type);
    
    if (mealsToRemove.length === 0) {
      toast({
        title: "No meals to clear",
        description: `No items found in ${type}`,
      });
      return;
    }

    const totalCalories = mealsToRemove.reduce((sum, meal) => sum + meal.calories, 0);
    const totalProtein = mealsToRemove.reduce((sum, meal) => sum + meal.protein, 0);
    const totalCarbs = mealsToRemove.reduce((sum, meal) => sum + meal.carbs, 0);
    const totalFats = mealsToRemove.reduce((sum, meal) => sum + meal.fats, 0);

    setCurrentDay(prev => ({
      ...prev,
      calories: Math.max(0, prev.calories - totalCalories),
      protein: Math.max(0, prev.protein - totalProtein),
      carbs: Math.max(0, prev.carbs - totalCarbs),
      fats: Math.max(0, prev.fats - totalFats),
      meals: prev.meals.filter(m => m.mealType !== type),
    }));

    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Cleared`,
      description: `Removed ${mealsToRemove.length} item${mealsToRemove.length > 1 ? 's' : ''} from ${type}`,
    });
  };

  const addWater = (glasses: number) => {
    setCurrentDay(prev => ({
      ...prev,
      water: prev.water + glasses,
    }));

    toast({
      title: "Water Intake Updated",
      description: `Added ${glasses} glass${glasses > 1 ? 'es' : ''} of water`,
    });
  };

  const updateGoals = async (newGoals: Partial<NutritionGoals>) => {
    const updatedGoals = { ...goals, ...newGoals };
    setGoals(updatedGoals);
    
    // Save to localStorage
    localStorage.setItem('nutritionGoals', JSON.stringify(updatedGoals));
    
    // Also update the user's profile if they have custom calorie/water targets
    if (newGoals.calories || newGoals.water) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const updates: any = {};
          if (newGoals.calories) updates.daily_calorie_target = newGoals.calories;
          if (newGoals.water) updates.daily_water_target = newGoals.water;
          
          await supabase
            .from('profiles')
            .update(updates)
            .eq('user_id', user.id);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
    
    toast({
      title: "Goals Updated",
      description: "Your nutrition goals have been updated",
    });
  };

  const getMealsByType = (type: MealItem['mealType']) => {
    return currentDay.meals.filter(meal => meal.mealType === type);
  };

  const getProgress = () => {
    return {
      calories: (currentDay.calories / goals.calories) * 100,
      protein: (currentDay.protein / goals.protein) * 100,
      carbs: (currentDay.carbs / goals.carbs) * 100,
      fats: (currentDay.fats / goals.fats) * 100,
      water: (currentDay.water / goals.water) * 100,
    };
  };

  const resetDay = () => {
    setCurrentDay(getDefaultDailyNutrition());
    toast({
      title: "Day Reset",
      description: "Today's nutrition data has been reset",
    });
  };

  const getWeeklyStats = () => {
    const last7Days = Object.entries(weeklyData)
      .filter(([date]) => {
        const dateObj = new Date(date);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return dateObj >= sevenDaysAgo;
      })
      .map(([, data]) => data);

    if (last7Days.length === 0) {
      return {
        avgCalories: 0,
        avgProtein: 0,
        avgCarbs: 0,
        avgFats: 0,
        avgWater: 0,
        totalDays: 0,
      };
    }

    const totals = last7Days.reduce(
      (acc, day) => ({
        calories: acc.calories + day.calories,
        protein: acc.protein + day.protein,
        carbs: acc.carbs + day.carbs,
        fats: acc.fats + day.fats,
        water: acc.water + day.water,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, water: 0 }
    );

    const days = last7Days.length;
    return {
      avgCalories: Math.round(totals.calories / days),
      avgProtein: Math.round(totals.protein / days),
      avgCarbs: Math.round(totals.carbs / days),
      avgFats: Math.round(totals.fats / days),
      avgWater: Math.round(totals.water / days),
      totalDays: days,
    };
  };

  return (
    <NutritionContext.Provider
      value={{
        currentDay,
        weeklyData,
        goals,
        addMeal,
        removeMeal,
        clearMealsByType,
        addWater,
        updateGoals,
        getMealsByType,
        getProgress,
        resetDay,
        getWeeklyStats,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (context === undefined) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};
