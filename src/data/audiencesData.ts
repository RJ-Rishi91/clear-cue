import { Audience } from '../types';

export interface AudienceProfile {
  id: Audience;
  name: string;
  roleDescription: string;
  primaryExpectations: string[];
  toneRequirement: string;
  commonPitfall: string;
  exampleSnippet: string;
}

export const AUDIENCE_PROFILES: AudienceProfile[] = [
  {
    id: 'client',
    name: 'Client (Broker / Agency Owner)',
    roleDescription: 'Agency principals, licensed producers, or account managers who delegate back-office workflows.',
    primaryExpectations: [
      'Fast, definitive confirmation of task completion.',
      'Proactive escalation when a carrier underwriter blocks a deal.',
      'Accurate agency management system (AMS360, Applied Epic) data logging.',
    ],
    toneRequirement: 'Reliable, proactive, and concise. Highlight solutions, not just problems.',
    commonPitfall: 'Sending multiple vague questions instead of researching the policy jacket or presenting options.',
    exampleSnippet: '"I have processed the endorsement request with Travelers and updated Epic (Ticket #4012). Confirmation attached."',
  },
  {
    id: 'carrier',
    name: 'Carrier (Underwriter)',
    roleDescription: 'Insurance company underwriters and raters who evaluate risk and issue policy endorsements.',
    primaryExpectations: [
      'Complete submission files with all required loss runs, accord forms, and supplemental applications.',
      'Exact policy numbers, effective dates, and clear risk descriptions.',
      'Prompt response to underwriting subjectivities.',
    ],
    toneRequirement: 'Accurate, formal, and structured. Zero fluff; lead with policy and line of business.',
    commonPitfall: 'Asking open-ended status questions without policy numbers or named insured references.',
    exampleSnippet: '"Re: Policy #GL-88912 | Acme Corp — Please find attached the signed 3-year loss runs for final quote binding."',
  },
  {
    id: 'insured',
    name: 'Insured (Policyholder)',
    roleDescription: 'Commercial business owners or personal lines customers holding the insurance contract.',
    primaryExpectations: [
      'Clear explanations free of confusing industry jargon.',
      'Reassurance during stressful moments (rates, audits, certificates needed for a job).',
      'Clear steps on what they need to sign or pay.',
    ],
    toneRequirement: 'Warm, reassuring, consultative, and completely jargon-free.',
    commonPitfall: 'Assuming the policyholder understands complex terms like "coinsurance penalty" or "additional insured waiver of subrogation".',
    exampleSnippet: '"Hi David, good news — your Certificate of Insurance has been sent directly to the general contractor so you can start work tomorrow."',
  },
  {
    id: 'adjuster',
    name: 'Adjuster (Claims)',
    roleDescription: 'Claims examiners and independent adjusters evaluating damages and loss settlements.',
    primaryExpectations: [
      'Exact claim number, date of loss, and named insured.',
      'Chronological sequence of incident reports and photo evidence.',
      'Documented police reports or medical invoices.',
    ],
    toneRequirement: 'Factual, objective, chronological, and detail-oriented.',
    commonPitfall: 'Expressing subjective blame or opinion rather than objective loss facts.',
    exampleSnippet: '"Claim #CLM-2026-904 | Date of Loss: Sept 12. Attached is the supplemental repair estimate from Certified Body Works."',
  },
  {
    id: 'manager',
    name: 'Manager (Team Lead / Operations)',
    roleDescription: 'Operations supervisors and quality assurance leads tracking SLAs, turnaround times, and accuracy.',
    primaryExpectations: [
      'Status against daily turnaround targets (SLA metrics).',
      'Immediate alert on high-liability E&O exposure or overdue binder escalations.',
      'Clear resource requirements or training needs.',
    ],
    toneRequirement: 'Direct, structured, metric-oriented, and accountable.',
    commonPitfall: 'Hiding a roadblock until after the SLA deadline has already breached.',
    exampleSnippet: '"Daily SLA update: 42 of 45 renewal notices issued. 3 Hartford policies held for underwriter approval; escalated to Senior Underwriting."',
  },
  {
    id: 'internal_team',
    name: 'Internal Team (Offshore / Night Shift)',
    roleDescription: 'Colleagues across time zones collaborating on 24/7 policy servicing and certificate queues.',
    primaryExpectations: [
      'Unambiguous ticket numbers and exact AMS document locations.',
      'Clear ownership handoff: who does what next.',
      'Checkpoints for morning follow-up.',
    ],
    toneRequirement: 'Clear, procedural, courteous, and bullet-formatted.',
    commonPitfall: 'Writing "handled" or "in progress" without detailing which specific step remains.',
    exampleSnippet: '"Handoff for Shift B: Ticket #9931 (Liberty Mutual renewal). Underwriter agreed to $1,500 credit; please issue revised quote schedule."',
  },
];
