import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useNutrition } from '@/contexts/NutritionContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Fish, Info, Leaf, Loader2, Milk, Wheat } from 'lucide-react';
import { useEffect, useState } from 'react';

const Profile = () => {
  const { toast } = useToast();
  const { updateGoals } = useNutrition();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dietType, setDietType] = useState<'non-vegetarian' | 'vegetarian' | 'vegan'>('non-vegetarian');
  const [profile, setProfile] = useState({
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

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUser(user);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setProfile({
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

  const handleDietTypeChange = (value: string) => {
    setDietType(value as 'non-vegetarian' | 'vegetarian' | 'vegan');
    
    // Update profile based on diet type
    if (value === 'vegan') {
      setProfile(prev => ({ ...prev, is_vegetarian: true, is_vegan: true, is_dairy_free: true }));
    } else if (value === 'vegetarian') {
      setProfile(prev => ({ ...prev, is_vegetarian: true, is_vegan: false }));
    } else {
      setProfile(prev => ({ ...prev, is_vegetarian: false, is_vegan: false }));
    }
  };

  const computeAutoCalories = () => {
    // Calculate BMR using Mifflin-St Jeor Equation
    const sexConst = profile.sex === 'male' ? 5 : profile.sex === 'female' ? -161 : -78;
    const bmr = 10 * Number(profile.weight_kg) + 6.25 * Number(profile.height_cm) - 5 * Number(profile.age) + sexConst;
    
    // Apply activity level multiplier
    const activityMultipliers = {
      sedentary: 1.2,      // Little or no exercise
      light: 1.375,        // Light exercise 1-3 days/week
      moderate: 1.55,      // Moderate exercise 3-5 days/week
      active: 1.725,       // Hard exercise 6-7 days/week
      very_active: 1.9     // Very hard exercise & physical job
    };
    
    const tdee = bmr * activityMultipliers[profile.activity_level || 'moderate'];
    
    // Adjust for dietary goal
    let target = tdee;
    if (profile.dietary_goal === 'weight-loss') {
      target = tdee - 500; // 500 calorie deficit for ~1 lb/week loss
    } else if (profile.dietary_goal === 'muscle-gain') {
      target = tdee + 300; // 300 calorie surplus for lean muscle gain
    }
    
    return Math.max(1200, Math.min(4500, Math.round(target)));
  };

  // Recompute target calories when inputs or goal change and auto-calc is enabled
  useEffect(() => {
    if (profile.auto_calc_calories) {
      setProfile(prev => ({ ...prev, daily_calorie_target: computeAutoCalories() }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.sex, profile.age, profile.weight_kg, profile.height_cm, profile.dietary_goal, profile.activity_level, profile.auto_calc_calories]);

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        ...profile,
      } as any;

      // If auto-calc is on, ensure we persist the computed number
      if (profile.auto_calc_calories) {
        payload.daily_calorie_target = computeAutoCalories();
      }
      
      const { error } = await supabase
        .from('profiles')
        .upsert(payload, {
          onConflict: 'user_id'
        });
      
      if (error) {
        throw error;
      }
      
      // Update the nutrition context with new goals based on final calorie target
      const calorieTarget = payload.daily_calorie_target;
      const userGoals = {
        calories: calorieTarget,
        protein: Math.round(calorieTarget * 0.025), // ~10% of calories from protein
        carbs: Math.round(calorieTarget * 0.125), // ~50% of calories from carbs
        fats: Math.round(calorieTarget * 0.0361), // ~30% of calories from fats
        water: profile.daily_water_target,
      } as any;
      
      // Adjust macros based on dietary goal
      if (profile.dietary_goal === 'muscle-gain') {
        userGoals.protein = Math.round(calorieTarget * 0.035); // Higher protein for muscle gain
        userGoals.carbs = Math.round(calorieTarget * 0.15); // More carbs for energy
      } else if (profile.dietary_goal === 'weight-loss') {
        userGoals.protein = Math.round(calorieTarget * 0.03); // Higher protein to preserve muscle
        userGoals.carbs = Math.round(calorieTarget * 0.1); // Lower carbs
        userGoals.fats = Math.round(calorieTarget * 0.033); // Moderate fats
      }
      
      await updateGoals(userGoals);
      
      toast({
        title: "Success",
        description: "Profile saved successfully! Your dashboard has been updated with your new goals.",
      });
    } catch (error: any) {
      // Fallback: if new columns are missing in DB, retry without them so save doesn't fail
      const msg = (error?.message || '').toLowerCase();
      const looksLikeMissingCols = msg.includes('column') || msg.includes('undefined column');
      if (looksLikeMissingCols) {
        try {
          const fallbackPayload: any = {
            user_id: user.id,
            dietary_goal: profile.dietary_goal,
            daily_calorie_target: profile.auto_calc_calories ? computeAutoCalories() : profile.daily_calorie_target,
            daily_water_target: profile.daily_water_target,
            is_vegetarian: profile.is_vegetarian,
            is_vegan: profile.is_vegan,
            is_gluten_free: profile.is_gluten_free,
            is_dairy_free: profile.is_dairy_free,
          };
          const { error: fbErr } = await supabase
            .from('profiles')
            .upsert(fallbackPayload, { onConflict: 'user_id' });
          if (fbErr) throw fbErr;

          toast({
            title: 'Saved with limited fields',
            description: 'Calorie auto-calc fields are pending database migration. Basic settings were saved.',
          });
        } catch (fbError) {
          console.error('Error saving profile:', fbError);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to save profile",
            variant: "destructive",
          });
        }
      } else {
        console.error('Error saving profile:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to save profile",
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Card className="animate-scale-in">
        <CardContent className="pt-8">
          <div className="flex flex-col items-center mb-8">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarFallback className="bg-primary text-white text-3xl">
                {user?.email?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold">Your Profile</h2>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="goal">Dietary Goal</Label>
              <Select 
                value={profile.dietary_goal}
                onValueChange={(value) => setProfile({ ...profile, dietary_goal: value })}
              >
                <SelectTrigger id="goal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sex">Sex</Label>
                <Select 
                  value={profile.sex}
                  onValueChange={(value) => setProfile({ ...profile, sex: value as 'male'|'female'|'other' })}
                >
                  <SelectTrigger id="sex">
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
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: Number(e.target.value || 0) })}
                  min="0"
                  placeholder="Enter age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input 
                  id="weight" 
                  type="number" 
                  value={profile.weight_kg}
                  onChange={(e) => setProfile({ ...profile, weight_kg: Number(e.target.value || 0) })}
                  min="0"
                  step="0.1"
                  placeholder="Enter weight in kg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input 
                  id="height" 
                  type="number" 
                  value={profile.height_cm}
                  onChange={(e) => setProfile({ ...profile, height_cm: Number(e.target.value || 0) })}
                  min="0"
                  step="0.1"
                  placeholder="Enter height in cm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity">Activity Level</Label>
              <Select 
                value={profile.activity_level}
                onValueChange={(value) => setProfile({ ...profile, activity_level: value as any })}
              >
                <SelectTrigger id="activity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">
                    <div>
                      <div className="font-medium">Sedentary</div>
                      <div className="text-xs text-muted-foreground">Little or no exercise</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="light">
                    <div>
                      <div className="font-medium">Lightly Active</div>
                      <div className="text-xs text-muted-foreground">Light exercise 1-3 days/week</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="moderate">
                    <div>
                      <div className="font-medium">Moderately Active</div>
                      <div className="text-xs text-muted-foreground">Moderate exercise 3-5 days/week</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="active">
                    <div>
                      <div className="font-medium">Very Active</div>
                      <div className="text-xs text-muted-foreground">Hard exercise 6-7 days/week</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="very_active">
                    <div>
                      <div className="font-medium">Extremely Active</div>
                      <div className="text-xs text-muted-foreground">Very hard exercise & physical job</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="calories">Daily Calorie Target</Label>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="auto-calc" 
                    checked={profile.auto_calc_calories}
                    onCheckedChange={(checked) => setProfile({ ...profile, auto_calc_calories: !!checked })}
                  />
                  <label htmlFor="auto-calc" className="text-sm text-muted-foreground cursor-pointer">Auto-calculate</label>
                </div>
              </div>
              <Input 
                id="calories" 
                type="number" 
                value={profile.daily_calorie_target}
                onChange={(e) => {
                  const value = e.target.value;
                  const parsed = parseInt(value || '0');
                  setProfile({ ...profile, daily_calorie_target: isNaN(parsed) ? 0 : parsed });
                }}
                onBlur={(e) => {
                  if (!e.target.value || parseInt(e.target.value) <= 0) {
                    setProfile({ ...profile, daily_calorie_target: 2000 });
                  }
                }}
                min="0"
                disabled={profile.auto_calc_calories}
                placeholder="Enter calorie target"
              />
              {profile.auto_calc_calories && (
                <div className="mt-2 p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">
                    <strong>Calculation Method:</strong> Mifflin-St Jeor Equation with activity multiplier
                  </p>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p>• BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + {profile.sex === 'male' ? '5' : profile.sex === 'female' ? '-161' : '-78'}</p>
                    <p>• TDEE = BMR × {profile.activity_level === 'sedentary' ? '1.2' : profile.activity_level === 'light' ? '1.375' : profile.activity_level === 'moderate' ? '1.55' : profile.activity_level === 'active' ? '1.725' : '1.9'} (activity factor)</p>
                    <p>• Target = TDEE {profile.dietary_goal === 'weight-loss' ? '- 500 cal (deficit)' : profile.dietary_goal === 'muscle-gain' ? '+ 300 cal (surplus)' : '(maintenance)'}</p>
                    <p className="font-medium text-primary mt-2">Your calculated target: {profile.daily_calorie_target} calories/day</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="water">Daily Water Target (glasses)</Label>
              <Input 
                id="water" 
                type="number" 
                value={profile.daily_water_target}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setProfile({ ...profile, daily_water_target: 0 });
                  } else {
                    const parsed = parseInt(value);
                    if (!isNaN(parsed)) {
                      setProfile({ ...profile, daily_water_target: parsed });
                    }
                  }
                }}
                onBlur={(e) => {
                  if (!e.target.value || parseInt(e.target.value) <= 0) {
                    setProfile({ ...profile, daily_water_target: 8 });
                  }
                }}
                min="0"
                placeholder="Enter water target"
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold mb-3 block">Food Preference</Label>
                <RadioGroup value={dietType} onValueChange={handleDietTypeChange}>
                  <Card className="p-3 mb-2 hover:bg-secondary/50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="non-vegetarian" id="non-veg" />
                      <label htmlFor="non-veg" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Fish className="w-4 h-4 text-red-500" />
                          <span className="font-medium">Non-Vegetarian</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          I eat all types of food including meat, fish, eggs, and dairy products
                        </p>
                      </label>
                    </div>
                  </Card>
                  
                  <Card className="p-3 mb-2 hover:bg-secondary/50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="vegetarian" id="veg" />
                      <label htmlFor="veg" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-green-500" />
                          <span className="font-medium">Vegetarian</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          I don't eat meat or fish, but I consume dairy products and eggs
                        </p>
                      </label>
                    </div>
                  </Card>
                  
                  <Card className="p-3 hover:bg-secondary/50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="vegan" id="vegan" />
                      <label htmlFor="vegan" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Vegan</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          I don't eat any animal products including meat, fish, eggs, or dairy
                        </p>
                      </label>
                    </div>
                  </Card>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Additional Dietary Restrictions</Label>
                <div className="space-y-3">
                  <Card className="p-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="gluten-free" 
                        checked={profile.is_gluten_free}
                        onCheckedChange={(checked) => setProfile({ ...profile, is_gluten_free: !!checked })}
                      />
                      <label htmlFor="gluten-free" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Wheat className="w-4 h-4 text-yellow-600" />
                          <span className="font-medium">Gluten-Free</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          I avoid wheat, barley, rye and other gluten-containing grains
                        </p>
                      </label>
                    </div>
                  </Card>
                  
                  <Card className="p-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="dairy-free" 
                        checked={profile.is_dairy_free}
                        onCheckedChange={(checked) => setProfile({ ...profile, is_dairy_free: !!checked })}
                        disabled={dietType === 'vegan'}
                      />
                      <label htmlFor="dairy-free" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Milk className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">Dairy-Free</span>
                          {dietType === 'vegan' && (
                            <Badge variant="secondary" className="text-xs">Auto-selected for Vegan</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          I avoid milk, cheese, yogurt and other dairy products
                        </p>
                      </label>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Current Settings Display */}
            <Card className="bg-secondary/30 p-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Your Current Settings:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {dietType === 'non-vegetarian' ? '🍖 Non-Vegetarian' : 
                       dietType === 'vegetarian' ? '🥬 Vegetarian' : '🌱 Vegan'}
                    </Badge>
                    {profile.is_gluten_free && <Badge variant="outline">🌾 Gluten-Free</Badge>}
                    {profile.is_dairy_free && !profile.is_vegan && <Badge variant="outline">🥛 Dairy-Free</Badge>}
                    <Badge variant="outline">🎯 {profile.daily_calorie_target} cal</Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="w-full"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
