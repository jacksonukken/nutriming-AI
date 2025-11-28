import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from "../types";

export const analyzeFood = async (query: string): Promise<NutritionData> => {
  try {
    // 1. Get Key
    let apiKey = process.env.API_KEY;

    // 2. Validate existence
    if (!apiKey) {
      throw new Error("API Key is not configured. Please add the variable 'API_KEY' in your Vercel Project Settings.");
    }

    // 3. Sanitize Key (Critical for Vercel/Copy-paste errors)
    // Removes whitespace and accidental quotes (e.g. if user entered "AIza..." with quotes)
    apiKey = apiKey.trim().replace(/^["']|["']$/g, '');

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the nutritional content of: "${query}". 
      If the user did not specify a quantity, assume a standard serving size (e.g., 1 medium apple, 100g chicken breast, 1 cup of rice).
      Provide a realistic estimate.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING, description: "The standardized name of the food identified." },
            servingSize: { type: Type.STRING, description: "The serving size used for calculation (e.g., '1 medium (182g)', '1 cup')." },
            calories: { type: Type.NUMBER, description: "Total calories in kcal." },
            protein: { type: Type.NUMBER, description: "Protein content in grams." },
            carbs: { type: Type.NUMBER, description: "Total carbohydrates in grams." },
            fat: { type: Type.NUMBER, description: "Total fat in grams." },
            fiber: { type: Type.NUMBER, description: "Dietary fiber in grams." },
            sugar: { type: Type.NUMBER, description: "Total sugars in grams." },
            healthTip: { type: Type.STRING, description: "A brief, 1-sentence interesting health fact or tip about this food." },
          },
          required: ["foodName", "servingSize", "calories", "protein", "carbs", "fat", "fiber", "sugar", "healthTip"],
        },
      },
    });

    if (!response.text) {
      throw new Error("The AI model returned an empty response. Please try again.");
    }

    // Clean the response text to remove any potential markdown formatting
    let cleanText = response.text.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```json\s?/, '').replace(/^```\s?/, '').replace(/```$/, '');
    }
    
    try {
      const data = JSON.parse(cleanText) as NutritionData;
      return data;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw Text:", response.text);
      throw new Error("Failed to parse nutrition data. The AI response was not valid JSON.");
    }
    
  } catch (error: any) {
    console.error("Error analyzing food:", error);
    
    // Check for specific Google API errors regarding keys
    const errorMsg = error?.message || error?.toString() || '';
    if (errorMsg.includes('API key') || errorMsg.includes('400')) {
      throw new Error("API Key is invalid. Please check your Vercel settings and ensure the key has no extra spaces or quotes.");
    }

    throw error;
  }
};