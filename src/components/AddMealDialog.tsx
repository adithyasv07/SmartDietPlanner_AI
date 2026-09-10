import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Loader2 } from 'lucide-react';
import { useNutrition } from '@/contexts/NutritionContext';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddMealDialogProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  trigger?: React.ReactNode;
}

// Common Indian foods database
const foodDatabase = [
  // Breakfast items
  { name: 'Poha', calories: 180, protein: 6, carbs: 35, fats: 2, category: 'breakfast' },
  { name: 'Upma', calories: 170, protein: 5, carbs: 30, fats: 3, category: 'breakfast' },
  { name: 'Idli (2 pcs)', calories: 150, protein: 4, carbs: 32, fats: 1, category: 'breakfast' },
  { name: 'Dosa', calories: 200, protein: 5, carbs: 38, fats: 3, category: 'breakfast' },
  { name: 'Paratha', calories: 250, protein: 7, carbs: 40, fats: 8, category: 'breakfast' },
  { name: 'Omelette (2 eggs)', calories: 180, protein: 13, carbs: 2, fats: 14, category: 'breakfast' },
  { name: 'Masala Oats', calories: 150, protein: 8, carbs: 25, fats: 3, category: 'breakfast' },
  { name: 'Bread Toast (2 slices)', calories: 140, protein: 5, carbs: 26, fats: 2, category: 'breakfast' },
  
  // Lunch/Dinner items
  { name: 'Dal Tadka', calories: 150, protein: 9, carbs: 20, fats: 4, category: 'main' },
  { name: 'Rajma', calories: 180, protein: 10, carbs: 28, fats: 3, category: 'main' },
  { name: 'Chole', calories: 200, protein: 11, carbs: 30, fats: 5, category: 'main' },
  { name: 'Paneer Butter Masala', calories: 280, protein: 14, carbs: 15, fats: 20, category: 'main' },
  { name: 'Palak Paneer', calories: 220, protein: 12, carbs: 10, fats: 16, category: 'main' },
  { name: 'Chicken Curry', calories: 250, protein: 25, carbs: 8, fats: 15, category: 'main' },
  { name: 'Fish Curry', calories: 200, protein: 22, carbs: 5, fats: 12, category: 'main' },
  { name: 'Egg Curry', calories: 180, protein: 12, carbs: 8, fats: 12, category: 'main' },
  { name: 'Mixed Vegetable', calories: 120, protein: 4, carbs: 18, fats: 4, category: 'main' },
  { name: 'Aloo Gobi', calories: 150, protein: 4, carbs: 22, fats: 6, category: 'main' },
  
  // Rice/Bread
  { name: 'Roti (1 pc)', calories: 80, protein: 3, carbs: 15, fats: 1, category: 'carbs' },
  { name: 'Rice (1 bowl)', calories: 200, protein: 4, carbs: 45, fats: 1, category: 'carbs' },
  { name: 'Brown Rice (1 bowl)', calories: 180, protein: 5, carbs: 38, fats: 2, category: 'carbs' },
  { name: 'Naan', calories: 150, protein: 5, carbs: 28, fats: 3, category: 'carbs' },
  
  // Snacks
  { name: 'Samosa (1 pc)', calories: 150, protein: 3, carbs: 20, fats: 8, category: 'snacks' },
  { name: 'Pakora (100g)', calories: 200, protein: 6, carbs: 22, fats: 12, category: 'snacks' },
  { name: 'Dhokla (100g)', calories: 120, protein: 5, carbs: 20, fats: 2, category: 'snacks' },
  { name: 'Bhel Puri', calories: 180, protein: 4, carbs: 30, fats: 6, category: 'snacks' },
  { name: 'Fruit Salad', calories: 80, protein: 1, carbs: 20, fats: 0, category: 'snacks' },
  { name: 'Nuts (30g)', calories: 170, protein: 6, carbs: 6, fats: 15, category: 'snacks' },
  { name: 'Yogurt (1 cup)', calories: 100, protein: 8, carbs: 12, fats: 3, category: 'snacks' },
  
  // Beverages
  { name: 'Tea with Milk', calories: 40, protein: 1, carbs: 5, fats: 2, category: 'beverage' },
  { name: 'Coffee with Milk', calories: 50, protein: 2, carbs: 6, fats: 2, category: 'beverage' },
  { name: 'Lassi', calories: 120, protein: 5, carbs: 15, fats: 4, category: 'beverage' },
  { name: 'Fresh Juice', calories: 100, protein: 1, carbs: 24, fats: 0, category: 'beverage' },
];

export default function AddMealDialog({ mealType, trigger }: AddMealDialogProps) {
  const { addMeal } = useNutrition();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState<typeof foodDatabase[0] | null>(null);
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });
  const [isCustom, setIsCustom] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMeal = () => {
    if (isCustom) {
      if (!customFood.name || !customFood.calories) return;
      
      addMeal({
        name: customFood.name,
        calories: parseInt(customFood.calories) * quantity,
        protein: parseInt(customFood.protein || '0') * quantity,
        carbs: parseInt(customFood.carbs || '0') * quantity,
        fats: parseInt(customFood.fats || '0') * quantity,
        mealType,
      });
    } else if (selectedFood) {
      addMeal({
        name: selectedFood.name,
        calories: selectedFood.calories * quantity,
        protein: selectedFood.protein * quantity,
        carbs: selectedFood.carbs * quantity,
        fats: selectedFood.fats * quantity,
        mealType,
      });
    }
    
    // Reset form
    setSelectedFood(null);
    setCustomFood({ name: '', calories: '', protein: '', carbs: '', fats: '' });
    setQuantity(1);
    setSearchTerm('');
    setIsCustom(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Food
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Food to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</DialogTitle>
          <DialogDescription>
            Search for food items or add custom nutrition information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={!isCustom ? "default" : "outline"}
              onClick={() => setIsCustom(false)}
              className="flex-1"
            >
              Search Food
            </Button>
            <Button
              variant={isCustom ? "default" : "outline"}
              onClick={() => setIsCustom(true)}
              className="flex-1"
            >
              Custom Entry
            </Button>
          </div>

          {!isCustom ? (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for food..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <ScrollArea className="h-[200px] border rounded-lg p-2">
                <div className="space-y-2">
                  {filteredFoods.map((food, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedFood?.name === food.name
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-secondary'
                      } border`}
                      onClick={() => setSelectedFood(food)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{food.name}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {food.calories} cal
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              P: {food.protein}g
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              C: {food.carbs}g
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              F: {food.fats}g
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {selectedFood && (
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Total: {Math.round(selectedFood.calories * quantity)} calories
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="food-name">Food Name</Label>
                <Input
                  id="food-name"
                  placeholder="e.g., Chicken Biryani"
                  value={customFood.name}
                  onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="200"
                    value={customFood.calories}
                    onChange={(e) => setCustomFood({ ...customFood, calories: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    placeholder="20"
                    value={customFood.protein}
                    onChange={(e) => setCustomFood({ ...customFood, protein: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    placeholder="30"
                    value={customFood.carbs}
                    onChange={(e) => setCustomFood({ ...customFood, carbs: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fats">Fats (g)</Label>
                  <Input
                    id="fats"
                    type="number"
                    placeholder="10"
                    value={customFood.fats}
                    onChange={(e) => setCustomFood({ ...customFood, fats: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-quantity">Quantity</Label>
                <Input
                  id="custom-quantity"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddMeal}
            disabled={isCustom ? !customFood.name || !customFood.calories : !selectedFood}
          >
            Add to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
