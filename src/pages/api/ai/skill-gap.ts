export const prerender = false;

import type { APIRoute } from 'astro';
import { getGeminiAI, GEMINI_MODEL } from '../../../lib/gemini';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { jobDescription, skills, workExperience, projects } = body;

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Job description is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const ai = getGeminiAI();

    // Build current skills context
    const currentSkills = skills
      ?.map((cat: { category: string; items: string[] }) => 
        `${cat.category}: ${cat.items.join(', ')}`
      )
      ?.join('\n') || 'No skills listed';

    const experienceContext = workExperience
      ?.map((exp: { jobTitle: string; company: string; responsibilities: string[] }) => 
        `${exp.jobTitle} at ${exp.company}: ${exp.responsibilities?.join('; ') || 'N/A'}`
      )
      ?.join('\n') || 'No work experience';

    const projectsContext = projects
      ?.map((proj: { name: string; description: string; techStack: string[] }) => 
        `${proj.name} (${proj.techStack?.join(', ') || 'N/A'}): ${proj.description}`
      )
      ?.join('\n') || 'No projects';

    const prompt = `You are a career advisor and ATS (Applicant Tracking System) expert. Analyze the gap between a candidate's current skills/experience and a target job description.

Rules:
- Be specific and actionable
- Reference actual skills from both the job description and the candidate's profile  
- Prioritize the most impactful gaps first
- Write in the same language as the job description (if Indonesian, respond in Indonesian)
- Use this exact format with these section headers:

✅ SKILL YANG SUDAH COCOK:
- List skills the candidate already has that match the job description
- Be specific about which skills match

⚠️ SKILL GAP (Perlu Ditambahkan):
- List skills mentioned in the job description that the candidate lacks
- For each, briefly explain why it matters for the role

💡 SARAN UNTUK MENONJOLKAN:
- Suggest which existing skills to emphasize more prominently
- Recommend how to frame existing experience to better match the job
- Suggest 1-2 quick wins (e.g., certifications, projects) to close the gap

Return ONLY the analysis in the format above, no extra commentary.

TARGET JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S CURRENT SKILLS:
${currentSkills}

CANDIDATE'S WORK EXPERIENCE:
${experienceContext}

CANDIDATE'S PROJECTS:
${projectsContext}

Analyze the skill gap:`;

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
    console.error('AI Skill Gap Error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
