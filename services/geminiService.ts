
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    suggestedSchedule: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          duration: { type: Type.STRING },
          category: { type: Type.STRING, enum: ['work', 'personal', 'focus', 'rest'] },
          startTime: { type: Type.STRING },
          completed: { type: Type.BOOLEAN }
        },
        required: ['id', 'title', 'duration', 'category']
      }
    },
    reasoning: { type: Type.STRING },
    tips: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ['suggestedSchedule', 'reasoning', 'tips']
};

export const generateSmartPlan = async (userInput: string): Promise<AIResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userInput,
      config: {
        systemInstruction: `You are a high-performance AI Time Management Assistant named "Zamani". 
        Your goal is to take user requests (in Arabic or English) about their projects, goals, and constraints, 
        and return a structured JSON plan. 
        Focus on: 
        1. Deep work (Focus Blocks).
        2. Break times.
        3. Prioritization.
        Always reply in Arabic for reasoning and tips.`,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text) as AIResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
