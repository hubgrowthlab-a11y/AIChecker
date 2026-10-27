import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChecklistPoint, ReferenceDocument, EmailDraft, ReviewResult, IssueFinding } from '@/types';
import { runBuiltinReviewEngine } from '@/lib/aiReviewEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { draft, checklist, referenceDocs, apiKey, model } = body as {
      draft: EmailDraft;
      checklist: ChecklistPoint[];
      referenceDocs: ReferenceDocument[];
      apiKey?: string;
      model?: string;
    };

    if (!draft || !draft.body) {
      return NextResponse.json({ error: 'Email draft body is required' }, { status: 400 });
    }

    const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY;

    // If no API key is available, execute built-in rule engine
    if (!effectiveApiKey) {
      const result = runBuiltinReviewEngine(draft, checklist, referenceDocs);
      return NextResponse.json({ reviewResult: result, engine: 'builtin-offline' });
    }

    const openai = new OpenAI({ apiKey: effectiveApiKey });

    // Format prompt with strict grounding constraints
    const prompt = `You are the Parent Email Review Agent, a quality-assurance assistant for school educators.
Your task is to review the following parent email draft against the given active checklist points and reference documents.

CRITICAL GROUNDING RULES:
1. Never invent or assume missing facts, unverified school policies, student grades, dates, or names.
2. If details are missing (e.g. specific room number, meeting time), flag them for human verification with [Teacher Note: ...] instead of fabricating info.
3. STRICT FERPA / PRIVACY: If any third-party student names, disciplinary actions, or injuries are mentioned, flag as Critical Failure and provide redacted replacement.
4. Maintain empathetic, constructive tone; preserve all commitments and facts.

EMAIL DRAFT:
- Recipient: ${draft.recipient || 'Not specified'}
- Student Name: ${draft.studentName || 'Not specified'}
- Subject: ${draft.subject}
- Body:
"""
${draft.body}
"""

ACTIVE CHECKLIST POINTS (Evaluate ALL of them):
${checklist
  .map(
    (c, i) => `${i + 1}. [${c.id}] ${c.title} (Severity: ${c.severity}, Mandatory: ${c.isMandatory})
Description: ${c.description}
Guidelines: ${c.guidelines}`
  )
  .join('\n\n')}

APPROVED REFERENCE DOCUMENTS & SCHOOL POLICIES:
${referenceDocs
  .slice(0, 3)
  .map(d => `--- ${d.title} (${d.filename}) ---\n${d.content.slice(0, 600)}...`)
  .join('\n\n')}

RETURN A VALID JSON OBJECT matching this exact TypeScript structure:
{
  "summary": "Concise summary of findings (1-2 sentences)",
  "overallScore": 85, // Integer 0-100
  "suggestedSubject": "Polished subject line",
  "suggestedBody": "Full polished email body with all issues corrected, preserving facts",
  "findings": [
    {
      "checklistId": "chk-1",
      "checklistTitle": "Professional and respectful tone",
      "status": "Pass" | "Fail" | "Needs Review" | "Not Applicable",
      "severity": "Critical" | "High" | "Medium" | "Low",
      "explanation": "Clear reason for finding",
      "exactText": "Offending or noteworthy snippet from original email (empty string if Pass)",
      "suggestedCorrection": "Correction or rewrite for this snippet",
      "referenceDocName": "Optional name of cited reference doc",
      "referenceExcerpt": "Optional quoted policy text"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: model || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert school communications auditor. You always return strictly valid JSON matching the requested schema without markdown code blocks.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    const parsed = JSON.parse(content);

    const reviewResult: ReviewResult = {
      id: `rev-openai-${Date.now()}`,
      timestamp: new Date().toISOString(),
      recipient: draft.recipient,
      studentName: draft.studentName,
      subject: parsed.suggestedSubject || draft.subject,
      originalBody: draft.body,
      suggestedBody: parsed.suggestedBody || draft.body,
      currentBody: draft.body,
      findings: (parsed.findings || []).map((f: any, idx: number) => ({
        id: `find-ai-${idx}-${Date.now()}`,
        checklistId: f.checklistId,
        checklistTitle: f.checklistTitle,
        status: f.status || 'Pass',
        severity: f.severity || 'Medium',
        explanation: f.explanation || '',
        exactText: f.exactText || '',
        suggestedCorrection: f.suggestedCorrection || '',
        referenceDocName: f.referenceDocName || '',
        referenceExcerpt: f.referenceExcerpt || '',
        applied: false,
        dismissed: false,
        confidenceScore: 95,
      })),
      overallScore: typeof parsed.overallScore === 'number' ? parsed.overallScore : 85,
      summary: parsed.summary || 'AI review completed successfully.',
      isApproved: false,
      status: 'reviewed',
      checklistVersion: 'v1.0.0-demo',
    };

    return NextResponse.json({ reviewResult, engine: 'openai' });
  } catch (error: any) {
    console.error('Error in AI review API route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to review email with OpenAI' },
      { status: 500 }
    );
  }
}
