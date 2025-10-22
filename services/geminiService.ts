import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

// Conditionally initialize the AI client only if an API key is provided.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!ai) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  // If the AI client wasn't initialized, return a fallback description immediately.
  if (!ai) {
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
