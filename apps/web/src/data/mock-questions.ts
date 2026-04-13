import type { Question, InterviewType } from '@/types/interview';

const BEHAVIORAL_QUESTIONS: Question[] = [
  { id: 'b1', text: 'Tell me about a time you had to manage a tight deadline. What was your approach?', type: 'Behavioral', difficulty: 'Beginner' },
  { id: 'b2', text: 'Describe a situation where you had a conflict with a teammate. How did you resolve it?', type: 'Behavioral', difficulty: 'Amateur' },
  { id: 'b3', text: 'Give an example of when you went above and beyond for a stakeholder.', type: 'Behavioral', difficulty: 'Amateur' },
  { id: 'b4', text: 'Tell me about a time you received critical feedback. How did you respond and improve?', type: 'Behavioral', difficulty: 'Expert' },
  { id: 'b5', text: 'Describe a project where you had to learn something new quickly under pressure. How did you manage it?', type: 'Behavioral', difficulty: 'Expert' },
];

const TECHNICAL_QUESTIONS: Question[] = [
  { id: 't1', text: 'How would you design a URL shortening service like Bitly? What data structures would you use?', type: 'Technical', difficulty: 'Beginner' },
  { id: 't2', text: 'Explain the difference between SQL and NoSQL databases. When would you choose one over the other?', type: 'Technical', difficulty: 'Amateur' },
  { id: 't3', text: 'Walk me through how you would scale a chat application to support 10 million concurrent users.', type: 'Technical', difficulty: 'Expert' },
  { id: 't4', text: 'Describe your approach to debugging a production issue at 2am. What steps would you take first?', type: 'Technical', difficulty: 'Expert' },
];

const CASE_STUDY_QUESTIONS: Question[] = [
  { id: 'cs1', text: 'A restaurant chain is seeing declining profits over the last 3 quarters. How would you diagnose the root cause?', type: 'Case Study', difficulty: 'Amateur' },
  { id: 'cs2', text: 'A retail company is considering entering a new market. What factors would you analyze before making a recommendation?', type: 'Case Study', difficulty: 'Amateur' },
  { id: 'cs3', text: 'An e-commerce platform sees high cart abandonment. What hypotheses do you have and how would you test them?', type: 'Case Study', difficulty: 'Expert' },
  { id: 'cs4', text: 'A telecom operator wants to reduce customer churn by 20%. Propose a data-driven strategy.', type: 'Case Study', difficulty: 'Expert' },
  { id: 'cs5', text: 'A manufacturing company has excess inventory. How would you optimize the supply chain?', type: 'Case Study', difficulty: 'Real-life' },
];

const MIXED_QUESTIONS: Question[] = [
  { id: 'm1', text: 'Tell me about a complex technical problem you solved. What was the problem and what was your solution?', type: 'Mixed', difficulty: 'Beginner' },
  { id: 'm2', text: 'If you had to rewrite one system from your past experience, what would it be and why?', type: 'Mixed', difficulty: 'Amateur' },
  { id: 'm3', text: 'Describe a time your technical solution was challenged by a non-technical stakeholder. How did you handle it?', type: 'Mixed', difficulty: 'Expert' },
  { id: 'm4', text: 'How do you balance technical debt vs. feature delivery pressure in a product roadmap?', type: 'Mixed', difficulty: 'Expert' },
  { id: 'm5', text: 'Walk me through how you would scope and estimate a new feature from idea to launch.', type: 'Mixed', difficulty: 'Real-life' },
];

export function getMockQuestions(type: InterviewType, count: number): Question[] {
  let pool: Question[];
  switch (type) {
    case 'Behavioral': pool = BEHAVIORAL_QUESTIONS; break;
    case 'Technical': pool = TECHNICAL_QUESTIONS; break;
    case 'Case Study': pool = CASE_STUDY_QUESTIONS; break;
    case 'Mixed': pool = MIXED_QUESTIONS; break;
    default: pool = BEHAVIORAL_QUESTIONS;
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((q, i) => ({ ...q, id: `${q.id}-${Date.now()}-${i}` }));
}

export function getMockFollowUp(answerText: string): string | null {
  if (answerText.length < 30) return 'Could you add more detail? Specifically, what was the outcome or measurable impact?';
  if (!answerText.includes('I ') && !answerText.includes('we ')) return 'Can you walk me through the specific actions you took in that situation?';
  return null;
}