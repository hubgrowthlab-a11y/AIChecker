import { ChecklistPoint } from '@/types';

export const CHECKLIST_VERSION = 'v1.0.0-demo';

export const DEFAULT_CHECKLIST_POINTS: ChecklistPoint[] = [
  {
    id: 'chk-1',
    order: 1,
    title: 'Professional and respectful tone',
    description: 'Ensure email communicates warmth, empathy, constructive framing, and professional composure without harsh, accusatory, or passive-aggressive language.',
    category: 'tone',
    severity: 'High',
    isMandatory: true,
    isActive: true,
    guidelines: 'Use respectful greetings and closings. Frame behavioral or academic challenges as opportunities for partnership. Avoid exclamation marks in disciplinary contexts or confrontational phrasing (e.g., "He failed completely" -> "He had difficulty meeting the benchmark").',
    goodExamples: [
      'I wanted to reach out so we can collaborate on supporting Alex with his math homework.',
      'Thank you for your continued partnership in Emily’s learning journey.'
    ],
    badExamples: [
      'Your son is acting out again and needs to get his act together immediately.',
      'I already told you this last week and nothing has changed.'
    ]
  },
  {
    id: 'chk-2',
    order: 2,
    title: 'Grammar and spelling',
    description: 'Check for typos, missing punctuation, capitalization errors, run-on sentences, and homophone mix-ups (e.g. their/there, its/it\'s).',
    category: 'grammar',
    severity: 'Medium',
    isMandatory: true,
    isActive: true,
    guidelines: 'Ensure all sentences are grammatically sound, punctuated correctly, and adhere to standard professional educational correspondence standards.',
    goodExamples: [
      'Please let me know if you would like to schedule a brief phone conference.',
      'The students completed their science lab assignments today.'
    ],
    badExamples: [
      'pls let me no if u want to meat up tomorow',
      'The students did there project and they was happy.'
    ]
  },
  {
    id: 'chk-3',
    order: 3,
    title: 'Clear and relevant subject line',
    description: 'The subject line should succinctly summarize the topic, include student name if appropriate, and avoid generic or alarming subject headers.',
    category: 'structure',
    severity: 'Medium',
    isMandatory: true,
    isActive: true,
    guidelines: 'Format should ideally be: [Student Name / Course] - [Specific Topic / Date / Action Required]. Avoid all-caps, single words like "URGENT" or "BAD NEWS".',
    goodExamples: [
      'Lucas Davis - Grade 7 Science Project Update & Submission Deadline',
      'Maya Patel - Follow-up on Reading Support Plan'
    ],
    badExamples: [
      'Problem with your kid!!',
      'Quick question'
    ]
  },
  {
    id: 'chk-4',
    order: 4,
    title: 'Correct parent and student names',
    description: 'Verify accurate spelling of the student and parent names, correct honorifics, and ensure names match throughout the draft.',
    category: 'accuracy',
    severity: 'Critical',
    isMandatory: true,
    isActive: true,
    guidelines: 'Verify that the recipient salutation matches the parent name and that the student’s preferred first name and surname are spelled correctly.',
    goodExamples: [
      'Dear Mr. and Mrs. Henderson, I am writing regarding Oliver...',
      'Dear Ms. Chen, thank you for checking in on Sophie...'
    ],
    badExamples: [
      'Dear Parent, your child Timmy (when child is Thomas)...',
      'Dear Mrs. Smith, regarding your son Jack (when mother’s surname is Miller)...'
    ]
  },
  {
    id: 'chk-5',
    order: 5,
    title: 'Clarity of the message',
    description: 'Ensure the purpose of the email is immediately evident in the opening paragraph and free of confusing school jargon or abbreviations.',
    category: 'structure',
    severity: 'Medium',
    isMandatory: false,
    isActive: true,
    guidelines: 'Explain acronyms (e.g. IEP, RTI, MAP testing, SEL) if used. Keep paragraphs concise (2-4 sentences max per paragraph).',
    goodExamples: [
      'I am writing to share an update on Liam’s progress in reading fluency following our recent assessment.',
      'The purpose of this note is to provide details on the upcoming Grade 5 field trip to the Nature Science Center.'
    ],
    badExamples: [
      'So as you know with the PBIS tier 2 data and the 504 accommodation matrix we have some things going on.',
      'A dense 300-word single-block paragraph without line breaks or headings.'
    ]
  },
  {
    id: 'chk-6',
    order: 6,
    title: 'Correct dates, times, and deadlines',
    description: 'Verify that all dates, days of the week, times, submission deadlines, and room locations are explicitly stated, mathematically consistent, and realistic.',
    category: 'accuracy',
    severity: 'Critical',
    isMandatory: true,
    isActive: true,
    guidelines: 'Check day/date alignment (e.g. "Friday, October 24"). State explicit time zones if applicable and ensure parent response windows are reasonable (minimum 48 hours for non-emergencies).',
    goodExamples: [
      'Please submit the permission slip by Friday, October 24 at 3:00 PM.',
      'Our parent-teacher conference is scheduled for Tuesday, November 12, from 4:15 PM to 4:45 PM in Room 204.'
    ],
    badExamples: [
      'Bring it by tomorrow morning or else she gets a zero.',
      'The meeting is on Wednesday, October 14 (when October 14 is a Tuesday).'
    ]
  },
  {
    id: 'chk-7',
    order: 7,
    title: 'Accuracy and consistency of information',
    description: 'Cross-check internal details (e.g., assignment names, points, policy quotes) to ensure no conflicting statements or unverified factual claims.',
    category: 'accuracy',
    severity: 'High',
    isMandatory: false,
    isActive: true,
    guidelines: 'Never state assumptions as facts. If referring to a missed test or grade, provide exact title and date. Do not extrapolate motives.',
    goodExamples: [
      'Noah missed the Chapter 4 Chemistry Quiz on Wednesday, October 8, while absent.',
      'According to our school attendance records, Maya has had 3 unexcused tardies this month.'
    ],
    badExamples: [
      'He never cares to study for quizzes and skipped class on purpose.',
      'She got a 50 on the test because she refused to listen in class.'
    ]
  },
  {
    id: 'chk-8',
    order: 8,
    title: 'Appropriate and sensitive language',
    description: 'Ensure phrasing regarding special education, health, socioeconomic background, family dynamics, or emotional state is compassionate, objective, and unbiased.',
    category: 'tone',
    severity: 'High',
    isMandatory: true,
    isActive: true,
    guidelines: 'Use strength-based language. Avoid labeling students (e.g., "difficult child", "troublemaker"). Describe observable behaviors objectively rather than subjective characterizations.',
    goodExamples: [
      'Ethan required several verbal redirections to stay focused during independent reading time today.',
      'We noticed Sarah appeared tired and quieter than usual during morning circle.'
    ],
    badExamples: [
      'Your child is being extremely lazy and disruptive to everybody around him.',
      'She is causing chaos in the classroom.'
    ]
  },
  {
    id: 'chk-9',
    order: 9,
    title: 'Clear next steps for parents',
    description: 'Provide an actionable conclusion specifying what parent or student should do next, contact details, and deadline for response.',
    category: 'structure',
    severity: 'Medium',
    isMandatory: false,
    isActive: true,
    guidelines: 'Clearly state: 1) What action is requested (e.g. sign form, schedule call, review homework portal), 2) By when, 3) How to reach the teacher (email/office phone/hours).',
    goodExamples: [
      'Please reply to this email by Thursday with your preferred time for a 15-minute check-in, or call me during my planning period (1:30 PM - 2:15 PM).',
      'Please review Chapter 5 with Jordan tonight and initial his agenda log.'
    ],
    badExamples: [
      'Do something about this.',
      'Let me know.'
    ]
  },
  {
    id: 'chk-10',
    order: 10,
    title: 'Student privacy and confidentiality / FERPA',
    description: 'STRICT PRIVACY: Never disclose other students’ names, grades, behavioral incidents, medical conditions, or disciplinary actions to third-party parents.',
    category: 'privacy',
    severity: 'Critical',
    isMandatory: true,
    isActive: true,
    guidelines: 'CRITICAL FERPA REQUIREMENT: Redact any mentions of peer names (e.g. replace "He pushed Ethan Miller" with "He had a physical disagreement with another student"). Never CC unauthorized third parties.',
    goodExamples: [
      'During recess, Jordan had an altercation with a classmate over soccer equipment. Both students met with our counselor.',
      'We are addressing peer interactions in our classroom community circles.'
    ],
    badExamples: [
      'Jordan got into a fist fight with Ethan Miller because Ethan stole his lunch money and Ethan’s parents were called too.',
      'Sophie scored lower than Jessica Adams on the exam.'
    ]
  }
];
