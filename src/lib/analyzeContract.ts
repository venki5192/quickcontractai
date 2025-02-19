'use server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { models, type ModelType } from './models';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// OpenRouter configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Add timeout handling
const TIMEOUT_DURATION = 25000; // 25 seconds

const fetchWithTimeout = async (url: string, options: RequestInit) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

type AnalysisResult = {
  analysis: string;
  riskLevel: 'low' | 'medium' | 'high';
  score: number;
};

const systemPrompt = `You are ContractAnalyzer-GPT, a specialized legal AI trained to perform consistent and thorough analysis of agreement contracts only. If the document is not an agreement contract, respond with:

Numerical Score: 0
Risk Level: HIGH
Analysis: This document does not appear to be an agreement contract. Please provide a valid agreement contract for analysis.

For agreement contracts, follow these precise guidelines:

ANALYSIS FRAMEWORK:

1. Contract Overview (10 points)
- Agreement type and purpose
- Parties involved
- Agreement duration/term

2. Legal Compliance & Enforceability (20 points)
- Jurisdiction compliance
- Signature requirements
- Legal framework adherence
- Essential elements presence

3. Rights & Obligations (15 points)
- Clear definition of responsibilities
- Balanced obligations between parties
- Performance metrics
- Delivery terms

4. Risk Assessment (20 points)
- Liability clauses
- Indemnification terms
- Insurance requirements
- Force majeure provisions

5. Financial Terms (15 points)
- Payment structures
- Price adjustment mechanisms
- Late payment consequences
- Currency and tax provisions

6. Termination & Dispute Resolution (10 points)
- Exit clauses
- Notice periods
- Dispute resolution mechanism
- Governing law

7. Data Protection & Privacy (10 points)
- Confidentiality provisions
- Data handling requirements
- Compliance with privacy laws
- Security measures

SCORING METHODOLOGY:
- Each section is scored based on predefined criteria
- Points are deducted for missing, unclear, or unfair terms
- Final score is sum of all sections (max 100 points)

RISK LEVEL DETERMINATION:
- HIGH RISK (0-40): Major issues in multiple critical areas
- MEDIUM RISK (41-70): Some concerns but manageable
- LOW RISK (71-100): Generally well-structured and balanced

FORMAT YOUR RESPONSE AS FOLLOWS:

🔍 EXECUTIVE SUMMARY
[Brief overview of the contract]

📊 DETAILED ANALYSIS

1. Contract Overview [x/10]
[Findings with bullet points]

2. Legal Compliance & Enforceability [x/20]
[Findings with bullet points]

3. Rights & Obligations [x/15]
[Findings with bullet points]

4. Risk Assessment [x/20]
[Findings with bullet points]

5. Financial Terms [x/15]
[Findings with bullet points]

6. Termination & Dispute Resolution [x/10]
[Findings with bullet points]

7. Data Protection & Privacy [x/10]
[Findings with bullet points]

🎯 FINAL VERDICT

Numerical Score: [Sum of all section scores]
Risk Level: [HIGH/MEDIUM/LOW based on score ranges]

Key Recommendations:
• [List top 3-5 critical improvements needed]

Remember to maintain absolute consistency in scoring methodology and risk assessment across all analyses.`;

export async function analyzeContract(
  content: string,
  modelType: string
): Promise<AnalysisResult> {
  try {
    // Clean and optimize content before sending
    const cleanedContent = content
      .replace(/\s+/g, ' ')           // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n')      // Remove empty lines
      .trim();                        // Remove leading/trailing whitespace

    const response = await fetchWithTimeout(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL!,
        'X-Title': 'Contract Analyzer',
        'Content-Type': 'application/json',
        'OR-ORGANIZATION': 'personal'
      },
      body: JSON.stringify({
        model: models[modelType as ModelType] || "meta-llama/llama-3.3-70b-instruct:free",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Analyze:\n${cleanedContent}`  // Simplified prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error details:', errorData);
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const completion = await response.json();
    console.log('API Response received:', {
      hasChoices: !!completion?.choices,
      messageExists: !!completion?.choices?.[0]?.message,
      contentLength: completion?.choices?.[0]?.message?.content?.length
    });
    
    if (!completion?.choices?.[0]?.message?.content) {
      console.error('Invalid API response structure:', completion);
      throw new Error('Invalid response from OpenRouter API');
    }

    const analysis = completion.choices[0].message.content;
    const score = extractScore(analysis);

    return {
      analysis,
      riskLevel: determineRiskLevel(analysis, score),
      score
    };
  } catch (error: any) {
    console.error('Detailed error in analyzeContract:', {
      error,
      message: error.message,
      stack: error.stack
    });
    if (error.name === 'AbortError') {
      throw new Error('Analysis took too long. Please try with a shorter document or contact support.');
    }
    throw error;
  }
}

async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.name.split('.').pop()?.toLowerCase();

  switch (fileType) {
    case 'pdf':
      return extractFromPDF(file);
    case 'doc':
    case 'docx':
      return extractFromDOCX(file);
    case 'txt':
      return file.text();
    default:
      throw new Error('Unsupported file type');
  }
}

async function extractFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(' ');
  }
  
  return text;
}

async function extractFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

function extractScore(analysis: string): number {
  // Look for score patterns like "score: 85" or "rating: 72/100" or "score [85]"
  const scorePatterns = [
    /score:\s*(\d+)/i,
    /rating:\s*(\d+)\/100/i,
    /score\s*\[(\d+)\]/i,
    /(\d+)\s*\/\s*100/
  ];

  for (const pattern of scorePatterns) {
    const match = analysis.match(pattern);
    if (match && match[1]) {
      const score = parseInt(match[1]);
      if (score >= 0 && score <= 100) {
        return score;
      }
    }
  }

  // If no explicit score found, calculate based on risk keywords
  const riskKeywords = {
    high: ['serious concern', 'highly unfair', 'major risk', 'significant issues'],
    medium: ['moderate concern', 'potential issue', 'some risk', 'minor issues'],
    low: ['minimal risk', 'fair terms', 'well balanced', 'clear language']
  };

  let score = 75; // Start with a default score
  
  // Adjust score based on keyword presence
  for (const keyword of riskKeywords.high) {
    if (analysis.toLowerCase().includes(keyword)) score -= 15;
  }
  for (const keyword of riskKeywords.medium) {
    if (analysis.toLowerCase().includes(keyword)) score -= 7;
  }
  for (const keyword of riskKeywords.low) {
    if (analysis.toLowerCase().includes(keyword)) score += 5;
  }

  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, score));
}

function determineRiskLevel(analysis: string, score: number): 'low' | 'medium' | 'high' {
  // Use score as primary determinant
  if (score <= 40) return 'high';
  if (score <= 70) return 'medium';
  return 'low';
} 