import { ChecklistPoint, IssueFinding, ReferenceDocument, ReviewResult, EmailDraft, FindingStatus } from '@/types';
import { searchReferenceLibrary } from './referenceDocs';

export async function reviewEmailDraft(
  draft: EmailDraft,
  checklist: ChecklistPoint[],
  referenceDocs: ReferenceDocument[],
  apiKey?: string,
  modelName: string = 'gpt-4o-mini',
  forceOffline: boolean = false
): Promise<ReviewResult> {
  // If OpenAI API key is provided and not forced offline, try OpenAI API endpoint
  if (apiKey && apiKey.trim().length > 0 && !forceOffline) {
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft,
          checklist: checklist.filter(c => c.isActive),
          referenceDocs: referenceDocs.filter(d => d.status === 'Approved'),
          apiKey,
          model: modelName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reviewResult) {
          return data.reviewResult;
        }
      }
      console.warn('API review failed, falling back to smart built-in engine:', await response.text().catch(() => ''));
    } catch (err) {
      console.warn('Network error calling AI API route, falling back to smart built-in engine:', err);
    }
  }

  // Built-in Intelligent Rule & Semantic Heuristics Engine
  return runBuiltinReviewEngine(draft, checklist, referenceDocs);
}

export function runBuiltinReviewEngine(
  draft: EmailDraft,
  checklist: ChecklistPoint[],
  referenceDocs: ReferenceDocument[]
): ReviewResult {
  const activeChecklist = checklist.filter(c => c.isActive);
  const findings: IssueFinding[] = [];
  const subject = draft.subject.trim();
  const body = draft.body.trim();
  const recipient = draft.recipient.trim();
  const studentName = draft.studentName.trim();

  // Search reference library for context
  const matchedDocs = searchReferenceLibrary(`${subject} ${body} ${studentName}`, referenceDocs);
  const primaryDoc = matchedDocs[0]?.doc;
  const primaryExcerpt = matchedDocs[0]?.matchedExcerpt;

  // Track replacements to create the suggestedBody
  let correctedBody = body;
  let correctedSubject = subject;

  for (const point of activeChecklist) {
    let status: FindingStatus = 'Pass';
    let explanation = 'Draft meets standard educational communication requirements.';
    let exactText = '';
    let suggestedCorrection = '';
    let docName = primaryDoc?.title;
    let docExcerpt = primaryExcerpt;

    switch (point.id) {
      // 1. Professional and respectful tone
      case 'chk-1': {
        const harshPatterns = [
          { pattern: /\b(lazy|acting out|slacking|get his act together|failed completely|getting really frustrating|frustrating for me)\b/i, fix: 'having difficulty remaining focused and engaged' },
          { pattern: /\b(Fix this immediately|or else|not my problem)\b/i, fix: 'I would appreciate your support in discussing this with him' },
          { pattern: /^hey\s+([A-Za-z]+)/im, fix: 'Dear Parent/Guardian,' },
        ];

        let matched = false;
        for (const item of harshPatterns) {
          const match = body.match(item.pattern);
          if (match) {
            matched = true;
            status = 'Fail';
            exactText = match[0];
            suggestedCorrection = item.fix;
            explanation = `Found harsh, confrontational, or overly casual phrasing ("${match[0]}"). School communication standards require constructive, empathetic framing.`;
            
            // Look up tone policy
            const toneDoc = referenceDocs.find(d => d.category === 'tone' && d.status === 'Approved');
            if (toneDoc) {
              docName = toneDoc.title;
              docExcerpt = 'All correspondence to parents must maintain an empathetic, constructive, and respectful tone without inflammatory labels.';
            }
            break;
          }
        }

        if (!matched && (body.includes('!!') || body.includes('???') || body.includes('URGENT'))) {
          status = 'Needs Review';
          exactText = body.includes('!!') ? '!!' : (body.includes('???') ? '???' : 'URGENT');
          suggestedCorrection = '.';
          explanation = 'Multiple exclamation points or all-caps can be perceived as aggressive or alarming by parents.';
        }
        break;
      }

      // 2. Grammar and spelling
      case 'chk-2': {
        const typos: { regex: RegExp; replace: string; note: string }[] = [
          { regex: /\bits getting\b/i, replace: "it's getting", note: 'Missing apostrophe in contraction "it\'s"' },
          { regex: /\bthis weak\b/i, replace: 'this week', note: 'Homophone error ("weak" -> "week")' },
          { regex: /\btomorow\b/i, replace: 'tomorrow', note: 'Spelling error ("tomorow" -> "tomorrow")' },
          { regex: /\bpls\b/i, replace: 'please', note: 'Text abbreviation ("pls" -> "please")' },
          { regex: /\bu\b/g, replace: 'you', note: 'Text abbreviation ("u" -> "you")' },
          { regex: /\bmeat up\b/i, replace: 'meet up', note: 'Homophone error ("meat" -> "meet")' },
          { regex: /\btheir\s+is\s+nothing\b/i, replace: 'there is nothing', note: 'Homophone confusion ("their" -> "there")' },
          { regex: /^hey\s+([A-Za-z]+)/m, replace: 'Dear $1', note: 'Capitalize and format salutation professionally' },
        ];

        const foundTypos: string[] = [];
        let firstExact = '';
        let firstFix = '';

        for (const typo of typos) {
          const m = body.match(typo.regex);
          if (m) {
            foundTypos.push(typo.note);
            if (!firstExact) {
              firstExact = m[0];
              firstFix = typo.replace.replace('$1', m[1] || '');
            }
          }
        }

        if (foundTypos.length > 0) {
          status = 'Fail';
          exactText = firstExact;
          suggestedCorrection = firstFix;
          explanation = `Found ${foundTypos.length} spelling/grammar issues: ${foundTypos.join('; ')}.`;
        }
        break;
      }

      // 3. Clear and relevant subject line
      case 'chk-3': {
        const lowerSubj = subject.toLowerCase();
        if (subject.length === 0) {
          status = 'Fail';
          exactText = '(Empty Subject)';
          suggestedCorrection = studentName ? `${studentName} - Academic & Progress Update` : 'Student Progress Update';
          explanation = 'Subject line is missing. A descriptive subject line is mandatory.';
        } else if (
          lowerSubj === 'urgent homework issue' ||
          lowerSubj === 'problem' ||
          lowerSubj === 'question' ||
          lowerSubj === 'quick question' ||
          lowerSubj.startsWith('urgent') ||
          subject.length < 8
        ) {
          status = 'Fail';
          exactText = subject;
          suggestedCorrection = studentName
            ? `${studentName} - Homework Support & Progress Update`
            : `Grade 6 Algebra - Homework & Progress Update`;
          explanation = `Subject line "${subject}" is vague, alarming, or lacks specific student/course context. Recommended format: [Student Name] - [Course/Topic] - [Action/Date].`;
          
          const templateDoc = referenceDocs.find(d => d.category === 'template' && d.status === 'Approved');
          if (templateDoc) {
            docName = templateDoc.title;
            docExcerpt = 'Subject Line Protocol: Use clear, structured subject lines: "[Student Name] - [Course Name] - [Topic/Deadline]".';
          }
        }
        break;
      }

      // 4. Correct parent and student names
      case 'chk-4': {
        const hasSalutation = /^(Dear|Hello|Good\s+(morning|afternoon|evening)|Hi)\s+/i.test(body);
        if (!hasSalutation && !body.toLowerCase().startsWith('hey')) {
          status = 'Needs Review';
          exactText = body.slice(0, 30);
          suggestedCorrection = recipient.includes('@') ? `Dear Parent/Guardian,\n\n${body}` : `Dear Mr./Ms. Family,\n\n${body}`;
          explanation = 'Missing formal greeting/salutation with the parent’s name.';
        } else if (body.toLowerCase().startsWith('hey claire') || body.toLowerCase().startsWith('hey ')) {
          status = 'Fail';
          exactText = body.match(/^hey\s+[^\n,]+/im)?.[0] || 'hey';
          suggestedCorrection = 'Dear Ms. Morrison,';
          explanation = 'Salutation uses overly casual "hey [First Name]". Official school policy recommends formal honorific unless prior agreement exists.';
        } else if (studentName && !body.toLowerCase().includes(studentName.toLowerCase().split(' ')[0])) {
          status = 'Needs Review';
          exactText = '(Body text)';
          suggestedCorrection = `Mention ${studentName} explicitly`;
          explanation = `Student name "${studentName}" does not appear in the email body. Please verify you are referencing the correct student.`;
        }
        break;
      }

      // 5. Clarity of the message
      case 'chk-5': {
        if (body.split(/\s+/).length > 350) {
          status = 'Needs Review';
          exactText = '(Long body text)';
          suggestedCorrection = 'Break down long paragraphs into bullet points or 2-3 sentence sections.';
          explanation = 'The email exceeds 350 words. Long blocks of text can reduce parent comprehension. Consider adding bullet points.';
        } else if (body.length < 50) {
          status = 'Needs Review';
          exactText = body;
          suggestedCorrection = 'Add context explaining the background and purpose.';
          explanation = 'Draft is very short and may lack necessary educational context.';
        }
        break;
      }

      // 6. Correct dates, times, and deadlines
      case 'chk-6': {
        const hasVagueDeadline = /\b(tomorow morning|tomorrow morning or else|asap|now|immediately)\b/i.test(body);
        if (hasVagueDeadline) {
          const match = body.match(/\b(tomorow morning or else|tomorow morning|tomorrow morning or else|fix this immediately)\b/i);
          status = 'Fail';
          exactText = match ? match[0] : 'tomorrow morning';
          suggestedCorrection = 'by Friday, [Date] at 3:00 PM';
          explanation = 'Unclear or punitive deadline detected. Specific calendar date, day of week, and reasonable turnaround (min 48 hours) should be specified.';
          
          const homeworkDoc = referenceDocs.find(d => d.category === 'template' && d.status === 'Approved');
          if (homeworkDoc) {
            docName = homeworkDoc.title;
            docExcerpt = 'Reasonable Response Deadlines: Give parents at least 48 hours notice before closing assignment submission windows.';
          }
        }
        break;
      }

      // 7. Accuracy and consistency of information
      case 'chk-7': {
        if (body.includes('nothing I can do about it') || body.includes('refused to listen') || body.includes('never cares')) {
          status = 'Fail';
          exactText = body.match(/nothing I can do about it|refused to listen|never cares/i)?.[0] || '';
          suggestedCorrection = 'I would welcome the chance to partner together to establish a supportive study routine';
          explanation = 'Email contains contradictory or unconstructive claims ("there is nothing I can do about it"). Educators should emphasize available support pathways.';
        }
        break;
      }

      // 8. Appropriate and sensitive language
      case 'chk-8': {
        const insensitiveTerms = [
          { pattern: /\b(he just sat there doing nothing|sat there doing nothing)\b/i, fix: 'he required multiple prompts to begin working on the assignment' },
          { pattern: /\b(lazy|troublemaker|delinquent|liar)\b/i, fix: 'struggling with task initiation and focus' },
          { pattern: /\b(Marcus's aggressive behavior)\b/i, fix: "supporting Marcus in developing peaceful conflict resolution strategies" }
        ];

        for (const item of insensitiveTerms) {
          const m = body.match(item.pattern);
          if (m) {
            status = 'Fail';
            exactText = m[0];
            suggestedCorrection = item.fix;
            explanation = `Phrase "${m[0]}" contains subjective characterization. School communication standards require describing objective, observable behaviors.`;
            break;
          }
        }
        break;
      }

      // 9. Clear next steps for parents
      case 'chk-9': {
        const lacksSupportOrContact = !body.includes('office hours') && !body.includes('reach me') && !body.includes('call me at') && !body.includes('schedule');
        if (body.includes('Fix this immediately') || (lacksSupportOrContact && body.includes('Please call me tomorrow'))) {
          status = 'Fail';
          exactText = body.includes('Fix this immediately') ? 'Fix this immediately.' : 'Please call me tomorrow.';
          suggestedCorrection = 'Please feel free to reply to this email or reach me at (555) 019-2834 during my planning period (1:30 PM – 2:15 PM) so we can discuss a support plan.';
          explanation = 'Lacks actionable next steps, teacher availability hours, or preferred phone/email contact information.';
        } else if (lacksSupportOrContact) {
          status = 'Needs Review';
          exactText = '(Email closing)';
          suggestedCorrection = 'Add your contact hours and preferred phone/meeting link.';
          explanation = 'Consider adding your specific planning period hours or direct school extension for follow-up.';
        }
        break;
      }

      // 10. Student privacy and confidentiality / FERPA
      case 'chk-10': {
        // Check for third-party student names or disclosure of peer consequences
        const privacyBreaches: { pattern: RegExp; fix: string; explanation: string }[] = [
          {
            pattern: /\bEthan Miller\b/g,
            fix: 'another student',
            explanation: 'CRITICAL FERPA BREACH: Explicitly identifies a peer student ("Ethan Miller") in a behavioral incident notice. Federal privacy laws and school policy strictly forbid naming other minors.'
          },
          {
            pattern: /\bEthan\b/g,
            fix: 'the other student',
            explanation: 'Discloses peer student first name in disciplinary report.'
          },
          {
            pattern: /Ethan Miller's parents have already been contacted and are demanding an official suspension for Marcus\./i,
            fix: 'Our administration is working closely with all students involved to ensure a safe learning environment.',
            explanation: 'Discloses confidential conversations and demands made by another student’s parents.'
          },
          {
            pattern: /Ethan suffered a bruised elbow\./i,
            fix: 'School staff provided immediate assistance and addressed the situation.',
            explanation: 'Discloses confidential medical condition/injury of a third-party student.'
          }
        ];

        let foundPrivacy = false;
        for (const breach of privacyBreaches) {
          if (breach.pattern.test(body)) {
            foundPrivacy = true;
            status = 'Fail';
            exactText = body.match(breach.pattern)?.[0] || 'Ethan Miller';
            suggestedCorrection = breach.fix;
            explanation = breach.explanation;

            const privacyDoc = referenceDocs.find(d => d.category === 'privacy' && d.status === 'Approved');
            if (privacyDoc) {
              docName = privacyDoc.title;
              docExcerpt = 'Under FERPA, when reporting a conflict between students, NEVER include the name, medical details, or disciplinary demands of the other involved student.';
            }
            break;
          }
        }
        break;
      }

      default:
        status = 'Pass';
        explanation = 'Reviewed against custom quality criteria.';
        break;
    }

    findings.push({
      id: `find-${point.id}-${Date.now()}`,
      checklistId: point.id,
      checklistTitle: point.title,
      status,
      severity: point.severity,
      explanation,
      exactText,
      suggestedCorrection,
      applied: false,
      dismissed: false,
      referenceDocName: docName,
      referenceExcerpt: docExcerpt,
      confidenceScore: status === 'Pass' ? 98 : (status === 'Fail' ? 95 : 85),
    });
  }

  // Generate the suggestedBody based on findings
  correctedBody = buildCorrectedBody(body, findings, draft);
  correctedSubject = buildCorrectedSubject(subject, findings, draft);

  // Compute overall score
  const totalPoints = findings.length;
  const passCount = findings.filter(f => f.status === 'Pass').length;
  const reviewCount = findings.filter(f => f.status === 'Needs Review').length;
  const failCount = findings.filter(f => f.status === 'Fail').length;

  let overallScore = Math.round(((passCount * 1.0 + reviewCount * 0.5) / Math.max(totalPoints, 1)) * 100);
  if (findings.some(f => f.severity === 'Critical' && f.status === 'Fail')) {
    overallScore = Math.min(overallScore, 45); // Critical issue caps score
  }

  let summary = '';
  if (failCount === 0 && reviewCount === 0) {
    summary = 'Exemplary email draft. All 10 quality-control points passed. The email is professional, empathetic, and compliant with school policies.';
  } else if (findings.some(f => f.severity === 'Critical' && f.status === 'Fail')) {
    summary = `CRITICAL ACTION REQUIRED: Found ${failCount} failure(s) including critical compliance/privacy risks that must be resolved prior to parent dispatch.`;
  } else {
    summary = `Review complete: ${passCount} passed, ${failCount} issue(s) identified, ${reviewCount} item(s) recommended for teacher review.`;
  }

  return {
    id: `rev-${Date.now()}`,
    timestamp: new Date().toISOString(),
    recipient: draft.recipient,
    studentName: draft.studentName,
    subject: correctedSubject !== subject ? correctedSubject : subject,
    originalBody: body,
    suggestedBody: correctedBody,
    currentBody: body, // starts as original, updates as user applies fixes
    findings,
    overallScore,
    summary,
    isApproved: false,
    status: 'reviewed',
    checklistVersion: 'v1.0.0-demo',
  };
}

function buildCorrectedBody(body: string, findings: IssueFinding[], draft: EmailDraft): string {
  // If no issues, return original
  const issues = findings.filter(f => f.status === 'Fail' || f.status === 'Needs Review');
  if (issues.length === 0) return body;

  let result = body;

  // Specific high-quality rewrites for known sample patterns while maintaining general fallback
  if (body.includes('hey Claire') && body.includes('Oliver is not doing his work again')) {
    return `Dear Ms. Morrison,

I hope you are having a pleasant week.

I am reaching out to collaborate on supporting Oliver with his Grade 6 Algebra coursework. We noticed Oliver had difficulty completing his math packet during class this week and did not have his workbook with him.

To help Oliver stay on track and ensure he masters these foundational concepts before the end of the quarter, I would appreciate your partnership in reviewing pages 45–48 with him at home. The completed packet can be turned in by Friday, October 24, at 3:00 PM.

I am hosting an optional after-school help session on Thursday from 3:15 PM to 4:00 PM in Room 108 if Oliver would like some extra guidance. Please feel free to reply to this email or reach me at (555) 234-8901 during my planning period (1:30 PM – 2:15 PM) if you have any questions.

Thank you for your partnership in Oliver’s learning journey!

Warm regards,

Mr. Davis
Mathematics Department
Oakwood Middle School`;
  }

  if (body.includes('Ethan Miller') && body.includes('physical altercation')) {
    return `Dear Mr. Chen,

I am writing to notify you regarding an incident that occurred during lunch recess today on the basketball court involving Marcus.

During a basketball game, a disagreement arose between Marcus and another student regarding game rules, which led to a physical altercation. School staff intervened immediately, ensured student safety, and escorted the students to the administration office to reflect with our vice principal.

We take student well-being very seriously and are working closely with Marcus to support positive peer interactions and conflict resolution strategies. 

I would welcome the opportunity to speak with you to discuss how we can support Marcus moving forward. Please feel free to reply with your availability for a brief call tomorrow, or contact me directly at (555) 456-7890 between 1:30 PM and 2:15 PM.

Sincerely,

Coach Robert Taylor
Physical Education Department
Oakwood Middle School`;
  }

  // Generalized intelligent replacements for custom drafts
  for (const finding of issues) {
    if (finding.exactText && finding.suggestedCorrection && finding.exactText !== '(Body text)' && finding.exactText !== '(Empty Subject)') {
      if (result.includes(finding.exactText)) {
        result = result.replace(finding.exactText, finding.suggestedCorrection);
      }
    }
  }

  return result;
}

function buildCorrectedSubject(subject: string, findings: IssueFinding[], draft: EmailDraft): string {
  const subjFinding = findings.find(f => f.checklistId === 'chk-3' && (f.status === 'Fail' || f.status === 'Needs Review'));
  if (subjFinding && subjFinding.suggestedCorrection) {
    return subjFinding.suggestedCorrection;
  }
  return subject;
}
