import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

export function getGeminiAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = import.meta.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env file.');
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export const GEMINI_MODEL = 'gemini-2.5-flash';
