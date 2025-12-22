import { NextRequest, NextResponse } from 'next/server';
import { ChatGroq } from '@langchain/groq';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { getRelevantContext } from '@/lib/rag/vectorStore';

// Initialize Groq LLM
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'openai/gpt-oss-120b',
  temperature: 0.3,
});

// RAG System for Resume Analysis
// Uses vector store for retrieving relevant market standards

interface AnalysisResult {
  overallScore: number;
  sections: {
    title: string;
    score: number;
    feedback: string;
    suggestions: string[];
  }[];
  marketComparison: {
    strengths: string[];
    gaps: string[];
    inDemandSkills: string[];
  };
  tips: string[];
  summary: string;
}

// Prompt template for resume analysis with RAG context
const analysisPromptTemplate = PromptTemplate.fromTemplate(`
You are an expert resume analyst and career coach. Analyze the following resume against current market standards.

## Market Standards Context (Retrieved from Knowledge Base):
{marketContext}

## Resume to Analyze:
{resumeText}

Analyze this resume and provide a detailed JSON response with the following structure:
{{
  "overallScore": <number 0-100>,
  "sections": [
    {{
      "title": "Contact Information",
      "score": <number 0-100>,
      "feedback": "<brief feedback>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    }},
    {{
      "title": "Professional Summary",
      "score": <number 0-100>,
      "feedback": "<brief feedback>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    }},
    {{
      "title": "Work Experience",
      "score": <number 0-100>,
      "feedback": "<brief feedback>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    }},
    {{
      "title": "Skills & Technologies",
      "score": <number 0-100>,
      "feedback": "<brief feedback>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    }},
    {{
      "title": "Education & Certifications",
      "score": <number 0-100>,
      "feedback": "<brief feedback>",
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    }}
  ],
  "marketComparison": {{
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "gaps": ["<gap 1>", "<gap 2>", "<gap 3>"],
    "inDemandSkills": ["<skill they should learn 1>", "<skill 2>", "<skill 3>", "<skill 4>", "<skill 5>"]
  }},
  "tips": [
    "<actionable tip 1>",
    "<actionable tip 2>",
    "<actionable tip 3>",
    "<actionable tip 4>",
    "<actionable tip 5>",
    "<actionable tip 6>"
  ],
  "summary": "<2-3 sentence overall assessment>"
}}

Be specific, actionable, and constructive in your feedback. Consider current 2024-2025 job market trends.
Return ONLY valid JSON, no additional text or markdown.
`);

// Create the LangChain chain
const analysisChain = RunnableSequence.from([
  analysisPromptTemplate,
  llm,
  new StringOutputParser(),
]);

// Fallback constants for rule-based analysis
const marketStandards = {
  inDemandSkills: {
    tech: ['React', 'TypeScript', 'Python', 'AWS', 'Docker', 'Kubernetes', 'AI/ML', 'Node.js', 'GraphQL', 'CI/CD'],
    soft: ['Leadership', 'Communication', 'Problem-solving', 'Teamwork', 'Agile', 'Project Management'],
  },
  formatting: {
    idealLength: { min: 400, max: 800 },
    actionVerbs: ['Developed', 'Implemented', 'Led', 'Created', 'Managed', 'Optimized', 'Designed', 'Built', 'Achieved', 'Delivered'],
  },
};

// Helper function to extract text from different file types
async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  
  if (fileType === 'text/plain') {
    return await file.text();
  }
  
  if (fileType === 'application/pdf') {
    // PDF extraction using pdf-parse
    try {
      const pdfParse = await import('pdf-parse');
      const buffer = Buffer.from(await file.arrayBuffer());
      // Handle both ESM and CJS exports
      const parseFn = typeof pdfParse === 'function' ? pdfParse : (pdfParse.default || pdfParse);
      const pdfData = await (parseFn as (buffer: Buffer) => Promise<{ text: string }>)(buffer);
      return pdfData.text;
    } catch (error) {
      console.error('PDF parsing error:', error);
      // Fallback: try basic text extraction
      const buffer = await file.arrayBuffer();
      const text = new TextDecoder().decode(buffer);
      // Extract readable text between common PDF markers
      const cleanText = text
        .replace(/[\x00-\x1F\x7F-\xFF]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return cleanText;
    }
  }
  
  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    // DOCX extraction
    try {
      const buffer = await file.arrayBuffer();
      const JSZip = (await import('jszip')).default;
      const zip = await JSZip.loadAsync(buffer);
      const content = await zip.file('word/document.xml')?.async('string');
      
      if (content) {
        // Extract text from XML, removing tags
        const text = content
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        return text;
      }
    } catch (error) {
      console.error('DOCX parsing error:', error);
    }
    
    // Fallback
    const buffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(buffer);
    return text;
  }
  
  return await file.text();
}

// Analyze resume sections
function analyzeSections(text: string): AnalysisResult['sections'] {
  const sections: AnalysisResult['sections'] = [];
  
  // Contact Information
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  const hasLinkedIn = /linkedin/i.test(text);
  
  let contactScore = 0;
  if (hasEmail) contactScore += 40;
  if (hasPhone) contactScore += 30;
  if (hasLinkedIn) contactScore += 30;
  
  sections.push({
    title: 'Contact Information',
    score: contactScore,
    feedback: contactScore >= 70 
      ? 'Good contact information provided' 
      : 'Missing some contact details',
    suggestions: [
      ...(!hasEmail ? ['Add a professional email address'] : []),
      ...(!hasPhone ? ['Include a phone number'] : []),
      ...(!hasLinkedIn ? ['Add your LinkedIn profile URL'] : []),
    ],
  });
  
  // Professional Summary
  const hasSummary = /summary|objective|profile|about/i.test(text);
  const summaryScore = hasSummary ? 75 : 30;
  
  sections.push({
    title: 'Professional Summary',
    score: summaryScore,
    feedback: hasSummary 
      ? 'Summary section detected' 
      : 'No clear professional summary found',
    suggestions: hasSummary 
      ? ['Consider making your summary more impactful with quantified achievements']
      : ['Add a professional summary at the top highlighting your key strengths'],
  });
  
  // Work Experience
  const hasExperience = /experience|work history|employment/i.test(text);
  const hasActionVerbs = marketStandards.formatting.actionVerbs.some(verb => 
    new RegExp(verb, 'i').test(text)
  );
  const hasMetrics = /\d+%|\$\d+|\d+ (years|months|projects|clients|users)/i.test(text);
  
  let expScore = 0;
  if (hasExperience) expScore += 40;
  if (hasActionVerbs) expScore += 30;
  if (hasMetrics) expScore += 30;
  
  sections.push({
    title: 'Work Experience',
    score: expScore,
    feedback: expScore >= 70 
      ? 'Strong experience section with good details' 
      : 'Experience section needs improvement',
    suggestions: [
      ...(!hasActionVerbs ? ['Use action verbs to start bullet points (Led, Developed, Implemented)'] : []),
      ...(!hasMetrics ? ['Add quantifiable achievements and metrics'] : []),
      ...(!hasExperience ? ['Add a clear work experience section'] : []),
    ],
  });
  
  // Skills Section
  const hasSkills = /skills|technologies|competencies|expertise/i.test(text);
  const techSkillsFound = marketStandards.inDemandSkills.tech.filter(skill => 
    new RegExp(skill, 'i').test(text)
  );
  
  const skillScore = hasSkills ? Math.min(50 + techSkillsFound.length * 10, 100) : 30;
  
  sections.push({
    title: 'Skills & Technologies',
    score: skillScore,
    feedback: techSkillsFound.length > 3 
      ? `Good skills coverage with ${techSkillsFound.length} in-demand skills` 
      : 'Skills section could be more comprehensive',
    suggestions: [
      ...(!hasSkills ? ['Add a dedicated skills section'] : []),
      ...(techSkillsFound.length < 5 ? ['Consider adding more in-demand technical skills'] : []),
    ],
  });
  
  // Education
  const hasEducation = /education|degree|university|college|bachelor|master|phd/i.test(text);
  const educationScore = hasEducation ? 80 : 40;
  
  sections.push({
    title: 'Education',
    score: educationScore,
    feedback: hasEducation 
      ? 'Education section present' 
      : 'Education information is missing or unclear',
    suggestions: hasEducation 
      ? ['Include relevant coursework or certifications']
      : ['Add your educational background'],
  });
  
  return sections;
}

// Compare with market standards
function compareWithMarket(text: string): AnalysisResult['marketComparison'] {
  const techSkillsFound = marketStandards.inDemandSkills.tech.filter(skill => 
    new RegExp(skill, 'i').test(text)
  );
  const softSkillsFound = marketStandards.inDemandSkills.soft.filter(skill => 
    new RegExp(skill, 'i').test(text)
  );
  const missingSkills = marketStandards.inDemandSkills.tech.filter(skill => 
    !new RegExp(skill, 'i').test(text)
  );
  
  const strengths: string[] = [];
  const gaps: string[] = [];
  
  if (techSkillsFound.length >= 3) {
    strengths.push(`Strong technical foundation with ${techSkillsFound.join(', ')}`);
  }
  if (softSkillsFound.length >= 2) {
    strengths.push('Good soft skills highlighted');
  }
  if (/\d+%|\d+ (years|projects)/i.test(text)) {
    strengths.push('Includes quantifiable achievements');
  }
  if (/github|portfolio|website/i.test(text)) {
    strengths.push('Portfolio or code samples linked');
  }
  
  if (techSkillsFound.length < 3) {
    gaps.push('Limited technical skills mentioned');
  }
  if (!/\d+%/i.test(text)) {
    gaps.push('Missing metrics and percentages in achievements');
  }
  if (!/certif/i.test(text)) {
    gaps.push('No certifications mentioned');
  }
  if (softSkillsFound.length < 2) {
    gaps.push('Limited soft skills highlighted');
  }
  
  return {
    strengths: strengths.length > 0 ? strengths : ['Resume submitted for review'],
    gaps: gaps.length > 0 ? gaps : ['No major gaps identified'],
    inDemandSkills: missingSkills.slice(0, 6),
  };
}

// Generate tips
function generateTips(text: string, sections: AnalysisResult['sections']): string[] {
  const tips: string[] = [];
  const wordCount = text.split(/\s+/).length;
  
  if (wordCount < marketStandards.formatting.idealLength.min) {
    tips.push('Your resume is quite short. Consider adding more details about your accomplishments and responsibilities.');
  }
  if (wordCount > marketStandards.formatting.idealLength.max) {
    tips.push('Your resume is lengthy. Focus on the most relevant and impactful experiences.');
  }
  
  tips.push('Use the STAR method (Situation, Task, Action, Result) to describe achievements.');
  tips.push('Tailor your resume for each job application by matching keywords from the job description.');
  tips.push('Keep formatting consistent - use the same font, spacing, and bullet style throughout.');
  tips.push("Include links to your portfolio, GitHub, or professional projects if applicable.");
  
  const lowScoreSections = sections.filter(s => s.score < 60);
  if (lowScoreSections.length > 0) {
    tips.push(`Focus on improving: ${lowScoreSections.map(s => s.title).join(', ')}`);
  }
  
  return tips.slice(0, 6);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Extract text from file
    const text = await extractTextFromFile(file);
    
    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from file. Please try a different format.' },
        { status: 400 }
      );
    }
    
    // Use RAG Vector Store to get relevant context
    console.log('Fetching relevant context from vector store...');
    const ragContext = await getRelevantContext(text);
    console.log('RAG context retrieved, length:', ragContext.length);
    
    // Use LangChain with RAG context for analysis
    try {
      const result = await analysisChain.invoke({
        marketContext: ragContext,
        resumeText: text,
      });
      
      // Parse the JSON response from LLM
      const cleanedResult = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const analysis: AnalysisResult = JSON.parse(cleanedResult);
      
      return NextResponse.json(analysis);
      
    } catch (llmError) {
      console.error('LLM analysis error, falling back to rule-based:', llmError);
      
      // Fallback to rule-based analysis if LLM fails
      const sections = analyzeSections(text);
      const overallScore = Math.round(
        sections.reduce((sum, section) => sum + section.score, 0) / sections.length
      );
      const marketComparison = compareWithMarket(text);
      const tips = generateTips(text, sections);
      
      let summary = '';
      if (overallScore >= 80) {
        summary = 'Excellent resume! Your resume is well-structured and competitive for the current market.';
      } else if (overallScore >= 60) {
        summary = 'Good foundation! With some improvements, your resume can stand out more to recruiters.';
      } else {
        summary = 'Your resume needs work. Focus on the suggested improvements to increase your chances.';
      }
      
      const fallbackResult: AnalysisResult = {
        overallScore,
        sections,
        marketComparison,
        tips,
        summary,
      };
      
      return NextResponse.json(fallbackResult);
    }
    
  } catch (error) {
    console.error('Resume analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}
