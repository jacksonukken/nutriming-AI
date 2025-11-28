import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFood = async (query: string): Promise<NutritionData> => {
  try {
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
      throw new Error("No data returned from AI");
    }

    const data = JSON.parse(response.text) as NutritionData;
    return data;
  } catch (error) {
    console.error("Error analyzing food:", error);
    throw error;
  }
};