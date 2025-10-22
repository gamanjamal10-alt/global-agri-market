
import { GoogleGenAI } from "@google/genai";

// Fix: Per guidelines, API_KEY is assumed to be available in process.env.
// The client should be initialized directly without conditional checks.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
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
