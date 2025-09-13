import { GoogleGenAI, Type } from "@google/genai";
import type { HsCodePrediction, Clarification, PredictionResult } from '../types';
import type { Language } from '../translations';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const hsCodePredictionSchema = {
  type: Type.OBJECT,
  properties: {
    hs_code: {
      type: Type.STRING,
      description: "The 6-digit Harmonized System (HS) code for the item.",
    },
    description: {
      type: Type.STRING,
      description: "A concise description of the product corresponding to the HS code.",
    },
    reasoning: {
      type: Type.STRING,
      description: "A brief explanation for why this HS code is suggested based on the image.",
    },
    tariff: {
      type: Type.STRING,
      description: "The import duty tariff information (e.g., 'BM 5%') based on Indonesian regulations (BTKI), if available. Otherwise, null or an empty string.",
    },
    classification_steps: {
        type: Type.STRING,
        description: "A single string outlining the step-by-step classification process according to KUMHS/BTKI rules, formatted as a Markdown numbered list (e.g., '1. Identifikasi barang...\\n2. Berdasarkan KUMHS...'). Required for Indonesian responses.",
    }
  },
  required: ["hs_code", "description", "reasoning"],
};

const hsCodeSchema = {
  type: Type.ARRAY,
  items: hsCodePredictionSchema,
};

const predictionAndClarificationSchema = {
    type: Type.OBJECT,
    properties: {
        predictions: hsCodeSchema,
        clarification: {
            type: Type.OBJECT,
            properties: {
                question: {
                    type: Type.STRING,
                    description: "A single, concise question for the user to help differentiate between HS code options."
                },
                options: {
                    type: Type.ARRAY,
                    description: "An array of 2-4 short, distinct string options for the user to choose from as answers.",
                    items: { type: Type.STRING }
                }
            },
            description: "A question and options to ask the user ONLY IF the provided HS code suggestions are distinct and need clarification to determine the correct one. If a clarification question is not necessary, this field should be null or omitted.",
        }
    },
    required: ["predictions"]
};


export const predictHsCodeFromImage = async (base64Image: string, mimeType: string, language: Language): Promise<PredictionResult> => {
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  };
  
  const languageInstruction = language === 'id' 
    ? " The 'description', 'reasoning', and 'tariff' fields in your JSON response must be in Indonesian. The 'classification_steps' must also be in Indonesian. The prediction must follow the Buku Tarif Kepabeanan Indonesia (BTKI) and KUMHS rules. Include import duty tariff information (Bea Masuk) if available."
    : language === 'ja'
    ? " The 'description' and 'reasoning' fields in your JSON response must be in Japanese."
    : "";

  const textPart = {
    text: language === 'id'
      ? `Analyze the item in this image. As an expert in Indonesian customs classification, identify the product and provide the three most likely 6-digit Harmonized System (HS) codes based on Buku Tarif Kepabeanan Indonesia (BTKI) and KUMHS rules. For each code, provide a description, a brief reasoning, the applicable import duty tariff (Bea Masuk), and a step-by-step breakdown of the classification process according to Ketentuan Umum untuk Menginterpretasi Harmonized System (KUMHS), formatted as a single Markdown string using a numbered list. The primary and most likely suggestion should be first. Additionally, if the suggestions represent genuinely different possibilities for the product's classification (e.g., based on material or primary use), generate a single, concise clarification question with 2-4 short options. If no clarification is needed, the clarification field should be omitted from the JSON response.${languageInstruction}`
      : `Analyze the item in this image. As an expert in international trade and customs classification, identify the product and provide the three most likely 6-digit Harmonized System (HS) codes. For each code, provide a description and a brief reasoning. The primary and most likely suggestion should be first. Additionally, if the suggestions represent genuinely different possibilities for the product's classification, generate a single, concise clarification question with 2-4 short options. If no clarification is needed, the clarification field should be omitted from the JSON response.${languageInstruction}`,
  };

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: predictionAndClarificationSchema,
            temperature: 0.2,
        }
    });

    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("API returned an empty response.");
    }

    const parsedResponse = JSON.parse(jsonText);
    
    if (parsedResponse && Array.isArray(parsedResponse.predictions)) {
      return parsedResponse as PredictionResult;
    } else {
      throw new Error("API response is not in the expected format.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('429')) {
             throw new Error("The service is experiencing high demand. Please try again in a moment.");
        }
        throw new Error(`Failed to get HS code predictions: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching HS code predictions.");
  }
};

export const getRefinedPrediction = async (
    base64Image: string,
    mimeType: string,
    initialPredictions: HsCodePrediction[],
    clarification: Clarification,
    userAnswer: string,
    language: Language
): Promise<HsCodePrediction> => {
    const formattedPredictions = initialPredictions.map(p => `- ${p.hs_code}: ${p.description}`).join('\n');
    const imagePart = {
        inlineData: {
        data: base64Image,
        mimeType: mimeType,
        },
    };

    const languageInstruction = language === 'id'
      ? " The 'description', 'reasoning', 'tariff', and 'classification_steps' fields in your JSON response must be in Indonesian. Your final decision must be compliant with Buku Tarif Kepabeanan Indonesia (BTKI)."
      : language === 'ja'
      ? " The 'description' and 'reasoning' fields in your JSON response must be in Japanese."
      : "";

    const textPart = {
        text: language === 'id'
          ? `An image of a product was analyzed, resulting in these initial HS Code suggestions based on Indonesian BTKI rules:
${formattedPredictions}

To clarify, this question was asked: "${clarification.question}"
The user provided this answer: "${userAnswer}"

Based on the user's answer, please provide the single, most accurate 6-digit HS code according to Buku Tarif Kepabeanan Indonesia (BTKI). Your response must include the final HS code, a clear description of the product, the applicable import duty tariff (Bea Masuk), detailed reasoning explaining why this code is correct given the user's clarification, and the step-by-step classification process according to KUMHS, formatted as a single Markdown string using a numbered list. The reasoning should explicitly reference the user's answer.${languageInstruction}`
          : `An image of a product was analyzed, resulting in these initial HS Code suggestions:
${formattedPredictions}

To clarify, this question was asked: "${clarification.question}"
The user provided this answer: "${userAnswer}"

Based on the user's answer, please provide the single, most accurate 6-digit HS code. Your response should include the final HS code, a clear description of the product, and detailed reasoning explaining why this code is correct given the user's clarification. The reasoning should explicitly reference the user's answer.${languageInstruction}`
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: hsCodePredictionSchema,
                temperature: 0.1,
            }
        });

        const jsonText = response.text;
        if (!jsonText) {
            throw new Error("API returned an empty response for refined prediction.");
        }
        return JSON.parse(jsonText) as HsCodePrediction;

    } catch (error) {
        console.error("Error getting refined prediction:", error);
        if (error instanceof Error) {
            if (error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('429')) {
                 throw new Error("The service is experiencing high demand. Please try again in a moment.");
            }
            throw new Error(`Failed to get refined prediction: ${error.message}`);
        }
        throw new Error("An unknown error occurred while getting the refined prediction.");
    }
};