
import { GoogleGenAI, Type } from "@google/genai";
import { PlantInfo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const identifyPlant = async (base64Image: string): Promise<PlantInfo> => {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: "Identify this plant from the image. Provide the common name, scientific name, a short description, and 3 care tips.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          scientificName: { type: Type.STRING },
          description: { type: Type.STRING },
          careTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["name", "scientificName", "description", "careTips"],
      },
    },
  });

  return JSON.parse(response.text || '{}');
};

export const identifyPlantByDescription = async (description: string): Promise<PlantInfo> => {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          {
            text: `Identify a plant based on this verbal description: "${description}". Provide the common name, scientific name, a short description, and 3 care tips. If you are not sure, pick the most likely candidate based on common garden plants in Southeast Asia.`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          scientificName: { type: Type.STRING },
          description: { type: Type.STRING },
          careTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["name", "scientificName", "description", "careTips"],
      },
    },
  });

  return JSON.parse(response.text || '{}');
};
