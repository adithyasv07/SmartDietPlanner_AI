// src/components/FoodAnalyzer.tsx
import { useState, useRef } from "react";
import { Camera, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import NutritionCard from "./NutritionCard";
import ScannerLoading from "./ScannerLoading";

interface Macronutrients {
  protein: string;
  carbs: string;
  fats: string;
}

interface LowerCalorieAlternative {
  name: string;
  calories: string;
  description: string;
}

interface FoodData {
  foodName: string;
  description: string;
  calories?: string;
  macronutrients?: Macronutrients;
  vitamins?: string[];
  healthBenefits?: string[];
  servingSize?: string;
  ingredients?: string[];
  lowerCalorieAlternatives?: LowerCalorieAlternative[];
  error?: string;
}

interface FollowUpQuestion {
  id: string;
  question: string;
  options: string[];
}

interface IdentifyResult {
  foodName: string;
  confidence?: number;
  followUpQuestions: FollowUpQuestion[];
}

const FoodAnalyzer = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [identifyResult, setIdentifyResult] = useState<IdentifyResult | null>(
    null
  );
  const [followUpQuestions, setFollowUpQuestions] = useState<
    FollowUpQuestion[]
  >([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [foodData, setFoodData] = useState<FoodData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // For convenience
  const allQuestionsAnswered =
    followUpQuestions.length > 0 &&
    followUpQuestions.every((q) => answers[q.id]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        // Reset previous state
        setFoodData(null);
        setIdentifyResult(null);
        setFollowUpQuestions([]);
        setAnswers({});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnswerSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  /**
   * STEP 1 – send ONLY the image.
   * Backend returns foodName + followUpQuestions.
   */
  const identifyFood = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    const analysisPromise = supabase.functions.invoke("analyze-food-image", {
      body: { image: selectedImage, mode: "identify" },
    });

    const minimumDelay = new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const [{ data, error }] = await Promise.all([
        analysisPromise,
        minimumDelay,
      ]);

      if (error) throw error;

      if (data?.success && data.data) {
        const result = data.data as IdentifyResult;
        setIdentifyResult(result);
        setFollowUpQuestions(result.followUpQuestions || []);
        setAnswers({});
        setFoodData(null);

        toast({
          title: "Analysis complete",
          description: result.foodName
            ? `Looks like "${result.foodName}". Answer a few quick questions so I can estimate nutrition accurately.`
            : "I have some follow-up questions to estimate nutrition more accurately.",
        });
      } else {
        throw new Error("Failed to identify food");
      }
    } catch (error) {
      console.error("Identify error:", error);
      toast({
        title: "Analysis Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to analyze the image",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * STEP 2 – send image + foodName + answers.
   * Backend returns full nutrition details.
   */
  const fetchNutritionDetails = async () => {
    if (!selectedImage || !identifyResult) {
      toast({
        title: "Missing data",
        description: "Please identify the food first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    const analysisPromise = supabase.functions.invoke("analyze-food-image", {
      body: {
        image: selectedImage,
        mode: "details",
        foodName: identifyResult.foodName,
        answers,
      },
    });

    const minimumDelay = new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const [{ data, error }] = await Promise.all([
        analysisPromise,
        minimumDelay,
      ]);

      if (error) throw error;

      if (data?.success && data.data) {
        const result = data.data as FoodData;
        setFoodData(result);
        toast({
          title: "Nutrition ready",
          description: `Here are the nutritional details for ${result.foodName}.`,
        });
      } else {
        throw new Error("Failed to fetch nutrition details");
      }
    } catch (error) {
      console.error("Details error:", error);
      toast({
        title: "Analysis Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate nutrition details",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <AnimatePresence>{isAnalyzing && <ScannerLoading />}</AnimatePresence>

      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="backdrop-blur-sm bg-white/95 shadow-xl border-0">
          <CardContent className="pt-6 space-y-6">
            {/* Upload area */}
            <div className="border-2 border-dashed rounded-xl p-8 text-center transition-all hover:border-primary/70 hover:bg-gray-50">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              <Camera className="w-16 h-16 mx-auto mb-4 text-primary" />

              {!selectedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer"
                >
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    Upload Food Image
                  </p>
                  <p className="text-gray-500">
                    Click to upload or drag and drop
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <img
                    src={selectedImage}
                    alt="Food preview"
                    className="max-h-64 mx-auto rounded-lg shadow-md object-contain"
                  />

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        identifyFood();
                      }}
                      disabled={isAnalyzing}
                      className="flex-1"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Identify Food"
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      disabled={isAnalyzing}
                    >
                      Change Image
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 1 result + follow up questions */}
            {identifyResult && (
              <Card className="border border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Analysis Note
                  </CardTitle>
                  <CardDescription>
                    I think this is{" "}
                    <span className="font-semibold">
                      {identifyResult.foodName || "this dish"}
                    </span>
                    {typeof identifyResult.confidence === "number" && (
                      <>
                        {" "}
                        (confidence:{" "}
                        {(identifyResult.confidence * 100).toFixed(0)}%)
                      </>
                    )}
                    . Answer these quick questions so I can fine-tune the
                    nutritional estimate.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {followUpQuestions.length === 0 && (
                    <p className="text-sm text-gray-600">
                      No follow-up questions were generated. You can still
                      request nutrition details below.
                    </p>
                  )}

                  {followUpQuestions.map((q) => (
                    <div key={q.id} className="text-left space-y-2">
                      <p className="font-medium text-gray-800">{q.question}</p>
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((option) => {
                          const selected = answers[q.id] === option;
                          return (
                            <Button
                              key={option}
                              type="button"
                              size="sm"
                              variant={selected ? "default" : "outline"}
                              onClick={() => handleAnswerSelect(q.id, option)}
                            >
                              {option}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 flex flex-wrap gap-3">
                    <Button
                      onClick={fetchNutritionDetails}
                      disabled={isAnalyzing || !identifyResult}
                      className="flex-1 sm:flex-none"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating Nutrition…
                        </>
                      ) : allQuestionsAnswered ? (
                        "Get Nutrition Details"
                      ) : (
                        "Get Nutrition Details (with current answers)"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STEP 2 – pretty nutrition display */}
            {foodData && <NutritionCard foodData={foodData} />}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default FoodAnalyzer;
