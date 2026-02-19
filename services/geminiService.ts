import { Type } from "@google/genai";
import { PlantInfo } from "../types";

// Helper function to call the serverless API
const callGeminiApi = async (payload: any) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Throw a specific error that can be caught by the UI
      throw new Error(errorData.error || `Server Error: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.text || '{}');
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};

export const identifyPlant = async (base64Image: string): Promise<PlantInfo> => {
  const model = "gemini-1.5-flash";

  const contents = [
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
  ];

  const config = {
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
  };

  return callGeminiApi({ model, contents, config });
};

export const identifyPlantByDescription = async (description: string): Promise<PlantInfo> => {
  const model = "gemini-1.5-flash";

  const contents = [
    {
      parts: [
        {
          text: `Identify a plant based on this verbal description: "${description}". Provide the common name, scientific name, a short description, and 3 care tips. If you are not sure, pick the most likely candidate based on common garden plants in Southeast Asia.`,
        },
      ],
    },
  ];

  const config = {
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
  };

  return callGeminiApi({ model, contents, config });
};
