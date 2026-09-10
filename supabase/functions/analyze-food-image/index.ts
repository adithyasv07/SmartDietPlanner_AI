import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY in environment");
    }

    const { image } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing image...");

    // Remove "data:*;base64," header if present
    const base64Image = image.includes("base64,")
      ? image.split("base64,")[1]
      : image;

    // Call Gemini 2.5 Flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this food image and give full nutrition info in JSON format ONLY.`
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1200,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      return new Response(
        JSON.stringify({ error: "Gemini API Error", details: errorText }),
        { status: 500, headers: corsHeaders }
      );
    }

    const data = await response.json();
    console.log("Gemini response received.");

    const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error("Gemini did not return valid text");
    }

    let jsonResult;

    try {
      const jsonMatch =
        textContent.match(/```json\s*([\s\S]*?)```/) ||
        textContent.match(/\{[\s\S]*\}/);

      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textContent;

      jsonResult = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse JSON:", textContent);
      jsonResult = { rawText: textContent, error: "Failed to parse AI JSON" };
    }

    return new Response(
      JSON.stringify({ success: true, data: jsonResult }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Server Error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
