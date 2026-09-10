import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Lightbulb, AlertTriangle, TrendingUp, TrendingDown, Minus, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';
import { useNutrition } from '@/contexts/NutritionContext';
import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

const Progress = () => {
  const { currentDay, weeklyData, goals, getWeeklyStats } = useNutrition();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const weeklyStats = getWeeklyStats();

  // Get last 7 days of data for charts
  const getLast7DaysData = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en', { weekday: 'short' });
      
      const dayData = weeklyData[dateStr] || { calories: 0, protein: 0, carbs: 0, fats: 0, water: 0 };
      
      days.push({
        day: dayName,
        date: dateStr,
        calories: dayData.calories,
        protein: dayData.protein,
        carbs: dayData.carbs,
        fats: dayData.fats,
        water: dayData.water,
        goal: goals.calories,
      });
    }
    
    return days;
  };

  const chartData = getLast7DaysData();

  // Calculate macro distribution for pie chart
  const macroData = [
    { name: 'Protein', value: currentDay.protein * 4, color: '#3B82F6' }, // 4 cal per gram
    { name: 'Carbs', value: currentDay.carbs * 4, color: '#F97316' }, // 4 cal per gram
    { name: 'Fats', value: currentDay.fats * 9, color: '#10B981' }, // 9 cal per gram
  ];

  // Calculate progress metrics
  const calculateTrend = () => {
    if (chartData.length < 2) return 'stable';
    const recentAvg = chartData.slice(-3).reduce((acc, d) => acc + d.calories, 0) / 3;
    const previousAvg = chartData.slice(0, 3).reduce((acc, d) => acc + d.calories, 0) / 3;
    
    if (recentAvg > previousAvg * 1.1) return 'up';
    if (recentAvg < previousAvg * 0.9) return 'down';
    return 'stable';
  };

  const trend = calculateTrend();

  // Generate insights based on data
  const generateInsights = () => {
    const insights = [];
    
    // Check calorie consistency
    if (weeklyStats.totalDays >= 3) {
      const avgDiff = Math.abs(weeklyStats.avgCalories - goals.calories);
      if (avgDiff < 100) {
        insights.push({
          type: 'success',
          icon: CheckCircle2,
          title: 'Great Consistency!',
          message: `You're maintaining an average of ${weeklyStats.avgCalories} calories, very close to your ${goals.calories} cal goal.`,
          color: 'text-green-600 bg-green-50',
        });
      } else if (weeklyStats.avgCalories < goals.calories - 200) {
        insights.push({
          type: 'warning',
          icon: AlertTriangle,
          title: 'Low Calorie Intake',
          message: `Your average intake is ${goals.calories - weeklyStats.avgCalories} calories below your goal. Consider eating more.`,
          color: 'text-orange-600 bg-orange-50',
        });
      }
    }
    
    // Check protein intake
    if (weeklyStats.avgProtein < goals.protein * 0.8) {
      insights.push({
        type: 'info',
        icon: Lightbulb,
        title: 'Protein Suggestion',
        message: `Try to increase your protein intake. You're averaging ${weeklyStats.avgProtein}g vs your ${goals.protein}g goal.`,
        color: 'text-blue-600 bg-blue-50',
      });
    }
    
    // Check water intake
    if (weeklyStats.avgWater >= goals.water) {
      insights.push({
        type: 'success',
        icon: CheckCircle2,
        title: 'Excellent Hydration!',
        message: `You're consistently meeting your water intake goal of ${goals.water} glasses per day.`,
        color: 'text-cyan-600 bg-cyan-50',
      });
    }
    
    // If no insights, add a default one
    if (insights.length === 0) {
      insights.push({
        type: 'info',
        icon: Lightbulb,
        title: 'Keep Tracking!',
        message: 'Continue logging your meals to get personalized insights and recommendations.',
        color: 'text-blue-600 bg-blue-50',
      });
    }
    
    return insights;
  };

  const insights = generateInsights();

  // Radial chart data for today's progress
  const radialData = [
    {
      name: 'Calories',
      value: Math.min(100, (currentDay.calories / goals.calories) * 100),
      fill: '#EF4444',
    },
    {
      name: 'Protein',
      value: Math.min(100, (currentDay.protein / goals.protein) * 100),
      fill: '#3B82F6',
    },
    {
      name: 'Carbs',
      value: Math.min(100, (currentDay.carbs / goals.carbs) * 100),
      fill: '#F97316',
    },
    {
      name: 'Water',
      value: Math.min(100, (currentDay.water / goals.water) * 100),
      fill: '#06B6D4',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-4xl font-bold">Your Progress</h1>
        <div className="flex items-center gap-3">
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : trend === 'down' ? (
                <TrendingDown className="w-4 h-4 text-red-500" />
              ) : (
                <Minus className="w-4 h-4 text-yellow-500" />
              )}
              <div>
                <p className="text-xs text-muted-foreground">Trend</p>
                <p className="text-sm font-bold capitalize">{trend}</p>
              </div>
            </div>
          </Card>
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Streak</p>
                <p className="text-sm font-bold">{weeklyStats.totalDays} days</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="animate-slide-up">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Avg Daily Calories</p>
              <p className="text-3xl font-bold text-red-500">{weeklyStats.avgCalories}</p>
              <p className="text-xs text-muted-foreground mt-1">Goal: {goals.calories}</p>
              <ProgressBar 
                value={Math.min(100, (weeklyStats.avgCalories / goals.calories) * 100)} 
                className="mt-3 h-2"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Avg Protein</p>
              <p className="text-3xl font-bold text-blue-500">{weeklyStats.avgProtein}g</p>
              <p className="text-xs text-muted-foreground mt-1">Goal: {goals.protein}g</p>
              <ProgressBar 
                value={Math.min(100, (weeklyStats.avgProtein / goals.protein) * 100)} 
                className="mt-3 h-2"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Avg Carbs</p>
              <p className="text-3xl font-bold text-orange-500">{weeklyStats.avgCarbs}g</p>
              <p className="text-xs text-muted-foreground mt-1">Goal: {goals.carbs}g</p>
              <ProgressBar 
                value={Math.min(100, (weeklyStats.avgCarbs / goals.carbs) * 100)} 
                className="mt-3 h-2"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Avg Water</p>
              <p className="text-3xl font-bold text-cyan-500">{weeklyStats.avgWater}</p>
              <p className="text-xs text-muted-foreground mt-1">Goal: {goals.water} glasses</p>
              <ProgressBar 
                value={Math.min(100, (weeklyStats.avgWater / goals.water) * 100)} 
                className="mt-3 h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="calories" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calories">Calories</TabsTrigger>
          <TabsTrigger value="macros">Macros</TabsTrigger>
          <TabsTrigger value="water">Hydration</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calories" className="space-y-4">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Weekly Calorie Intake
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))' 
                    }} 
                  />
                  <Bar dataKey="calories" fill="#EF4444" radius={[8, 8, 0, 0]} />
                  <Line type="monotone" dataKey="goal" stroke="#10B981" strokeDasharray="5 5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="macros" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Today's Macro Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${Math.round(entry.value)} cal`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="text-xl">Macro Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))' 
                      }} 
                    />
                    <Line type="monotone" dataKey="protein" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="carbs" stroke="#F97316" strokeWidth={2} />
                    <Line type="monotone" dataKey="fats" stroke="#10B981" strokeWidth={2} />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="water" className="space-y-4">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-xl">Hydration Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))' 
                    }} 
                  />
                  <Bar dataKey="water" fill="#06B6D4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overview" className="space-y-4">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Today's Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={radialData}>
                  <RadialBar
                    minAngle={15}
                    label={{ position: 'insideStart', fill: '#fff' }}
                    background
                    clockWise
                    dataKey="value"
                  />
                  <Legend 
                    iconSize={10} 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                  />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="text-2xl">AI Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 p-4 rounded-lg ${insight.color}`}
              >
                <insight.icon className="w-6 h-6 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">{insight.title}</h3>
                  <p className="text-sm opacity-90">{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Achievement Badges */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader>
          <CardTitle className="text-xl">Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {weeklyStats.totalDays >= 3 && (
              <Badge variant="default" className="p-2">
                🔥 3-Day Streak
              </Badge>
            )}
            {weeklyStats.totalDays >= 7 && (
              <Badge variant="default" className="p-2">
                🌟 Week Warrior
              </Badge>
            )}
            {weeklyStats.avgWater >= goals.water && (
              <Badge variant="default" className="p-2">
                💧 Hydration Hero
              </Badge>
            )}
            {weeklyStats.avgProtein >= goals.protein && (
              <Badge variant="default" className="p-2">
                💪 Protein Power
              </Badge>
            )}
            {Math.abs(weeklyStats.avgCalories - goals.calories) < 100 && weeklyStats.totalDays >= 3 && (
              <Badge variant="default" className="p-2">
                🎯 Calorie Champion
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Progress;
