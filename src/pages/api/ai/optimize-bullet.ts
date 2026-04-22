export const prerender = false;

import type { APIRoute } from 'astro';
import { getGeminiAI, GEMINI_MODEL } from '../../../lib/gemini';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { text, jobTitle, context } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const ai = getGeminiAI();

    const prompt = `You are a professional resume writer and career coach. Your task is to transform passive, weak job descriptions into powerful, results-oriented bullet points using strong action verbs.

Rules:
- Start each bullet point with a STRONG ACTION VERB (e.g., Developed, Engineered, Led, Optimized, Spearheaded, Architected, Implemented, Launched, Streamlined, etc.)
- Include quantifiable metrics where possible (percentages, numbers, dollar amounts)
- Focus on RESULTS and IMPACT, not just duties
- Keep each bullet point concise (1-2 lines max)
- Return ONLY the optimized bullet points, one per line, starting with "- "
- Do NOT add any explanation or commentary
- Maintain the same meaning/context but make it sound more impactful
- Write in the same language as the input (if Indonesian, keep Indonesian. If English, keep English)

${jobTitle ? `Job Title context: ${jobTitle}` : ''}
${context ? `Additional context: ${context}` : ''}

Original text to optimize:
${text}

Optimized bullet points:`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const result = response.text?.trim() || '';

    return new Response(
      JSON.stringify({ result }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('AI Optimize Bullet Error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
