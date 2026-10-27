import { SampleEmailDemo } from '@/types';

export const SAMPLE_EMAILS: SampleEmailDemo[] = [
  {
    id: 'sample-a',
    name: 'Example A: Good Email (Exemplary Draft)',
    tagline: 'Professional homework reminder with clear subject, polite tone, and specific deadline.',
    badge: 'High Quality',
    badgeColor: 'emerald',
    recipient: 'mr.smith@oakwoodparents.org',
    studentName: 'Lucas Smith',
    subject: 'Lucas Smith - Grade 6 Science Volcano Project Reminder (Due Friday, Oct 24)',
    body: `Dear Mr. Smith,

I hope you are having a wonderful week!

I am writing to share a brief reminder regarding Lucas's upcoming Science project on volcanic landforms. The completed poster board and model submission are due this Friday, October 24, at 3:00 PM.

Lucas has made great strides in class preparing his research notes, and we want to ensure he feels fully supported as he wraps up the final details at home. If Lucas needs any extra guidance with materials or references, I am hosting an optional study hall session tomorrow (Thursday) afternoon from 3:15 PM to 4:00 PM in Room 108.

Please feel free to reply directly to this email or reach me at (555) 234-8901 during my office hours (1:30 PM – 2:15 PM) if you have any questions or need an accommodation.

Thank you for your continued partnership and support in Lucas’s learning journey!

Warm regards,

Ms. Eleanor Vance
Grade 6 Science Teacher
Oakwood Middle School`,
    description: 'This email is a gold-standard communication: respectful, structured, includes student and parent names correctly, clear subject line with explicit deadlines, actionable support offer, and no privacy violations.',
    expectedOutcome: '10/10 Checklist Points Pass. Ready for direct approval.',
    keyIssues: []
  },
  {
    id: 'sample-b',
    name: 'Example B: Email with Errors (Tone, Grammar & Vague Subject)',
    tagline: 'Contains multiple typos, spelling mistakes, vague subject, blunt/accusatory tone, and no clear contact window.',
    badge: 'Multiple Issues',
    badgeColor: 'amber',
    recipient: 'claire.morrison@gmail.com',
    studentName: 'Oliver Morrison',
    subject: 'urgent homework issue',
    body: `hey Claire,

your son Oliver is not doing his work again and frankly its getting really frustrating for me. He forgot his math packet for the 3rd time this weak and he just sat there doing nothing during algebra period. 

If he keeps being so lazy he will fail the quarter and there is nothing I can do about it. You need to make sure he finishes page 45-48 by tomorow morning or he gets a zero on the assignment. 

Fix this immediately.

Mr Davis`,
    description: 'Contains harsh and confrontational language ("getting really frustrating", "so lazy", "Fix this immediately"), lowercase/informal salutation ("hey Claire"), typos and grammar bugs ("its" vs "it\'s", "weak" vs "week", "tomorow"), vague subject line ("urgent homework issue"), and lacks constructive next steps or teacher contact details.',
    expectedOutcome: 'Fails Checklist Points 1 (Tone), 2 (Grammar/Spelling), 3 (Subject Line), 8 (Appropriate Language), and 9 (Clear Next Steps).',
    keyIssues: [
      'Informal/unprofessional salutation ("hey Claire")',
      'Harsh, accusatory tone ("frustrating for me", "so lazy", "Fix this immediately")',
      'Spelling & grammar errors: "its" -> "it\'s", "weak" -> "week", "tomorow" -> "tomorrow"',
      'Vague and alarming subject line: "urgent homework issue"',
      'Lacks constructive support options and specific teacher contact hours'
    ]
  },
  {
    id: 'sample-c',
    name: 'Example C: Sensitive Email (Critical Privacy & FERPA Breach)',
    tagline: 'Behavioral incident that inappropriately discloses another student’s identifying information and disciplinary consequences.',
    badge: 'Critical Privacy Breach',
    badgeColor: 'rose',
    recipient: 'david.chen@chenfamily.net',
    studentName: 'Marcus Chen',
    subject: 'Incident during recess today involving Marcus',
    body: `Dear Mr. Chen,

I am writing to notify you about an unfortunate physical altercation that occurred during lunch recess today on the basketball court. 

Marcus got into a heated fight with Ethan Miller after Ethan accused Marcus of cheating in the game. Marcus ended up shoving Ethan Miller into the bench, and Ethan suffered a bruised elbow. We had to send both Marcus and Ethan Miller to Vice Principal Jenkins's office. Ethan Miller's parents have already been contacted and are demanding an official suspension for Marcus.

We need to discuss Marcus's aggressive behavior in school. Please call me tomorrow.

Sincerely,

Coach Robert Taylor
Physical Education Department
Oakwood Middle School`,
    description: 'CRITICAL PRIVACY VIOLATION: Inappropriately names another minor student ("Ethan Miller") four times, describes the other student\'s medical condition ("bruised elbow"), and reveals confidential communications with the other student\'s parents. School policy and federal FERPA regulations strictly forbid disclosing peer identifying information.',
    expectedOutcome: 'Critical Failure on Point 10 (Student Privacy / FERPA), Point 8 (Sensitive Language), and Point 9 (Clear Next Steps).',
    keyIssues: [
      'FERPA Violation: Disclosed peer student name "Ethan Miller" 4 times',
      'Disclosed third-party student\'s medical details ("bruised elbow")',
      'Disclosed third-party parental discussions and disciplinary demands',
      'Subjective labeling ("Marcus\'s aggressive behavior") rather than objective behavioral summary',
      'Vague next step ("Please call me tomorrow" without time window or phone number)'
    ]
  }
];
