import { Apple, Leaf, Zap, Package, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FoodData {
  foodName: string;
  description: string;
  calories?: string;
  macronutrients?: {
    protein: string;
    carbs: string;
    fats: string;
  };
  vitamins?: string[];
  healthBenefits?: string[];
  servingSize?: string;
  ingredients?: string[];
  lowerCalorieAlternatives?: Array<{
    name: string;
    calories: string;
    description: string;
  }>;
  error?: string;
}

interface NutritionCardProps {
  foodData: FoodData;
}

const NutritionCard = ({ foodData }: NutritionCardProps) => {
  if (foodData.error) {
    return (
      <Card className="border-2 border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Analysis Note</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{foodData.description}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-700">
      {/* Header Card */}
      <Card className="border-2 shadow-[var(--shadow-card)] bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {foodData.foodName}
              </CardTitle>
              <CardDescription className="text-base">
                {foodData.description}
              </CardDescription>
            </div>
            {foodData.calories && (
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{foodData.calories}</div>
                <div className="text-sm text-muted-foreground">calories</div>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Macronutrients */}
        {foodData.macronutrients && (
          <Card className="border-2 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Apple className="w-5 h-5 text-primary" />
                Macronutrients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                  <span className="font-medium">Protein</span>
                  <span className="text-primary font-semibold">{foodData.macronutrients.protein}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                  <span className="font-medium">Carbohydrates</span>
                  <span className="text-primary font-semibold">{foodData.macronutrients.carbs}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                  <span className="font-medium">Fats</span>
                  <span className="text-primary font-semibold">{foodData.macronutrients.fats}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vitamins */}
        {foodData.vitamins && foodData.vitamins.length > 0 && (
          <Card className="border-2 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Zap className="w-5 h-5 text-accent" />
                Key Vitamins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {foodData.vitamins.map((vitamin, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1.5 bg-accent/20 text-accent-foreground">
                    {vitamin}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Health Benefits */}
        {foodData.healthBenefits && foodData.healthBenefits.length > 0 && (
          <Card className="border-2 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Leaf className="w-5 h-5 text-primary" />
                Health Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {foodData.healthBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Ingredients */}
        {foodData.ingredients && foodData.ingredients.length > 0 && (
          <Card className="border-2 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Package className="w-5 h-5 text-primary" />
                Main Ingredients
              </CardTitle>
              {foodData.servingSize && (
                <CardDescription>Serving size: {foodData.servingSize}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {foodData.ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1.5">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Lower Calorie Alternatives */}
      {foodData.lowerCalorieAlternatives && foodData.lowerCalorieAlternatives.length > 0 && (
        <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-green-700 dark:text-green-400">
              <ArrowDown className="w-5 h-5" />
              Lower Calorie Alternatives
            </CardTitle>
            <CardDescription>Healthier options with fewer calories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {foodData.lowerCalorieAlternatives.map((alt, index) => (
                <Card key={index} className="bg-background">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg">{alt.name}</h4>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        {alt.calories}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alt.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NutritionCard;
