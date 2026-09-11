import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Scale, TrendingUp, Dumbbell, Loader2, Droplets, Settings, Fish, Leaf, Wheat, Milk, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MealPlans = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [selectedGoal, setSelectedGoal] = useState<string>('maintain');
  const [showSettings, setShowSettings] = useState(false);
  const [dietType, setDietType] = useState<'non-vegetarian' | 'vegetarian' | 'vegan'>('non-vegetarian');
  const [editableProfile, setEditableProfile] = useState({
    dietary_goal: 'maintain',
    daily_calorie_target: 2000,
    daily_water_target: 8,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    is_dairy_free: false,
    sex: 'other' as 'male' | 'female' | 'other',
    age: 25,
    weight_kg: 70,
    height_cm: 170,
    activity_level: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
    auto_calc_calories: true,
  });

  const goals = [
    {
      id: 'weight-loss',
      icon: Scale,
      title: 'Weight Loss',
      description: 'Calorie deficit with balanced nutrition',
    },
    {
      id: 'maintain',
      icon: TrendingUp,
      title: 'Maintain',
      description: 'Balanced diet for weight maintenance',
    },
    {
      id: 'muscle-gain',
      icon: Dumbbell,
      title: 'Muscle Gain',
      description: 'High protein for muscle building',
    },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view personalized meal plans",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setProfile(data);
        setSelectedGoal(data.dietary_goal);
        setEditableProfile({
          dietary_goal: data.dietary_goal,
          daily_calorie_target: data.daily_calorie_target,
          daily_water_target: data.daily_water_target,
          is_vegetarian: data.is_vegetarian,
          is_vegan: data.is_vegan,
          is_gluten_free: data.is_gluten_free,
          is_dairy_free: data.is_dairy_free,
          sex: (data.sex ?? 'other'),
          age: (data.age ?? 25),
          weight_kg: (Number(data.weight_kg) || 70),
          height_cm: (Number(data.height_cm) || 170),
          activity_level: (data.activity_level ?? 'moderate'),
          auto_calc_calories: data.auto_calc_calories ?? true,
        });
        
        // Set diet type based on saved preferences
        if (data.is_vegan) {
          setDietType('vegan');
        } else if (data.is_vegetarian) {
          setDietType('vegetarian');
        } else {
          setDietType('non-vegetarian');
        }
      } else {
        toast({
          title: "Profile Not Found",
          description: "Please complete your profile first",
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const mealPlans = {
    'weight-loss': {
      recommended: [
        { name: 'RAMMMMMM', calories: 180, protein: '6g', description: 'Flattened rice with vegetables and spices', vegetarian: true },
        { name: 'Moong Dal Chilla', calories: 200, protein: '12g', description: 'Lentil pancakes with vegetables', vegetarian: true },
        { name: 'Masala Oats', calories: 150, protein: '8g', description: 'Oats cooked with vegetables and spices', vegetarian: true },
        { name: 'Dal Tadka with 1 Roti', calories: 280, protein: '14g', description: 'Lentil curry with whole wheat roti', vegetarian: true },
        { name: 'Tandoori Chicken (2 pcs)', calories: 220, protein: '28g', description: 'Grilled chicken marinated in spices', vegetarian: false },
        { name: 'Grilled Fish with Salad', calories: 250, protein: '30g', description: 'Indian spiced grilled fish', vegetarian: false },
      ],
      weekly: {
        Breakfast: [
          { name: 'Poha', calories: 180, vegetarian: true },
          { name: 'Upma', calories: 170, vegetarian: true },
          { name: 'Idli (2 pcs) with Sambhar', calories: 150, vegetarian: true },
          { name: 'Moong Dal Chilla', calories: 200, vegetarian: true },
          { name: 'Masala Oats', calories: 150, vegetarian: true },
          { name: 'Vegetable Dalia', calories: 160, vegetarian: true },
          { name: 'Besan Chilla', calories: 180, vegetarian: true },
        ],
        Lunch: [
          { name: 'Dal Tadka + 1 Roti', calories: 280, vegetarian: true },
          { name: 'Rajma + 1 Roti', calories: 300, vegetarian: true },
          { name: 'Chole + 1 Roti', calories: 320, vegetarian: true },
          { name: 'Palak Paneer (small) + 1 Roti', calories: 290, vegetarian: true },
          { name: 'Chicken Curry (small) + 1 Roti', calories: 350, vegetarian: false },
          { name: 'Mixed Veg + Brown Rice', calories: 270, vegetarian: true },
          { name: 'Fish Curry + 1 Roti', calories: 330, vegetarian: false },
        ],
        Dinner: [
          { name: 'Khichdi with Curd', calories: 250, vegetarian: true },
          { name: 'Grilled Paneer with Salad', calories: 240, vegetarian: true },
          { name: 'Vegetable Soup + 1 Roti', calories: 200, vegetarian: true },
          { name: 'Moong Dal + Salad', calories: 220, vegetarian: true },
          { name: 'Tandoori Chicken (2 pcs)', calories: 220, vegetarian: false },
          { name: 'Egg Bhurji + 1 Roti', calories: 260, vegetarian: false },
          { name: 'Grilled Fish with Veggies', calories: 250, vegetarian: false },
        ],
      }
    },
    'maintain': {
      recommended: [
        { name: 'Aloo Paratha with Curd', calories: 350, protein: '12g', description: 'Stuffed potato flatbread with yogurt', vegetarian: true },
        { name: 'Dal Makhani with Rice', calories: 400, protein: '16g', description: 'Creamy lentils with steamed rice', vegetarian: true },
        { name: 'Paneer Butter Masala with 2 Rotis', calories: 480, protein: '20g', description: 'Cottage cheese in rich tomato gravy', vegetarian: true },
        { name: 'Chicken Biryani (1 bowl)', calories: 450, protein: '25g', description: 'Fragrant rice with chicken', vegetarian: false },
        { name: 'Egg Curry with Rice', calories: 380, protein: '18g', description: 'Boiled eggs in spiced gravy', vegetarian: false },
        { name: 'Rajma Chawal', calories: 420, protein: '15g', description: 'Kidney beans curry with rice', vegetarian: true },
      ],
      weekly: {
        Breakfast: [
          { name: 'Aloo Paratha + Curd', calories: 350, vegetarian: true },
          { name: 'Poha with Peanuts', calories: 250, vegetarian: true },
          { name: 'Masala Dosa', calories: 300, vegetarian: true },
          { name: 'Idli (3 pcs) + Sambhar', calories: 220, vegetarian: true },
          { name: 'Egg Bhurji + 2 Bread', calories: 320, vegetarian: false },
          { name: 'Upma with Chutney', calories: 240, vegetarian: true },
          { name: 'Omelette (2 eggs) + Toast', calories: 280, vegetarian: false },
        ],
        Lunch: [
          { name: 'Dal Makhani + Rice', calories: 400, vegetarian: true },
          { name: 'Rajma Chawal', calories: 420, vegetarian: true },
          { name: 'Chole Chawal', calories: 450, vegetarian: true },
          { name: 'Paneer Butter Masala + 2 Rotis', calories: 480, vegetarian: true },
          { name: 'Chicken Curry + Rice', calories: 500, vegetarian: false },
          { name: 'Veg Biryani', calories: 430, vegetarian: true },
          { name: 'Fish Curry + Rice', calories: 470, vegetarian: false },
        ],
        Dinner: [
          { name: 'Palak Paneer + 2 Rotis', calories: 380, vegetarian: true },
          { name: 'Mixed Dal + Rice', calories: 350, vegetarian: true },
          { name: 'Aloo Gobi + 2 Rotis', calories: 340, vegetarian: true },
          { name: 'Baingan Bharta + 2 Rotis', calories: 320, vegetarian: true },
          { name: 'Chicken Tikka + 2 Rotis', calories: 420, vegetarian: false },
          { name: 'Egg Curry + Rice', calories: 380, vegetarian: false },
          { name: 'Kadhi Chawal', calories: 360, vegetarian: true },
        ],
      }
    },
    'muscle-gain': {
      recommended: [
        { name: 'Paneer Paratha (2) with Curd', calories: 550, protein: '28g', description: 'Cottage cheese stuffed flatbreads', vegetarian: true },
        { name: 'Chicken Tikka with 3 Rotis', calories: 600, protein: '45g', description: 'Grilled chicken with rotis', vegetarian: false },
        { name: 'Dal Makhani with Paneer + Rice', calories: 650, protein: '35g', description: 'Lentils with cottage cheese and rice', vegetarian: true },
        { name: 'Egg Curry (3 eggs) + Rice', calories: 550, protein: '32g', description: 'Boiled eggs in curry with rice', vegetarian: false },
        { name: 'Chana Masala + 3 Rotis', calories: 580, protein: '30g', description: 'Chickpea curry with rotis', vegetarian: true },
        { name: 'Fish Fry + Rice + Dal', calories: 620, protein: '38g', description: 'Fried fish with rice and lentils', vegetarian: false },
      ],
      weekly: {
        Breakfast: [
          { name: 'Paneer Paratha (2) + Curd', calories: 550, vegetarian: true },
          { name: 'Omelette (3 eggs) + Toast', calories: 420, vegetarian: false },
          { name: 'Besan Chilla (3) + Curd', calories: 380, vegetarian: true },
          { name: 'Masala Dosa (2)', calories: 500, vegetarian: true },
          { name: 'Egg Bhurji (3 eggs) + 3 Bread', calories: 480, vegetarian: false },
          { name: 'Poha + Peanuts + Paneer', calories: 400, vegetarian: true },
          { name: 'Upma + Boiled Eggs (2)', calories: 360, vegetarian: false },
        ],
        Lunch: [
          { name: 'Dal Makhani + Paneer + Rice', calories: 650, vegetarian: true },
          { name: 'Rajma + Rice + Curd', calories: 580, vegetarian: true },
          { name: 'Chole + Rice + Paneer', calories: 620, vegetarian: true },
          { name: 'Chicken Curry + Rice + Dal', calories: 700, vegetarian: false },
          { name: 'Paneer Butter Masala + 3 Rotis', calories: 640, vegetarian: true },
          { name: 'Egg Curry (3 eggs) + Rice', calories: 550, vegetarian: false },
          { name: 'Fish Curry + Rice + Dal', calories: 680, vegetarian: false },
        ],
        Dinner: [
          { name: 'Chicken Tikka + 3 Rotis + Dal', calories: 600, vegetarian: false },
          { name: 'Palak Paneer (large) + 3 Rotis', calories: 560, vegetarian: true },
          { name: 'Chana Masala + 3 Rotis', calories: 580, vegetarian: true },
          { name: 'Egg Biryani', calories: 520, vegetarian: false },
          { name: 'Paneer Tikka + 3 Rotis + Curd', calories: 610, vegetarian: true },
          { name: 'Fish Fry + Rice + Dal', calories: 620, vegetarian: false },
          { name: 'Mixed Dal + Rice + Paneer Bhurji', calories: 590, vegetarian: true },
        ],
      }
    }
  };

  const handleDietTypeChange = (value: string) => {
    setDietType(value as 'non-vegetarian' | 'vegetarian' | 'vegan');
    
    // Update profile based on diet type
    if (value === 'vegan') {
      setEditableProfile(prev => ({ ...prev, is_vegetarian: true, is_vegan: true, is_dairy_free: true }));
    } else if (value === 'vegetarian') {
      setEditableProfile(prev => ({ ...prev, is_vegetarian: true, is_vegan: false }));
    } else {
      setEditableProfile(prev => ({ ...prev, is_vegetarian: false, is_vegan: false }));
    }
  };

  const computeAutoCalories = () => {
    // Calculate BMR using Mifflin-St Jeor Equation
    const sexConst = editableProfile.sex === 'male' ? 5 : editableProfile.sex === 'female' ? -161 : -78;
    const bmr = 10 * Number(editableProfile.weight_kg) + 6.25 * Number(editableProfile.height_cm) - 5 * Number(editableProfile.age) + sexConst;
    
    // Apply activity level multiplier
    const activityMultipliers = {
      sedentary: 1.2,      // Little or no exercise
      light: 1.375,        // Light exercise 1-3 days/week
      moderate: 1.55,      // Moderate exercise 3-5 days/week
      active: 1.725,       // Hard exercise 6-7 days/week
      very_active: 1.9     // Very hard exercise & physical job
    };
    
    const tdee = bmr * activityMultipliers[editableProfile.activity_level || 'moderate'];
    
    // Adjust for dietary goal
    let target = tdee;
    if (editableProfile.dietary_goal === 'weight-loss') {
      target = tdee - 500; // 500 calorie deficit for ~1 lb/week loss
    } else if (editableProfile.dietary_goal === 'muscle-gain') {
      target = tdee + 300; // 300 calorie surplus for lean muscle gain
    }
    
    return Math.max(1200, Math.min(4500, Math.round(target)));
  };

  // Auto-calculate calories when settings change
  useEffect(() => {
    if (editableProfile.auto_calc_calories) {
      setEditableProfile(prev => ({ ...prev, daily_calorie_target: computeAutoCalories() }));
    }
  }, [editableProfile.sex, editableProfile.age, editableProfile.weight_kg, editableProfile.height_cm, editableProfile.dietary_goal, editableProfile.activity_level, editableProfile.auto_calc_calories]);

  const handleSaveSettings = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const payload = { ...editableProfile } as any;
      if (editableProfile.auto_calc_calories) {
        payload.daily_calorie_target = computeAutoCalories();
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setProfile({ ...profile, ...payload });
      setSelectedGoal(payload.dietary_goal);
      setShowSettings(false);
      
      toast({
        title: "Settings Updated",
        description: "Your meal plan has been updated with your new preferences.",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const filterMealsByDietaryRestrictions = (meals: any[]) => {
    if (!profile) return meals;
    
    return meals.filter(meal => {
      if (profile.is_vegetarian || profile.is_vegan) {
        return meal.vegetarian === true;
      }
      return true;
    });
  };

  const calculateDailyCalories = (breakfast: any, lunch: any, dinner: any) => {
    return breakfast.calories + lunch.calories + dinner.calories;
  };

  const getBalancedWeeklyPlan = () => {
    const currentPlan = mealPlans[selectedGoal as keyof typeof mealPlans].weekly;
    const targetCalories = profile.daily_calorie_target;
    
    const filteredBreakfasts = filterMealsByDietaryRestrictions(currentPlan.Breakfast);
    const filteredLunches = filterMealsByDietaryRestrictions(currentPlan.Lunch);
    const filteredDinners = filterMealsByDietaryRestrictions(currentPlan.Dinner);
    
    // Create weekly plan that matches target calories
    return days.map((day, index) => {
      const breakfast = filteredBreakfasts[index % filteredBreakfasts.length];
      const lunch = filteredLunches[index % filteredLunches.length];
      const dinner = filteredDinners[index % filteredDinners.length];
      
      const totalCalories = calculateDailyCalories(breakfast, lunch, dinner);
      
      return {
        day,
        breakfast,
        lunch,
        dinner,
        totalCalories,
        targetCalories,
        difference: Math.abs(totalCalories - targetCalories)
      };
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Complete Your Profile First</h2>
        <p className="text-muted-foreground">Please set up your dietary preferences in the Profile page to see personalized meal plans.</p>
      </div>
    );
  }

  const currentMealPlan = mealPlans[selectedGoal as keyof typeof mealPlans];
  const filteredRecommendations = filterMealsByDietaryRestrictions(currentMealPlan.recommended);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-4xl font-bold">Your Personalized Meal Plan</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            {showSettings ? 'Hide Settings' : 'Adjust Settings'}
          </Button>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Droplets className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Daily Water Target</p>
                <p className="text-xl font-bold">{profile.daily_water_target} glasses</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {showSettings && (
        <Card className="p-6 bg-secondary/50 animate-slide-up">
          <h2 className="text-2xl font-bold mb-6">Adjust Your Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="goal-setting">Dietary Goal</Label>
              <Select 
                value={editableProfile.dietary_goal}
                onValueChange={(value) => setEditableProfile({ ...editableProfile, dietary_goal: value })}
              >
                <SelectTrigger id="goal-setting">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex-setting">Sex</Label>
              <Select 
                value={editableProfile.sex}
                onValueChange={(value) => setEditableProfile({ ...editableProfile, sex: value as 'male'|'female'|'other' })}
              >
                <SelectTrigger id="sex-setting">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age-setting">Age</Label>
              <Input 
                id="age-setting" 
                type="number" 
                value={editableProfile.age}
                onChange={(e) => setEditableProfile({ ...editableProfile, age: Number(e.target.value || 0) })}
                min="0"
                placeholder="Enter age"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight-setting">Weight (kg)</Label>
              <Input 
                id="weight-setting" 
                type="number" 
                value={editableProfile.weight_kg}
                onChange={(e) => setEditableProfile({ ...editableProfile, weight_kg: Number(e.target.value || 0) })}
                min="0"
                step="0.1"
                placeholder="Enter weight in kg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height-setting">Height (cm)</Label>
              <Input 
                id="height-setting" 
                type="number" 
                value={editableProfile.height_cm}
                onChange={(e) => setEditableProfile({ ...editableProfile, height_cm: Number(e.target.value || 0) })}
                min="0"
                step="0.1"
                placeholder="Enter height in cm"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="activity-setting">Activity Level</Label>
              <Select 
                value={editableProfile.activity_level}
                onValueChange={(value) => setEditableProfile({ ...editableProfile, activity_level: value as any })}
              >
                <SelectTrigger id="activity-setting">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary - Little or no exercise</SelectItem>
                  <SelectItem value="light">Lightly Active - Light exercise 1-3 days/week</SelectItem>
                  <SelectItem value="moderate">Moderately Active - Moderate exercise 3-5 days/week</SelectItem>
                  <SelectItem value="active">Very Active - Hard exercise 6-7 days/week</SelectItem>
                  <SelectItem value="very_active">Extremely Active - Very hard exercise & physical job</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="calories-setting">Daily Calorie Target</Label>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="auto-calc-setting" 
                    checked={editableProfile.auto_calc_calories}
                    onCheckedChange={(checked) => setEditableProfile({ ...editableProfile, auto_calc_calories: !!checked })}
                  />
                  <label htmlFor="auto-calc-setting" className="text-sm text-muted-foreground cursor-pointer">Auto-calculate</label>
                </div>
              </div>
              <Input 
                id="calories-setting" 
                type="number" 
                value={editableProfile.daily_calorie_target}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setEditableProfile({ ...editableProfile, daily_calorie_target: 0 });
                  } else {
                    const parsed = parseInt(value);
                    if (!isNaN(parsed)) {
                      setEditableProfile({ ...editableProfile, daily_calorie_target: parsed });
                    }
                  }
                }}
                onBlur={(e) => {
                  if (!e.target.value || parseInt(e.target.value) <= 0) {
                    setEditableProfile({ ...editableProfile, daily_calorie_target: 2000 });
                  }
                }}
                min="0"
                disabled={editableProfile.auto_calc_calories}
                placeholder="Enter calorie target"
              />
              {editableProfile.auto_calc_calories && (
                <div className="mt-2 p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">
                    <strong>Auto-Calculated Target:</strong> {computeAutoCalories()} calories/day
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Based on your profile (Age: {editableProfile.age}, Weight: {editableProfile.weight_kg}kg, Height: {editableProfile.height_cm}cm) 
                    and {editableProfile.activity_level.replace('_', ' ')} activity level
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="water-setting">Daily Water Target (glasses)</Label>
              <Input 
                id="water-setting" 
                type="number" 
                value={editableProfile.daily_water_target}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setEditableProfile({ ...editableProfile, daily_water_target: 0 });
                  } else {
                    const parsed = parseInt(value);
                    if (!isNaN(parsed)) {
                      setEditableProfile({ ...editableProfile, daily_water_target: parsed });
                    }
                  }
                }}
                onBlur={(e) => {
                  if (!e.target.value || parseInt(e.target.value) <= 0) {
                    setEditableProfile({ ...editableProfile, daily_water_target: 8 });
                  }
                }}
                min="0"
                placeholder="Enter water target"
              />
            </div>

            <div className="space-y-4 md:col-span-2">
              <div>
                <Label className="text-base font-semibold mb-3 block">Food Preference</Label>
                <RadioGroup value={dietType} onValueChange={handleDietTypeChange}>
                  <div className="grid grid-cols-1 gap-2">
                    <Card className="p-3 hover:bg-secondary/50 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="non-vegetarian" id="non-veg-setting" />
                        <label htmlFor="non-veg-setting" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Fish className="w-4 h-4 text-red-500" />
                            <span className="font-medium">Non-Vegetarian</span>
                            <Badge variant="outline" className="text-xs">All Foods</Badge>
                          </div>
                        </label>
                      </div>
                    </Card>
                    
                    <Card className="p-3 hover:bg-secondary/50 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="vegetarian" id="veg-setting" />
                        <label htmlFor="veg-setting" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-green-500" />
                            <span className="font-medium">Vegetarian</span>
                            <Badge variant="outline" className="text-xs">No Meat/Fish</Badge>
                          </div>
                        </label>
                      </div>
                    </Card>
                    
                    <Card className="p-3 hover:bg-secondary/50 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="vegan" id="vegan-setting" />
                        <label htmlFor="vegan-setting" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-green-600" />
                            <span className="font-medium">Vegan</span>
                            <Badge variant="outline" className="text-xs">Plant-Based Only</Badge>
                          </div>
                        </label>
                      </div>
                    </Card>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Additional Restrictions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className="p-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="gluten-free-setting" 
                        checked={editableProfile.is_gluten_free}
                        onCheckedChange={(checked) => setEditableProfile({ ...editableProfile, is_gluten_free: !!checked })}
                      />
                      <label htmlFor="gluten-free-setting" className="flex items-center gap-2 cursor-pointer">
                        <Wheat className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium">Gluten-Free</span>
                      </label>
                    </div>
                  </Card>
                  
                  <Card className="p-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="dairy-free-setting" 
                        checked={editableProfile.is_dairy_free}
                        onCheckedChange={(checked) => setEditableProfile({ ...editableProfile, is_dairy_free: !!checked })}
                        disabled={dietType === 'vegan'}
                      />
                      <label htmlFor="dairy-free-setting" className="flex items-center gap-2 cursor-pointer">
                        <Milk className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">Dairy-Free</span>
                        {dietType === 'vegan' && (
                          <Badge variant="secondary" className="text-xs">Auto</Badge>
                        )}
                      </label>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleSaveSettings} 
            disabled={saving}
            className="w-full mt-6"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Apply Changes'
            )}
          </Button>
        </Card>
      )}

      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <p className="text-sm text-muted-foreground">Your Goal</p>
            <p className="font-semibold capitalize">{profile.dietary_goal.replace('-', ' ')}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Daily Calories</p>
            <p className="font-semibold">{profile.daily_calorie_target} cal {profile.auto_calc_calories ? '(auto)' : '(custom)'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Your Preferences</p>
            <div className="flex gap-2 flex-wrap mt-1">
              {profile.is_vegan ? (
                <Badge className="flex items-center gap-1">
                  <Leaf className="w-3 h-3" />
                  Vegan (Plant-Based)
                </Badge>
              ) : profile.is_vegetarian ? (
                <Badge className="flex items-center gap-1">
                  <Leaf className="w-3 h-3" />
                  Vegetarian
                </Badge>
              ) : (
                <Badge className="flex items-center gap-1">
                  <Fish className="w-3 h-3" />
                  Non-Vegetarian
                </Badge>
              )}
              {profile.is_gluten_free && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Wheat className="w-3 h-3" />
                  Gluten-Free
                </Badge>
              )}
              {profile.is_dairy_free && !profile.is_vegan && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Milk className="w-3 h-3" />
                  Dairy-Free
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      <h2 className="text-2xl font-bold">Select a Goal to Explore</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map((goal, index) => (
          <Card
            key={goal.id}
            className={`cursor-pointer transition-all hover:shadow-lg animate-slide-up ${
              selectedGoal === goal.id ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedGoal(goal.id)}
          >
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <goal.icon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-2">{goal.title}</h3>
              <p className="text-sm text-muted-foreground">{goal.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader>
          <CardTitle className="text-2xl">Recommended Meals for {goals.find(g => g.id === selectedGoal)?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecommendations.map((meal, index) => (
              <Card key={index} className="bg-secondary hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <h4 className="font-bold text-lg mb-2 text-card-foreground">{meal.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{meal.description}</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {meal.calories} cal
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                      {meal.protein} protein
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle className="text-2xl">Your Weekly Meal Plan</CardTitle>
          <p className="text-sm text-muted-foreground">
            Target: {profile.daily_calorie_target} calories per day • 
            {profile.is_vegan ? '🌱 Vegan' : profile.is_vegetarian ? '🥬 Vegetarian' : '🍖 Non-Vegetarian'} meals
            {profile.is_gluten_free && ' • 🌾 Gluten-Free'}
            {profile.is_dairy_free && !profile.is_vegan && ' • 🥛 Dairy-Free'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Meal</th>
                  {getBalancedWeeklyPlan().map((dayPlan) => (
                    <th key={dayPlan.day} className="text-center py-3 px-2">
                      <div className="font-bold text-primary">{dayPlan.day}</div>
                      <Badge 
                        variant={dayPlan.difference < 100 ? "default" : "secondary"}
                        className={`mt-1 ${dayPlan.difference < 100 ? "bg-green-500" : ""}`}
                      >
                        {dayPlan.totalCalories} cal
                      </Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Breakfast Row */}
                <tr className="border-b hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">☀️</span>
                      <span className="font-semibold">Breakfast</span>
                    </div>
                  </td>
                  {getBalancedWeeklyPlan().map((dayPlan) => (
                    <td key={`${dayPlan.day}-breakfast`} className="py-4 px-2 text-center">
                      <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <p className="font-medium text-sm mb-1">{dayPlan.breakfast.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {dayPlan.breakfast.calories} cal
                        </Badge>
                      </Card>
                    </td>
                  ))}
                </tr>
                
                {/* Lunch Row */}
                <tr className="border-b hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🌤️</span>
                      <span className="font-semibold">Lunch</span>
                    </div>
                  </td>
                  {getBalancedWeeklyPlan().map((dayPlan) => (
                    <td key={`${dayPlan.day}-lunch`} className="py-4 px-2 text-center">
                      <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <p className="font-medium text-sm mb-1">{dayPlan.lunch.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {dayPlan.lunch.calories} cal
                        </Badge>
                      </Card>
                    </td>
                  ))}
                </tr>
                
                {/* Dinner Row */}
                <tr className="hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🌙</span>
                      <span className="font-semibold">Dinner</span>
                    </div>
                  </td>
                  {getBalancedWeeklyPlan().map((dayPlan) => (
                    <td key={`${dayPlan.day}-dinner`} className="py-4 px-2 text-center">
                      <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <p className="font-medium text-sm mb-1">{dayPlan.dinner.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {dayPlan.dinner.calories} cal
                        </Badge>
                      </Card>
                    </td>
                  ))}
                </tr>
                
                {/* Daily Totals Row */}
                <tr className="bg-primary/5">
                  <td className="py-3 px-2 font-semibold">Daily Total</td>
                  {getBalancedWeeklyPlan().map((dayPlan) => (
                    <td key={`${dayPlan.day}-total`} className="py-3 px-2 text-center">
                      <div className="font-bold text-lg">
                        {dayPlan.totalCalories} cal
                      </div>
                      {dayPlan.difference < 100 ? (
                        <Badge variant="default" className="bg-green-500 text-xs mt-1">
                          ✓ On Target
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {dayPlan.totalCalories > dayPlan.targetCalories ? '+' : ''}
                          {dayPlan.totalCalories - dayPlan.targetCalories} cal
                        </Badge>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Mobile View - Scrollable Cards */}
          <div className="md:hidden mt-4">
            <p className="text-sm text-muted-foreground mb-3">Swipe to see all days →</p>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {getBalancedWeeklyPlan().map((dayPlan) => (
                <Card key={dayPlan.day} className="min-w-[280px] p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg text-primary">{dayPlan.day}</h3>
                    <Badge 
                      variant={dayPlan.difference < 100 ? "default" : "secondary"}
                      className={dayPlan.difference < 100 ? "bg-green-500" : ""}
                    >
                      {dayPlan.totalCalories} cal
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span>☀️</span>
                        <span className="text-sm font-semibold">Breakfast</span>
                      </div>
                      <p className="text-sm font-medium">{dayPlan.breakfast.name}</p>
                      <p className="text-xs text-muted-foreground">{dayPlan.breakfast.calories} cal</p>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span>🌤️</span>
                        <span className="text-sm font-semibold">Lunch</span>
                      </div>
                      <p className="text-sm font-medium">{dayPlan.lunch.name}</p>
                      <p className="text-xs text-muted-foreground">{dayPlan.lunch.calories} cal</p>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span>🌙</span>
                        <span className="text-sm font-semibold">Dinner</span>
                      </div>
                      <p className="text-sm font-medium">{dayPlan.dinner.name}</p>
                      <p className="text-xs text-muted-foreground">{dayPlan.dinner.calories} cal</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MealPlans;
