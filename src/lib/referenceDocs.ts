import { ReferenceDocument } from '@/types';

export const DEFAULT_REFERENCE_DOCUMENTS: ReferenceDocument[] = [
  {
    id: 'doc-1',
    title: 'Oakwood Academy Staff Communication & Tone Policy',
    filename: 'Oakwood_Staff_Communication_Guidelines_2026.pdf',
    type: 'pdf',
    folder: 'Parent Communication Policies & Templates',
    status: 'Approved',
    lastUpdated: '2026-08-15',
    size: '142 KB',
    category: 'tone',
    summary: 'Official school board standards for parent email communications, greeting formats, empathetic framing, and response turnaround times.',
    content: `OAKWOOD ACADEMY - PARENT COMMUNICATION POLICY
Section 2: Tone and Professional Composure
1. Tone Standards: All correspondence to parents and guardians must maintain an empathetic, constructive, and respectful tone. Educators represent the school community.
2. Salutations: Always address parents formally (e.g., "Dear Mr. Smith," or "Dear Ms. Davis,") unless the parent has explicitly requested first-name basis. Never open with casual greetings like "hey" or "yo".
3. Framing Academic Difficulties: Do not use inflammatory labels such as "lazy", "slacking", or "failing". Instead, describe specific observed learning behaviors: "Oliver had difficulty completing the math worksheet during class" or "We observed that Lucas needed additional time on algebra concepts".
4. Deadlines and Consequences: Avoid threats like "or else he gets a zero". State policies neutrally: "According to school policy, assignments submitted after Friday will receive a 10% late deduction unless prior arrangements are made."
5. Contact Availability: Always provide teacher office hours and preferred contact method (email/direct phone) at the close of every communication.`
  },
  {
    id: 'doc-2',
    title: 'Student Privacy, FERPA Compliance & Peer Redaction Protocol',
    filename: 'FERPA_Privacy_and_Peer_Redaction_Protocol.docx',
    type: 'docx',
    folder: 'Legal & Privacy Compliance',
    status: 'Approved',
    lastUpdated: '2026-08-20',
    size: '98 KB',
    category: 'privacy',
    summary: 'Strict mandatory protocols for protecting minor student confidentiality under FERPA regulations and redacting peer information.',
    content: `FERPA PRIVACY & CONFIDENTIALITY DIRECTIVE
Section 4.1: Peer Identification in Disciplinary & Behavioral Notices
CRITICAL MANDATE: Under the Family Educational Rights and Privacy Act (FERPA), school personnel are strictly prohibited from disclosing personally identifiable information (PII) of other students to parents.
1. Altercations & Conflicts: When reporting a conflict, fight, or disagreement between students, NEVER include the name, grade, or identifying characteristics of the other involved student(s).
2. Approved Redaction Phrasing: Use neutral, anonymous terms:
   - REPLACE: "Marcus fought with Ethan Miller"
   - APPROVED: "Marcus was involved in a physical disagreement with another student during recess."
3. Third-Party Medical & Disciplinary Consequences: Never disclose injuries or disciplinary actions concerning the other child (e.g., "The other student received a bruised elbow" or "The other parents demanded a suspension").
4. Sole Focus: Keep all communications exclusively focused on the recipient's child and the immediate behavioral support plan.`
  },
  {
    id: 'doc-3',
    title: 'Homework, Absence & Academic Escalation Guidelines',
    filename: 'Academic_Progress_and_Homework_Policy.gdoc',
    type: 'gdoc',
    folder: 'Parent Communication Policies & Templates',
    status: 'Approved',
    lastUpdated: '2026-09-01',
    size: '45 KB',
    category: 'template',
    summary: 'Standardized templates and guidelines for missing work notifications, tutoring options, and teacher availability windows.',
    content: `ACADEMIC PROGRESS COMMUNICATION GUIDELINE
Section 1: Missing Homework & Progress Notifications
1. Subject Line Protocol: Use clear, structured subject lines: "[Student Name] - [Course Name] - [Topic/Deadline]". Avoid sensational words like "URGENT CRISIS" or vague titles like "Quick question".
2. Providing Academic Support: Every missing work notice must include an actionable offer of assistance (e.g., after-school tutoring hours, optional study hall, or assignment resubmission window).
3. Reasonable Response Deadlines: Give parents at least 48 hours notice before closing assignment submission windows for major term grades.
4. Documented Evidence: Cite specific assignment titles and dates rather than generalizations like "he never turns in work".`
  },
  {
    id: 'doc-4',
    title: 'Behavioral Incident Response & De-escalation Protocol',
    filename: 'Behavioral_Incident_Communication_Framework.pdf',
    type: 'pdf',
    folder: 'Legal & Privacy Compliance',
    status: 'Approved',
    lastUpdated: '2026-08-28',
    size: '185 KB',
    category: 'incident',
    summary: 'Guidelines on communicating emotional and behavioral incidents with parents, objective documentation, and counselor support.',
    content: `INCIDENT COMMUNICATION GUIDELINES FOR EDUCATORS
1. Objective Reporting: Document observable physical behaviors without psychoanalyzing or assigning moral intent (e.g., state "pushed a peer" instead of "acted with malicious rage").
2. Follow-Up Meeting Invitation: For serious incidents, do not attempt to resolve the entire matter over email. State the facts succinctly and invite parents to a conference (virtual or in-person) with the grade-level counselor or administrator.
3. Next Steps: Clearly state what immediate safety and support actions the school took (e.g., visited nurse, spoke with counselor, completed restorative reflection).`
  },
  {
    id: 'doc-5',
    title: 'Draft Field Trip & Chaperone Guidelines 2026',
    filename: 'Field_Trip_Template_Draft_v2.docx',
    type: 'docx',
    folder: 'Templates & Drafts',
    status: 'Unapproved',
    lastUpdated: '2026-09-10',
    size: '62 KB',
    category: 'template',
    summary: 'Draft guidelines under review by administration. Not yet approved for official citation in parent communications.',
    content: `FIELD TRIP DRAFT GUIDELINES - UNAPPROVED / FOR REVIEW ONLY
This document is pending formal approval from the school board. Contains draft permission slip formats and chaperone ratio guidelines.`
  }
];

export function getApprovedDocuments(docs: ReferenceDocument[]): ReferenceDocument[] {
  return docs.filter(d => d.status === 'Approved');
}

export function searchReferenceLibrary(query: string, docs: ReferenceDocument[]): { doc: ReferenceDocument; matchedExcerpt: string; score: number }[] {
  const approvedDocs = getApprovedDocuments(docs);
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(w => w.length > 3);

  const results: { doc: ReferenceDocument; matchedExcerpt: string; score: number }[] = [];

  for (const doc of approvedDocs) {
    let score = 0;
    const lowerContent = doc.content.toLowerCase();
    const lowerTitle = doc.title.toLowerCase();

    for (const word of words) {
      if (lowerTitle.includes(word)) score += 5;
      if (lowerContent.includes(word)) score += 2;
    }

    if (score > 0) {
      // Extract best excerpt
      const paragraphs = doc.content.split('\n').filter(p => p.trim().length > 0);
      let bestParagraph = paragraphs[0] || '';
      let bestMatchCount = 0;

      for (const p of paragraphs) {
        const pLower = p.toLowerCase();
        let matchCount = 0;
        for (const word of words) {
          if (pLower.includes(word)) matchCount++;
        }
        if (matchCount > bestMatchCount) {
          bestMatchCount = matchCount;
          bestParagraph = p;
        }
      }

      results.push({
        doc,
        matchedExcerpt: bestParagraph.trim(),
        score
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
