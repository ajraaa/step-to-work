export const prerender = false;

import type { APIRoute } from 'astro';
import { getGeminiAI, GEMINI_MODEL } from '../../../lib/gemini';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { personalInfo, workExperience, education, skills, projects } = body;

    if (!personalInfo) {
      return new Response(
        JSON.stringify({ error: 'Personal info is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const ai = getGeminiAI();

    // Build context from CV data
    const skillsList = skills
      ?.flatMap((cat: { category: string; items: string[] }) => cat.items)
      ?.join(', ') || 'Not specified';

    const experienceContext = workExperience
      ?.map((exp: { jobTitle: string; company: string; responsibilities: string[] }) => 
        `${exp.jobTitle} at ${exp.company}: ${exp.responsibilities?.join('; ') || 'N/A'}`
      )
      ?.join('\n') || 'No work experience listed';

    const educationContext = education
      ?.map((edu: { degree: string; institution: string }) => 
        `${edu.degree} from ${edu.institution}`
      )
      ?.join(', ') || 'Not specified';

    const projectsContext = projects
      ?.map((proj: { name: string; description: string; techStack: string[] }) => 
        `${proj.name}: ${proj.description} (${proj.techStack?.join(', ') || 'N/A'})`
      )
      ?.join('\n') || 'No projects listed';

    const prompt = `You are a professional resume writer. Generate a compelling, personalized professional summary for a resume/CV.

Rules:
- Write EXACTLY 2-3 sentences
- Be specific and personalized — reference actual skills, experience, and achievements
- Use confident, professional tone
- Avoid clichés like "team player", "hard-working", "passionate"
- Include years of experience if derivable from the data
- Mention key technical skills or domain expertise
- End with a forward-looking statement about value the candidate brings
- Return ONLY the summary text, no quotes, no labels, no extra formatting
- Write in the same language as the input data (if Indonesian names/context, write in Indonesian)

Candidate Data:
- Name: ${personalInfo.fullName || 'N/A'}
- Target Position: ${personalInfo.jobTitle || 'N/A'}
- Location: ${personalInfo.location || 'N/A'}

Work Experience:
${experienceContext}

Education:
${educationContext}

Skills: ${skillsList}

Projects:
${projectsContext}

Generate the professional summary:`;

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
    console.error('AI Generate Summary Error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
