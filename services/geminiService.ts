
import { GoogleGenAI } from "@google/genai";

// Assume API_KEY is set in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  if (!API_KEY) {
    return `High-quality ${productName}, freshly harvested and ready for your customers. A staple in the ${category} category, perfect for a variety of uses.`;
  }

  try {
    const prompt = `Generate a compelling and brief marketplace description for an agricultural product. The product is "${productName}" in the category "${category}". Focus on freshness, quality, and appeal to wholesalers and retailers. Do not use markdown.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating product description with Gemini:", error);
    // Return a fallback description in case of an API error
    return `Premium ${productName} from the ${category} category. Sourced for quality and freshness. Ideal for discerning buyers looking for top-tier produce.`;
  }
};
