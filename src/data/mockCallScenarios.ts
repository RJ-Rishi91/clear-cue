import { ScenarioDefinition } from '../types';

export const MOCK_CALL_SCENARIOS: ScenarioDefinition[] = [
  // ==========================================
  // 1. TASK-ASSIGNING CALLS
  // ==========================================
  {
    id: 'scenario_1a_client_tasks',
    category: 'task_assignment',
    categoryTitle: '1. Task-Assigning Calls',
    scenarioCode: 'Scenario 1A',
    title: 'Client Assigns Multiple Policy Tasks',
    character: 'client',
    characterTitle: 'Client (Sarah Mitchell)',
    tone: 'normal',
    callType: 'task_assignment',
    objective: 'Test clarification, prioritization, note-taking, and explicit confirmation of deadlines.',
    scenarioData: {
      clientName: 'Sarah Mitchell',
      agency: 'Mitchell Insurance Group',
      vaRole: 'Trainee Virtual Assistant',
      tasks: [
        'Process renewal for ABC Manufacturing (Effective Oct 15th, check outstanding requirements)',
        'Prepare COI for Green Valley Construction (Info in yesterday email, urgent: need today)',
        'Follow up on missing document for John Davis (Driver license copy, deadline before 3:00 PM EST)'
      ],
      deadlines: 'End of day (COI needed ASAP today; John Davis before 3:00 PM EST)',
      documents: "Driver's license copy for John Davis; Green Valley COI requirements in email",
      company: 'ABC Manufacturing & Green Valley Construction',
      policyNumber: 'REN-ABC-9041',
      extraContext: 'Trainee should ask clarifying questions on each task, verify missing info, prioritize urgent items first, and confirm back the order.'
    },
    aiObjective: 'Assign the 3 tasks progressively as the user acknowledges. If the user asks clarifying questions (dates, carrier requirements, certificate holder info, deadlines), provide the facts. Expect the user to confirm priority order before closing.',
    expectedBehaviours: [
      'Asking clarifying questions',
      'Identifying missing information',
      'Prioritization (Urgent COI first, then Renewal, then Driver License)',
      'Confirmation of task sequence',
      'Deadline clarification',
      'Active listening'
    ],
    initialOpeningLine: "Hi, I have a few things I'd like you to work on today.",
    rulesTested: ['Clarifying questions', 'Outcome & order confirmation', 'Deadline identification'],
    referenceDialogue: [
      { speaker: 'ai', text: "Hi, I have a few things I'd like you to work on today." },
      { speaker: 'user', text: "Sure, Sarah. Please go ahead." },
      { speaker: 'ai', text: "First, I need you to process the renewal for ABC Manufacturing." },
      { speaker: 'user', text: "Sure. When you say process the renewal, would you like me to review the existing policy first and prepare the renewal documentation?" },
      { speaker: 'ai', text: "Yes, exactly. Check the current policy and make sure we have everything required." },
      { speaker: 'user', text: "Got it. What's the renewal effective date?" },
      { speaker: 'ai', text: "It's October 15th." },
      { speaker: 'user', text: "And is there anything specific you'd like me to verify with the carrier?" },
      { speaker: 'ai', text: "Just make sure there are no outstanding requirements." },
      { speaker: 'user', text: "Sure. I'll review the policy and check for any pending requirements." },
      { speaker: 'ai', text: "The second task is a COI for Green Valley Construction." },
      { speaker: 'user', text: "Sure. Do we already have the certificate holder information, or should I verify it with the client?" },
      { speaker: 'ai', text: "Check the email from yesterday. The information should be there." },
      { speaker: 'user', text: "Got it. And when do you need the COI?" },
      { speaker: 'ai', text: "As soon as possible. They need it today." },
      { speaker: 'user', text: "Understood. I'll prioritize that." },
      { speaker: 'ai', text: "The last one is John Davis. We're still missing one document from him." },
      { speaker: 'user', text: "Which document are we waiting for?" },
      { speaker: 'ai', text: "His driver's license copy." },
      { speaker: 'user', text: "Should I follow up with him directly?" },
      { speaker: 'ai', text: "Yes." },
      { speaker: 'user', text: "And is there a specific deadline?" },
      { speaker: 'ai', text: "Ideally before 3 PM." },
      { speaker: 'user', text: "Got it. Just to confirm, I'll first work on the COI for Green Valley Construction, then review ABC Manufacturing's renewal, and finally follow up with John Davis for the driver's license. Correct?" },
      { speaker: 'ai', text: "Yes, that's correct." },
      { speaker: 'user', text: "Perfect. I'll keep you posted on the progress." }
    ]
  },
  {
    id: 'scenario_1b_poc_tasks',
    category: 'task_assignment',
    categoryTitle: '1. Task-Assigning Calls',
    scenarioCode: 'Scenario 1B',
    title: 'POC Assigns Certificates & Renewal List',
    character: 'poc',
    characterTitle: 'POC (Account Manager)',
    tone: 'polite',
    callType: 'task_assignment',
    objective: 'Test requirement extraction, finding specific wording in emails, and turnaround time verification.',
    scenarioData: {
      clientName: 'Alex Rivera (POC)',
      agency: 'Summit Specialty Brokers',
      tasks: [
        'Prepare two COIs: Brightline Logistics and Westbrook Contractors',
        'Check renewal list and identify policies expiring within next 30 days',
        'Prepare renewal follow-up list'
      ],
      deadlines: 'Turnaround time for COIs: Before noon today',
      documents: 'Specific certificate holder wording for Brightline Logistics in email from client',
      company: 'Brightline Logistics & Westbrook Contractors'
    },
    aiObjective: 'Politely assign the two COIs, mention Brightline has specific wording in email, state deadline is noon, then assign the 30-day renewal list.',
    expectedBehaviours: [
      'Asking for client names upfront',
      'Clarifying unique certificate holder requirements',
      'Asking where to locate special wording',
      'Confirming expected turnaround time',
      'Confirming whether follow-up list is needed',
      'Sequencing execution plan'
    ],
    initialOpeningLine: "Hi, I wanted to give you a few tasks for today.",
    rulesTested: ['Requirement clarification', 'Deadline confirmation', 'Prioritization'],
    referenceDialogue: [
      { speaker: 'ai', text: "Hi, I wanted to give you a few tasks for today." },
      { speaker: 'user', text: "Absolutely. Please go ahead." },
      { speaker: 'ai', text: "I need you to prepare two certificates of insurance." },
      { speaker: 'user', text: "Sure. Could you please share the names of the clients?" },
      { speaker: 'ai', text: "One is Brightline Logistics and the other is Westbrook Contractors." },
      { speaker: 'user', text: "Got it. Do both certificates have the same certificate holder requirements?" },
      { speaker: 'ai', text: "No. Brightline has specific wording that needs to be included." },
      { speaker: 'user', text: "Where can I find that wording?" },
      { speaker: 'ai', text: "It's in the email from the client." },
      { speaker: 'user', text: "Understood. What's the expected turnaround time?" },
      { speaker: 'ai', text: "Before noon." },
      { speaker: 'user', text: "Got it. Is there anything else you'd like me to work on after these?" },
      { speaker: 'ai', text: "Yes. Please check the renewal list and identify policies expiring within the next 30 days." },
      { speaker: 'user', text: "Sure. Should I only identify them, or would you like me to prepare the renewal follow-up list as well?" },
      { speaker: 'ai', text: "Prepare the follow-up list too." },
      { speaker: 'user', text: "Perfect. I'll prepare the two COIs first and then work on the renewal list." }
    ]
  },
  {
    id: 'scenario_1c_rude_client',
    category: 'task_assignment',
    categoryTitle: '1. Task-Assigning Calls',
    scenarioCode: 'Scenario 1C',
    title: 'Rude / Urgent Client Assigns Tasks',
    character: 'client',
    characterTitle: 'Client (Demanding Agency Principal)',
    tone: 'rude',
    callType: 'task_assignment',
    objective: 'Test emotional composure under pressure. Trainee must not mirror rude tone. Use: Acknowledge → Clarify → Prioritize → Confirm → Commit to update.',
    scenarioData: {
      clientName: 'Robert Vance',
      agency: 'Vance Risk Partners',
      tasks: [
        'Finish Johnson renewal documentation',
        'Send COI for Miller Construction (verify certificate holder in system)',
        'Call client regarding missing signed supplemental form'
      ],
      deadlines: 'All required today immediately ("lost enough time already")',
      documents: 'Signed supplemental application form for client',
      issueDetails: 'Client is frustrated by previous delays and demands everything finished today.'
    },
    aiObjective: 'Start harsh and hurried. Complain about lost time. Give tasks impatiently. If trainee stays calm, acknowledges, clarifies, prioritizes, and commits to an update, accept their plan with "Fine." If trainee argues or blames, push back hard.',
    expectedBehaviours: [
      'Zero mirroring of client rudeness',
      'Acknowledge concerns professionally',
      'Clarify scope of renewal review',
      'Verify certificate holder information source',
      'Prioritize workflow logically',
      'Commit to a structured progress update'
    ],
    initialOpeningLine: "I need you to get these things done today. We've already lost enough time.",
    rulesTested: ['Acknowledge → Clarify → Prioritize → Confirm → Commit', 'Zero blame', 'Emotional self-regulation'],
    referenceDialogue: [
      { speaker: 'ai', text: "I need you to get these things done today. We've already lost enough time." },
      { speaker: 'user', text: "Understood. Please let me know what needs to be completed." },
      { speaker: 'ai', text: "First, finish the Johnson renewal." },
      { speaker: 'user', text: "Sure. Just to clarify, do you mean reviewing the renewal documents and preparing them for submission?" },
      { speaker: 'ai', text: "Yes. That's what I said." },
      { speaker: 'user', text: "Got it. I'll take care of that." },
      { speaker: 'ai', text: "Then send the COI for Miller Construction." },
      { speaker: 'user', text: "Sure. Could you confirm whether the certificate holder information is already available in the system?" },
      { speaker: 'ai', text: "It should be." },
      { speaker: 'user', text: "I'll verify it before preparing the certificate." },
      { speaker: 'ai', text: "And call the client about the missing application." },
      { speaker: 'user', text: "Sure. Which application document are we still waiting for?" },
      { speaker: 'ai', text: "The signed supplemental form." },
      { speaker: 'user', text: "Understood. I'll follow up with them." },
      { speaker: 'ai', text: "I need all of this done today." },
      { speaker: 'user', text: "Understood. I'll prioritize these tasks. I'll start with the Johnson renewal, then the COI, and then follow up regarding the signed form." },
      { speaker: 'ai', text: "Fine." },
      { speaker: 'user', text: "I'll provide you with an update once I complete the first set of tasks." }
    ]
  },

  // ==========================================
  // 2. WEEKLY UPDATE CALLS
  // ==========================================
  {
    id: 'scenario_2a_weekly_update',
    category: 'weekly_update',
    categoryTitle: '2. Weekly Update Calls',
    scenarioCode: 'Scenario 2A',
    title: 'Normal Weekly Update Call',
    character: 'poc',
    characterTitle: 'POC (Team Lead)',
    tone: 'normal',
    callType: 'weekly_update',
    objective: 'Test structuring numbers and status (15 assigned, 11 completed, 4 pending) rather than saying "everything is going well".',
    scenarioData: {
      clientName: 'Jordan Taylor (POC)',
      tasks: [
        '15 total tasks assigned this week',
        '11 completed',
        '4 pending: 2 waiting for client docs (Davis renewal & Miller policy update), 1 waiting carrier confirmation (Wilson policy submitted yesterday), 1 currently being processed'
      ],
      deadlines: 'Targeting completion of all 4 remaining by tomorrow once documents arrive',
      documents: 'Client docs for Davis & Miller; Carrier response for Wilson'
    },
    aiObjective: 'Ask how many tasks were completed, what is pending, which ones need client docs, whether follow-ups occurred, and expected completion date.',
    expectedBehaviours: [
      'Giving exact numbers (15 assigned, 11 completed, 4 pending)',
      'Categorizing pending reasons (client docs vs carrier confirmation vs in-process)',
      'Naming specific accounts (Davis renewal, Miller update, Wilson policy)',
      'Confirming follow-up timestamps (followed up yesterday)',
      'Stating realistic target completion timeline (by tomorrow)'
    ],
    initialOpeningLine: "Hi, I wanted to get a quick update on the tasks from this week.",
    rulesTested: ['Structured reporting', 'Action Taken & Action Ahead', 'No vague quantifiers'],
    referenceDialogue: [
      { speaker: 'ai', text: "Hi, I wanted to get a quick update on the tasks from this week." },
      { speaker: 'user', text: "Sure. I can walk you through the current status." },
      { speaker: 'ai', text: "How many tasks have you completed?" },
      { speaker: 'user', text: "I had 15 tasks assigned this week. I've completed 11 so far, and 4 are still pending." },
      { speaker: 'ai', text: "What's pending?" },
      { speaker: 'user', text: "Two are waiting for client documents, one is waiting for carrier confirmation, and one is currently being processed." },
      { speaker: 'ai', text: "Which ones are waiting for client documents?" },
      { speaker: 'user', text: "The Davis renewal and the Miller policy update." },
      { speaker: 'ai', text: "Have you followed up with them?" },
      { speaker: 'user', text: "Yes. I followed up with both clients yesterday. I'm waiting for their response." },
      { speaker: 'ai', text: "And what about the carrier confirmation?" },
      { speaker: 'user', text: "That's for the Wilson policy. I submitted the request yesterday and I'm waiting for the carrier's response." },
      { speaker: 'ai', text: "When do you expect to complete the remaining tasks?" },
      { speaker: 'user', text: "If we receive the required documents and carrier confirmation today, I expect to complete all four by tomorrow." },
      { speaker: 'ai', text: "Okay. Anything else I should know?" },
      { speaker: 'user', text: "No major issues at the moment. I'll let you know if there are any changes." }
    ]
  },
  {
    id: 'scenario_2b_detailed_status',
    category: 'weekly_update',
    categoryTitle: '2. Weekly Update Calls',
    scenarioCode: 'Scenario 2B',
    title: 'Client Asks for Detailed Status',
    character: 'client',
    characterTitle: 'Client (Agency Owner)',
    tone: 'normal',
    callType: 'weekly_update',
    objective: 'Deliver detailed breakdown: 12 assigned (8 done, 3 in progress, 1 pending) with delay reasons, reminder timing, and completion forecast.',
    scenarioData: {
      clientName: 'David Sterling',
      tasks: [
        '12 assigned tasks total',
        '8 completed',
        '3 in progress (2 renewal reviews, 1 policy endorsement request)',
        '1 pending due to missing signed client application form (reminder sent this morning)'
      ],
      deadlines: 'Renewal reviews done today; endorsement update expected tomorrow from carrier'
    },
    aiObjective: 'Ask broad question "What is the update on everything?", probe into delay cause, verify reminder was sent, check in-progress items and completion times.',
    expectedBehaviours: [
      'Immediate macro breakdown (12 assigned, 8 done, 3 in progress, 1 pending)',
      'Identifies blocker reason (client signed application form)',
      'Specifies follow-up action taken (sent reminder this morning)',
      'Specifies expected resolution timelines (today vs tomorrow)'
    ],
    initialOpeningLine: "What's the update on everything?",
    rulesTested: ['Outcome First (Macro status)', 'Issue & Cause isolation', 'Timelines'],
    referenceDialogue: [
      { speaker: 'ai', text: "What's the update on everything?" },
      { speaker: 'user', text: "Sure. I have 12 assigned tasks. Eight are completed, three are in progress, and one is pending due to missing information." },
      { speaker: 'ai', text: "What's causing the delay?" },
      { speaker: 'user', text: "The pending task is waiting for the client's signed application form." },
      { speaker: 'ai', text: "Did you follow up?" },
      { speaker: 'user', text: "Yes. I sent a reminder this morning." },
      { speaker: 'ai', text: "And the three in progress?" },
      { speaker: 'user', text: "Two are renewal reviews, and one is a policy endorsement request." },
      { speaker: 'ai', text: "When will they be completed?" },
      { speaker: 'user', text: "The renewal reviews should be completed by the end of today. The endorsement request depends on carrier confirmation, so I'm expecting an update tomorrow." },
      { speaker: 'ai', text: "Okay." },
      { speaker: 'user', text: "I'll keep monitoring the carrier request and update you once I receive confirmation." }
    ]
  },
  {
    id: 'scenario_2c_difficult_update',
    category: 'weekly_update',
    categoryTitle: '2. Weekly Update Calls',
    scenarioCode: 'Scenario 2C',
    title: 'Difficult Weekly Update (Angry Client)',
    character: 'client',
    characterTitle: 'Client (Frustrated Agency Principal)',
    tone: 'rude',
    callType: 'weekly_update',
    objective: 'Test handling delays without saying "It is not my fault". Framework: Issue → Impact → Action → Action Ahead with strict cutoff deadline commitment.',
    scenarioData: {
      clientName: 'Greg Harrison',
      tasks: [
        '20 assigned tasks',
        '16 completed',
        '4 pending: 2 waiting insured documents, 1 carrier confirmation, 1 additional info from client'
      ],
      issueDetails: 'Client is upset that tasks discussed last week are not finished and demands to know why carrier issue was not escalated earlier.'
    },
    aiObjective: 'Confront trainee aggressively ("Why aren\'t they finished?", "Why wasn\'t this escalated earlier?"). If trainee says "Not my fault" or blames the carrier, get angrier. If trainee takes ownership, explains the 4 pending items clearly, admits the escalation should have been earlier, and commits to a 3 PM update, accept it.',
    expectedBehaviours: [
      'Acknowledge client concern calmly',
      'Clear breakdown (20 assigned, 16 completed, 4 pending)',
      'Specific pending categories',
      'Accountability: Own delay in carrier escalation without deflecting',
      'Action Ahead: Escalate today and provide update by 3 PM'
    ],
    initialOpeningLine: "We discussed these tasks last week. Why aren't they finished?",
    rulesTested: ['Issue → Impact → Action → Action Ahead', 'Zero blame / High accountability', 'Concrete deadline (3 PM)'],
    referenceDialogue: [
      { speaker: 'ai', text: "We discussed these tasks last week. Why aren't they finished?" },
      { speaker: 'user', text: "I understand your concern. Let me give you a clear update." },
      { speaker: 'ai', text: "Go ahead." },
      { speaker: 'user', text: "Out of 20 assigned tasks, 16 have been completed. Four are still pending." },
      { speaker: 'ai', text: "Why?" },
      { speaker: 'user', text: "Two are waiting for documents from the insured, one is waiting for carrier confirmation, and one requires additional information from the client." },
      { speaker: 'ai', text: "Why wasn't this escalated earlier?" },
      { speaker: 'user', text: "I followed up on the pending items. I should have escalated the carrier request sooner, and I'll make sure it's escalated today." },
      { speaker: 'ai', text: "When will everything be done?" },
      { speaker: 'user', text: "The two document-dependent tasks can be completed as soon as we receive the documents. The carrier-dependent task is expected to be updated tomorrow. I'll prioritize the remaining items and provide you with another update by 3 PM today." },
      { speaker: 'ai', text: "Fine." },
      { speaker: 'user', text: "I'll make sure you have a clear status update by then." }
    ]
  },

  // ==========================================
  // 3. FEEDBACK CALLS
  // ==========================================
  {
    id: 'scenario_3a_feedback_comm',
    category: 'feedback',
    categoryTitle: '3. Feedback Calls',
    scenarioCode: 'Scenario 3A',
    title: 'Communication Feedback (Confirming Requirements)',
    character: 'poc',
    characterTitle: 'POC (Supervisor)',
    tone: 'polite',
    callType: 'feedback',
    objective: 'Receive constructive feedback gracefully and establish commitment to confirm deadlines and special certificate wording before starting tasks.',
    scenarioData: {
      clientName: 'Kelly Simmons (POC)',
      issueDetails: 'Trainee has good confidence and completed COI correctly, but started work without confirming specific certificate-holder wording or deadline beforehand.'
    },
    aiObjective: 'Praise trainee confidence first, then coach on confirming instructions/deadlines before beginning tasks, citing yesterday COI wording example.',
    expectedBehaviours: [
      'Open, appreciative reception of feedback',
      'Ask for concrete example',
      'Acknowledge fair point without defensiveness',
      'Commit to specific new habit going forward'
    ],
    initialOpeningLine: "I wanted to give you some feedback about your calls this week.",
    rulesTested: ['Receptive listening', 'Active clarification', 'Actionable commitment'],
    referenceDialogue: [
      { speaker: 'ai', text: "I wanted to give you some feedback about your calls this week." },
      { speaker: 'user', text: "Sure. I'm happy to hear your feedback." },
      { speaker: 'ai', text: "Your communication has improved. You're sounding more confident when speaking with clients." },
      { speaker: 'user', text: "Thank you. I appreciate that." },
      { speaker: 'ai', text: "One thing I'd like you to improve is how you confirm instructions." },
      { speaker: 'user', text: "Okay. Could you give me an example?" },
      { speaker: 'ai', text: "Sometimes you start working on a request without confirming the deadline or specific requirements." },
      { speaker: 'user', text: "Understood." },
      { speaker: 'ai', text: "For example, yesterday's COI request had specific certificate-holder wording." },
      { speaker: 'user', text: "Right." },
      { speaker: 'ai', text: "You completed the COI correctly, but you didn't confirm the wording before starting." },
      { speaker: 'user', text: "That's a fair point. Going forward, I'll confirm the key requirements and deadline before starting the task." },
      { speaker: 'ai', text: "Good. That's what I'd like to see." },
      { speaker: 'user', text: "Thank you for pointing that out. I'll work on it." }
    ]
  },
  {
    id: 'scenario_3b_feedback_priority',
    category: 'feedback',
    categoryTitle: '3. Feedback Calls',
    scenarioCode: 'Scenario 3B',
    title: 'Task-Completion Feedback (Urgency Prioritization)',
    character: 'client',
    characterTitle: 'Client (Operations Lead)',
    tone: 'normal',
    callType: 'feedback',
    objective: 'Transition from FIFO (first-in first-out) processing to prioritizing by urgency and business impact; confirm priorities on concurrent urgent tasks.',
    scenarioData: {
      clientName: 'Marcus Bradley',
      issueDetails: 'Task completion rate is good, but tasks are finished too close to cutoff because trainee handles them in order received rather than by business urgency.'
    },
    aiObjective: 'Acknowledge good completion rate, point out tasks cutting close to deadlines, explain difference between noon client request vs routine internal review.',
    expectedBehaviours: [
      'Listen without interrupting',
      'Connect feedback to business impact',
      'Formulate rule: prioritize by deadline and urgency',
      'Proactively offer to confirm priorities if multiple urgent tasks coincide'
    ],
    initialOpeningLine: "Overall, you've been doing well, but I'd like to discuss something.",
    rulesTested: ['Professional receptivity', 'Business impact awareness', 'Proactive communication'],
    referenceDialogue: [
      { speaker: 'ai', text: "Overall, you've been doing well, but I'd like to discuss something." },
      { speaker: 'user', text: "Sure." },
      { speaker: 'ai', text: "Your task completion rate is good, but I've noticed that some tasks are completed close to the deadline." },
      { speaker: 'user', text: "I understand." },
      { speaker: 'ai', text: "I'd like you to start prioritizing tasks based on urgency rather than handling them in the order they're received." },
      { speaker: 'user', text: "That makes sense." },
      { speaker: 'ai', text: "For example, a client-facing request due at noon should take priority over a routine internal review." },
      { speaker: 'user', text: "Understood. I'll prioritize tasks based on deadline and business impact." },
      { speaker: 'ai', text: "Good." },
      { speaker: 'user', text: "I'll also confirm priorities with you if I receive multiple urgent requests at the same time." },
      { speaker: 'ai', text: "Exactly." }
    ]
  },
  {
    id: 'scenario_3c_feedback_rude',
    category: 'feedback',
    categoryTitle: '3. Feedback Calls',
    scenarioCode: 'Scenario 3C',
    title: 'Rude Feedback (Resource Utilization & Specificity)',
    character: 'client',
    characterTitle: 'Client (Demanding Partner)',
    tone: 'rude',
    callType: 'feedback',
    objective: 'Handle blunt criticism ("asking questions you should know", "updates too vague") by offering specific behavioral fixes without getting defensive.',
    scenarioData: {
      clientName: 'Arthur Pendelton',
      issueDetails: 'Unhappy because trainee asks questions answerable via internal documentation and delivers vague updates.'
    },
    aiObjective: 'Deliver blunt, dismissive feedback. Complain trainee should know where files are and that updates lack detail. If trainee responds constructively with concrete changes (checking resources first, structuring updates with tasks/delays/timelines), acknowledge with "Okay."',
    expectedBehaviours: [
      'Stay completely professional despite harsh criticism',
      'Ask specifically what needs improvement',
      'Commit to reviewing available resources before asking',
      'Define exact structure of future updates (completed, pending, reasons, expected times)'
    ],
    initialOpeningLine: "Honestly, I'm not happy with the way you're handling these tasks.",
    rulesTested: ['Zero defensiveness', 'Constructive reframing', 'Specific operational commitments'],
    referenceDialogue: [
      { speaker: 'ai', text: "Honestly, I'm not happy with the way you're handling these tasks." },
      { speaker: 'user', text: "I understand. Could you please help me understand what specifically needs improvement?" },
      { speaker: 'ai', text: "You keep asking questions that you should already know the answers to." },
      { speaker: 'user', text: "I understand your concern. I do want to make sure I'm following the correct process. If there are specific areas where I should be more self-sufficient, I'd appreciate knowing them." },
      { speaker: 'ai', text: "You should know where to find the information." },
      { speaker: 'user', text: "Understood. I'll review the available resources first before asking for information. I'll only reach out when the information isn't available or when clarification is required." },
      { speaker: 'ai', text: "That's what I expect." },
      { speaker: 'user', text: "Understood. I'll work on that." },
      { speaker: 'ai', text: "And your updates are too vague." },
      { speaker: 'user', text: "That's helpful feedback. I'll make my updates more specific by mentioning completed tasks, pending tasks, reasons for delays, and expected completion times." },
      { speaker: 'ai', text: "Okay." },
      { speaker: 'user', text: "Thank you for the feedback. I'll apply this in my upcoming tasks." }
    ]
  },

  // ==========================================
  // 4. CARRIER CALLS
  // ==========================================
  {
    id: 'scenario_4a_carrier_missing_doc',
    category: 'carrier',
    categoryTitle: '4. Carrier Calls',
    scenarioCode: 'Scenario 4A',
    title: 'Missing Underwriting Document (Supplemental Application)',
    character: 'carrier',
    characterTitle: 'Carrier Underwriter (Commercial Property)',
    tone: 'normal',
    callType: 'carrier_coordination',
    objective: 'Carrier interaction regarding Johnson Commercial policy missing commercial property supplemental form. Clarify if it is the only pending item and verify Friday deadline.',
    scenarioData: {
      carrierName: 'Travelers Underwriting (Chris Nolan)',
      company: 'Johnson Commercial',
      policyNumber: 'CP-JOH-8820',
      documents: 'Signed commercial property supplemental form',
      deadlines: 'Submit before Friday to unblock underwriting review',
      issueDetails: 'Underwriting cannot proceed without the signed supplemental form.'
    },
    aiObjective: 'State you are calling about Johnson Commercial policy missing signed supplemental form. When asked, confirm it is the property form, that it is the only pending item, and preference is Friday.',
    expectedBehaviours: [
      'Offer professional assistance immediately',
      'Clarify exact supplemental form name',
      'Verify if it is the only outstanding requirement',
      'Verify impact (will review proceed once received)',
      'Confirm submission cutoff deadline',
      'Commit to coordinate with insured before Friday'
    ],
    initialOpeningLine: "Hi, I'm calling regarding the Johnson Commercial policy.",
    rulesTested: ['Precise insurance terminology', 'Clarifying questions', 'Clear operational commitment'],
    referenceDialogue: [
      { speaker: 'ai', text: "Hi, I'm calling regarding the Johnson Commercial policy." },
      { speaker: 'user', text: "Sure. How can I assist you?" },
      { speaker: 'ai', text: "We're still missing the signed supplemental application." },
      { speaker: 'user', text: "Understood. Could you confirm which supplemental application you're referring to?" },
      { speaker: 'ai', text: "The commercial property supplemental form." },
      { speaker: 'user', text: "Got it. Is that the only outstanding requirement?" },
      { speaker: 'ai', text: "Yes, that's the only item currently showing as pending." },
      { speaker: 'user', text: "Once we provide the signed form, will the underwriting review be able to proceed?" },
      { speaker: 'ai', text: "Yes." },
      { speaker: 'user', text: "And is there a deadline for submitting it?" },
      { speaker: 'ai', text: "We'd prefer to receive it by Friday." },
      { speaker: 'user', text: "Understood. I'll coordinate with the insured and work on getting the signed form to you before Friday." },
      { speaker: 'ai', text: "Perfect." },
      { speaker: 'user', text: "Thank you for clarifying." }
    ]
  },
  {
    id: 'scenario_4b_carrier_quote',
    category: 'carrier',
    categoryTitle: '4. Carrier Calls',
    scenarioCode: 'Scenario 4B',
    title: 'Quote Clarification (Annual Revenue Verification)',
    character: 'carrier',
    characterTitle: 'Carrier Underwriter (Rating Specialist)',
    tone: 'normal',
    callType: 'carrier_coordination',
    objective: 'Clarify estimated annual revenue of $2.5 million for ABC Manufacturing quote request and coordinate verification with insured.',
    scenarioData: {
      carrierName: 'Hartford Commercial Underwriting',
      company: 'ABC Manufacturing',
      revenue: '$2.5 million currently in submission',
      issueDetails: 'Underwriter needs confirmation whether the $2.5M revenue figure is still accurate before issuing formal quote terms.'
    },
    aiObjective: 'State calling regarding ABC Manufacturing quote request. Explain need for clarification on estimated annual revenue ($2.5 million in file).',
    expectedBehaviours: [
      'Inquire what information is needed',
      'Ask what figure currently reflects in submission',
      'Confirm the exact question being asked',
      'Commit to verify with insured and follow up',
      'Check if anything else is needed at this stage'
    ],
    initialOpeningLine: "I'm calling regarding the quote request for ABC Manufacturing.",
    rulesTested: ['Financial/Revenue clarification', 'Precise confirmation', 'Check for secondary requirements'],
    referenceDialogue: [
      { speaker: 'ai', text: "I'm calling regarding the quote request for ABC Manufacturing." },
      { speaker: 'user', text: "Sure. What information do you need?" },
      { speaker: 'ai', text: "We need clarification regarding the estimated annual revenue." },
      { speaker: 'user', text: "Sure. Could you tell me what revenue figure is currently reflected in the submission?" },
      { speaker: 'ai', text: "$2.5 million." },
      { speaker: 'user', text: "Understood. Are you asking us to confirm whether $2.5 million is still accurate?" },
      { speaker: 'ai', text: "Correct." },
      { speaker: 'user', text: "I'll verify that with the insured and get back to you." },
      { speaker: 'ai', text: "Great." },
      { speaker: 'user', text: "Is there anything else you need from us at this stage?" },
      { speaker: 'ai', text: "No, that's all for now." },
      { speaker: 'user', text: "Perfect. I'll confirm the revenue and follow up with you." }
    ]
  },
  {
    id: 'scenario_4c_carrier_endorsement',
    category: 'carrier',
    categoryTitle: '4. Carrier Calls',
    scenarioCode: 'Scenario 4C',
    title: 'Policy Endorsement (Effective Date Discrepancy)',
    character: 'carrier',
    characterTitle: 'Carrier Policy Processing Specialist',
    tone: 'normal',
    callType: 'carrier_coordination',
    objective: 'Resolve effective date discrepancy on Johnson endorsement (showing October 1st on carrier end, should be October 5th).',
    scenarioData: {
      carrierName: 'Liberty Mutual Endorsements',
      company: 'Johnson Policy',
      policyNumber: 'LM-JOH-1029',
      deadlines: 'Effective date October 5th (revised submission requested)',
      issueDetails: 'Carrier received request with Oct 1st effective date, needs clarification and revised submission.'
    },
    aiObjective: 'Inform trainee endorsement request was received for Johnson policy, but need clarification on effective date showing October 1st.',
    expectedBehaviours: [
      'Inquire what date currently shows on carrier end',
      'Clarify intended effective date (October 5th)',
      'Ask if revised request should be submitted',
      'Commit to sending revised request promptly'
    ],
    initialOpeningLine: "We received the endorsement request for the Johnson policy.",
    rulesTested: ['Date verification', 'Discrepancy resolution', 'Proactive remediation'],
    referenceDialogue: [
      { speaker: 'ai', text: "We received the endorsement request for the Johnson policy." },
      { speaker: 'user', text: "Sure." },
      { speaker: 'ai', text: "We need clarification regarding the effective date." },
      { speaker: 'user', text: "Certainly. What date is currently showing on your end?" },
      { speaker: 'ai', text: "October 1st." },
      { speaker: 'user', text: "The requested effective date should be October 5th. Would you like us to submit a revised request?" },
      { speaker: 'ai', text: "Yes, please." },
      { speaker: 'user', text: "Understood. I'll send the revised request with October 5th as the effective date." },
      { speaker: 'ai', text: "Thank you." },
      { speaker: 'user', text: "You're welcome." }
    ]
  },

  // ==========================================
  // 5. INSURED CALLS
  // ==========================================
  {
    id: 'scenario_5a_insured_purchase',
    category: 'insured',
    categoryTitle: '5. Insured Calls',
    scenarioCode: 'Scenario 5A',
    title: 'Policy Purchase Inquiry (New Business Customer)',
    character: 'insured',
    characterTitle: 'Insured (Prospective Business Owner)',
    tone: 'polite',
    callType: 'policy_query',
    objective: 'First interaction with policyholder: explain required risk parameters, document process, and turnaround expectations with zero jargon.',
    scenarioData: {
      insuredName: 'Danielle Brooks',
      company: 'Brooks Artisan Bakery',
      tasks: ['Collect business name, type, location, operations, estimated annual revenue'],
      extraContext: 'Customer wants to know required documents and how long quotes take.'
    },
    aiObjective: 'Express interest in commercial business insurance, ask what information is needed, ask about documents, ask quote timeframe, and agree to provide details.',
    expectedBehaviours: [
      'Warm, professional greeting offering help',
      'Clear explanation of required details without overwhelming',
      'Explain document requirements depend on coverage type',
      'Realistic timeline management without false promises',
      'Offer to start collecting details'
    ],
    initialOpeningLine: "Hi, I'm interested in getting insurance for my business.",
    rulesTested: ['Customer empathy & warmth', 'Plain English (no jargon)', 'Setting expectations'],
    referenceDialogue: [
      { speaker: 'ai', text: "Hi, I'm interested in getting insurance for my business." },
      { speaker: 'user', text: "Absolutely. I'd be happy to help with the initial information." },
      { speaker: 'ai', text: "What information do you need from me?" },
      { speaker: 'user', text: "I'll need some basic information about your business, including the business name, type of business, location, operations, and estimated annual revenue." },
      { speaker: 'ai', text: "Do I need to provide any documents?" },
      { speaker: 'user', text: "Depending on the type of coverage, we may need additional documents. Once I understand your requirements, I'll let you know what is needed." },
      { speaker: 'ai', text: "How long does the quote take?" },
      { speaker: 'user', text: "The timeframe can vary depending on the coverage and the information required. Once we have the complete information, we can submit the request and keep you updated on the status." },
      { speaker: 'ai', text: "Okay." },
      { speaker: 'user', text: "Would you like me to start by collecting your business and coverage details?" },
      { speaker: 'ai', text: "Yes." }
    ]
  },
  {
    id: 'scenario_5b_insured_query',
    category: 'insured',
    categoryTitle: '5. Insured Calls',
    scenarioCode: 'Scenario 5B',
    title: 'Policy Coverage Query (Adding a Contractor)',
    character: 'insured',
    characterTitle: 'Insured (Existing Commercial Client)',
    tone: 'normal',
    callType: 'policy_query',
    objective: 'Insured does not understand additional insured section and wants to know if they can add a contractor. Trainee must verify policy first without giving incorrect advice.',
    scenarioData: {
      insuredName: 'Frank Castillo',
      company: 'Castillo Renovation LLC',
      policyNumber: 'GL-CAS-4412',
      issueDetails: 'Insured received policy documents and is confused about Additional Insured endorsement for independent contractors.'
    },
    aiObjective: 'State you received documents but don\'t understand coverage section. Point to additional insured section. State you want to know if you can add a contractor.',
    expectedBehaviours: [
      'Inquire which section the insured is reviewing',
      'Verify policy details before making promises',
      'Clarify intent: provision explanation vs specific entity addition',
      'Avoid giving unauthorized or speculative coverage advice',
      'Commit to verify applicable carrier requirements'
    ],
    initialOpeningLine: "I received my policy documents, but I don't understand one part of my coverage.",
    rulesTested: ['Accurate boundaries (No false promises)', 'Clarity in questioning', 'Reassurance'],
    referenceDialogue: [
      { speaker: 'ai', text: "I received my policy documents, but I don't understand one part of my coverage." },
      { speaker: 'user', text: "Sure. Could you tell me which section you're referring to?" },
      { speaker: 'ai', text: "The additional insured section." },
      { speaker: 'user', text: "Certainly. Let me check the policy details first so I can provide you with accurate information." },
      { speaker: 'ai', text: "Okay." },
      { speaker: 'user', text: "I can see the section you're referring to. Would you like me to explain what the provision means, or are you asking whether a specific person or organization can be added?" },
      { speaker: 'ai', text: "I want to know whether I can add a contractor." },
      { speaker: 'user', text: "Understood. I'll need to verify the policy requirements before confirming that. I don't want to give you incorrect information." },
      { speaker: 'ai', text: "Okay." },
      { speaker: 'user', text: "I'll check the applicable requirements and let you know what documentation, if any, is required." }
    ]
  },

  // ==========================================
  // 6. INSURED — QUOTE CREATION
  // ==========================================
  {
    id: 'scenario_6_insured_quote',
    category: 'insured',
    categoryTitle: '6. Insured — Quote Creation',
    scenarioCode: 'Scenario 6',
    title: 'Quote Creation: Commercial Garage (Smith Auto Repair)',
    character: 'insured',
    characterTitle: 'Insured (Business Owner)',
    tone: 'normal',
    callType: 'quote',
    objective: 'Collect risk parameters systematically: business name, location (Chicago), services (auto repair), employee count (8), revenue ($900,000), coverages (GL & Property).',
    scenarioData: {
      insuredName: 'Thomas Smith',
      company: 'Smith Auto Repair',
      agency: 'Chicago, IL',
      revenue: '$900,000 estimated annual revenue',
      tasks: ['8 employees', 'General auto repair', 'General liability and property coverage']
    },
    aiObjective: 'State wanting a quote for new business. Answer questions sequentially: Smith Auto Repair in Chicago, general auto repair, 8 employees, around $900,000, General Liability and Property coverage.',
    expectedBehaviours: [
      'Systematic information gathering',
      'Business name & location prompt',
      'Service/operation classification',
      'Employee count check',
      'Estimated revenue check',
      'Coverage lines identification',
      'Summarize & explain next steps'
    ],
    initialOpeningLine: "I want to get a quote for my new business.",
    rulesTested: ['Structured intake interview', 'Active note-taking', 'Next step commitments'],
    referenceDialogue: [
      { speaker: 'ai', text: "I want to get a quote for my new business." },
      { speaker: 'user', text: "Sure. I'll help you with the information required to start the quote." },
      { speaker: 'ai', text: "What do you need?" },
      { speaker: 'user', text: "First, I'll need your business name and location." },
      { speaker: 'ai', text: "It's Smith Auto Repair in Chicago." },
      { speaker: 'user', text: "Thank you. What type of services do you provide?" },
      { speaker: 'ai', text: "General auto repair." },
      { speaker: 'user', text: "Approximately how many employees do you have?" },
      { speaker: 'ai', text: "Eight." },
      { speaker: 'user', text: "And what is your estimated annual revenue?" },
      { speaker: 'ai', text: "Around $900,000." },
      { speaker: 'user', text: "Thank you. I'll also need information about the type of coverage you're looking for." },
      { speaker: 'ai', text: "General liability and property coverage." },
      { speaker: 'user', text: "Understood. I'll record that. I'll review the information and let you know if any additional details or documents are required before the quote can be processed." }
    ]
  },

  // ==========================================
  // 7. INSURED — DOCUMENT REQUEST
  // ==========================================
  {
    id: 'scenario_7_insured_docs',
    category: 'insured',
    categoryTitle: '7. Insured — Document Request',
    scenarioCode: 'Scenario 7',
    title: 'Document Request & Secure Submission Explanation',
    character: 'insured',
    characterTitle: 'Insured (Customer Responding to Email)',
    tone: 'normal',
    callType: 'documentation',
    objective: 'Clarify exact missing documents (signed application & 5-year loss history) and ensure submission via secure channel for privacy compliance.',
    scenarioData: {
      insuredName: 'Elena Rostova',
      documents: 'Signed commercial application and requested loss history document',
      issueDetails: 'Insured received an email asking for documents and wants to know what to send and whether standard email is permitted.'
    },
    aiObjective: 'Say you got an email saying documents are needed. Ask what to send. Ask if you can just email them back.',
    expectedBehaviours: [
      'Immediate clarification of exact missing documents',
      'Explain signed application and loss history requirements',
      'Advise secure submission channel over unencrypted email',
      'Reassure review process once documents arrive'
    ],
    initialOpeningLine: "I received an email saying you need some documents.",
    rulesTested: ['Precision in documentation', 'Compliance & security guidance', 'Reassurance'],
    referenceDialogue: [
      { speaker: 'ai', text: "I received an email saying you need some documents." },
      { speaker: 'user', text: "Yes. I'd be happy to clarify what's required." },
      { speaker: 'ai', text: "What exactly do I need to send?" },
      { speaker: 'user', text: "We're currently missing your signed application and the requested loss history document." },
      { speaker: 'ai', text: "Where should I send them?" },
      { speaker: 'user', text: "You can send them through the secure channel mentioned in the email." },
      { speaker: 'ai', text: "Can I just email them to you?" },
      { speaker: 'user', text: "I'll confirm the appropriate submission method for your documents to make sure they're sent securely." },
      { speaker: 'ai', text: "Okay." },
      { speaker: 'user', text: "Once we receive them, we'll review the documents and let you know if anything else is required." }
    ]
  },

  // ==========================================
  // 8. INSURED — CLAIM HANDLING
  // ==========================================
  {
    id: 'scenario_8_insured_claim',
    category: 'insured',
    categoryTitle: '8. Insured — Claim Handling',
    scenarioCode: 'Scenario 8',
    title: 'First Notice of Loss: Commercial Vehicle Collision',
    character: 'insured',
    characterTitle: 'Insured (Distressed Fleet Manager)',
    tone: 'normal',
    callType: 'claim',
    objective: 'Show empathy, gather incident details: date/time (yesterday 4 PM), collision summary (another vehicle struck company vehicle), injury status (none), police involvement and report number.',
    scenarioData: {
      insuredName: 'Brian Miller',
      company: 'Miller Courier Logistics',
      policyNumber: 'BA-MIL-7719',
      issueDetails: 'Company vehicle was struck in traffic yesterday around 4 PM. No injuries occurred, police responded and filed a report.'
    },
    aiObjective: 'State need to report claim for accident yesterday. Answer questions: yesterday around 4 PM, another vehicle hit company vehicle, no injuries, police were involved and report number is ready.',
    expectedBehaviours: [
      'Empathetic response ("I\'m sorry to hear that")',
      'Capture incident date and approximate time',
      'Brief explanation of loss events',
      'Explicit injury inquiry (No injuries confirmed)',
      'Police report inquiry and documentation check',
      'Process explanation without premature settlement promises'
    ],
    initialOpeningLine: "I need to report a claim.",
    rulesTested: ['Empathy in high-stress situations', 'Orderly FNOL information capture', 'Accurate expectations'],
    referenceDialogue: [
      { speaker: 'ai', text: "I need to report a claim." },
      { speaker: 'user', text: "I'm sorry to hear that. I'll help you with the initial information." },
      { speaker: 'ai', text: "There was an accident yesterday." },
      { speaker: 'user', text: "Understood. Could you provide the date and approximate time of the incident?" },
      { speaker: 'ai', text: "Yesterday around 4 PM." },
      { speaker: 'user', text: "Thank you. Could you briefly explain what happened?" },
      { speaker: 'ai', text: "Another vehicle hit our company vehicle." },
      { speaker: 'user', text: "Understood. Was anyone injured?" },
      { speaker: 'ai', text: "No." },
      { speaker: 'user', text: "Thank you for confirming. Were the police involved?" },
      { speaker: 'ai', text: "Yes." },
      { speaker: 'user', text: "Do you have the police report or report number available?" },
      { speaker: 'ai', text: "Yes." },
      { speaker: 'user', text: "Great. I'll record the information and explain the next steps in the claim process." },
      { speaker: 'ai', text: "How long will it take?" },
      { speaker: 'user', text: "The timeframe can vary depending on the claim and the information required. I'll make sure your information is documented correctly and guide you on the next steps." }
    ]
  },

  // ==========================================
  // 9. INSURED — RENEWAL CALL
  // ==========================================
  {
    id: 'scenario_9_insured_renewal',
    category: 'insured',
    categoryTitle: '9. Insured — Renewal Call',
    scenarioCode: 'Scenario 9',
    title: 'Policy Renewal Inquiry (Automatic Renewal Clarification)',
    character: 'insured',
    characterTitle: 'Insured (Policyholder)',
    tone: 'normal',
    callType: 'renewal',
    objective: 'Address client inquiry regarding automatic policy renewal without assuming terms; verify current terms and check outstanding requirements.',
    scenarioData: {
      insuredName: 'Angela Rossi',
      company: 'Rossi Trattoria',
      policyNumber: 'BOP-ROS-5501',
      issueDetails: 'Received notice regarding upcoming renewal and wants to know if it renews automatically and what documents are needed.'
    },
    aiObjective: 'Say received message about renewal. Ask "Does my policy automatically renew?" and "What do you need from me?"',
    expectedBehaviours: [
      'Offer assistance courteously',
      'Commit to verify policy terms before confirming auto-renewal',
      'Check for pending underwriting or exposure requirements',
      'Outline next steps to review and follow up'
    ],
    initialOpeningLine: "I received a message about my policy renewal.",
    rulesTested: ['Verification before confirmation', 'Clear communication', 'Follow-up commitment'],
    referenceDialogue: [
      { speaker: 'ai', text: "I received a message about my policy renewal." },
      { speaker: 'user', text: "Sure. I'd be happy to help." },
      { speaker: 'ai', text: "Does my policy automatically renew?" },
      { speaker: 'user', text: "I'll need to check the policy details before confirming that." },
      { speaker: 'ai', text: "Okay." },
      { speaker: 'user', text: "I can also check whether there are any outstanding requirements or information needed for the renewal." },
      { speaker: 'ai', text: "What do you need from me?" },
      { speaker: 'user', text: "I'll first verify the current policy information. If anything needs to be updated, I'll let you know." },
      { speaker: 'ai', text: "Sounds good." },
      { speaker: 'user', text: "I'll review the renewal details and get back to you with the next steps." }
    ]
  },

  // ==========================================
  // 10. CROSS-CHARACTER SCENARIO — TASK + FOLLOW-UP
  // ==========================================
  {
    id: 'scenario_10_cross_task_coi',
    category: 'cross_character',
    categoryTitle: '10. Cross-Character Scenario',
    scenarioCode: 'Scenario 10',
    title: 'Multi-Stage Simulation: ABC Construction COI & Carrier Blocker',
    character: 'client',
    characterTitle: 'Multi-Stage (Client → Carrier → Client)',
    tone: 'normal',
    callType: 'carrier_coordination',
    objective: 'Simulate end-to-end operational workflow: Stage 1 (Client assigns COI) -> Stage 2 (Carrier rejects for missing mailing address) -> Stage 3 (Client update) -> Stage 4 (Final resolution).',
    scenarioData: {
      clientName: 'Client (Stage 1 & 3 & 4) / Carrier (Stage 2)',
      company: 'ABC Construction',
      documents: 'Certificate of Insurance with incomplete certificate holder mailing address',
      deadlines: 'Needed today'
    },
    aiObjective: 'Progress through 4 realistic operational stages: Stage 1 (Client: Need COI for ABC Construction today), Stage 2 (Carrier: Certificate holder address incomplete), Stage 3 (Client asks what is happening), Stage 4 (Client asks for final update).',
    expectedBehaviours: [
      'Stage 1: Inquire about deadline, holder info, and special wording',
      'Stage 2: Ask carrier which specific address fields are missing',
      'Stage 3: Update client honestly without panic: issue, action taken, expected resolution',
      'Stage 4: Confirm address received, submitted to carrier, expect revised today'
    ],
    initialOpeningLine: "[Stage 1 — Client] I need you to obtain a certificate for ABC Construction.",
    rulesTested: ['Multi-stakeholder coordination', 'Accurate status reporting', 'Closing the loop'],
    stages: [
      { stageName: 'Stage 1 — Client Assigns Task', character: 'client', instructions: 'Client asks for COI for ABC Construction today, info in email.' },
      { stageName: 'Stage 2 — Carrier Interaction', character: 'carrier', instructions: 'Carrier informs certificate holder mailing address is missing.' },
      { stageName: 'Stage 3 — Client Update', character: 'client', instructions: 'Client checks in: "What is happening with the COI?"' },
      { stageName: 'Stage 4 — Final Update', character: 'client', instructions: 'Client follows up: "Any update?"' }
    ],
    referenceDialogue: [
      { speaker: 'ai', text: "[Stage 1 - Client] I need you to obtain a certificate for ABC Construction." },
      { speaker: 'user', text: "Sure. When do you need it?" },
      { speaker: 'ai', text: "Today." },
      { speaker: 'user', text: "Do we have the certificate holder information?" },
      { speaker: 'ai', text: "Check the client's email." },
      { speaker: 'user', text: "Got it. Is there any specific wording that needs to be included?" },
      { speaker: 'ai', text: "Yes. It's in the email." },
      { speaker: 'user', text: "Understood. I'll review the email, prepare the COI, and send it for your review." },
      { speaker: 'ai', text: "[Stage 2 - Carrier] We received the request, but the certificate holder information is incomplete." },
      { speaker: 'user', text: "Understood. Which information is missing?" },
      { speaker: 'ai', text: "The complete mailing address." },
      { speaker: 'user', text: "Got it. I'll verify the address and provide the updated information." },
      { speaker: 'ai', text: "[Stage 3 - Client] What's happening with the COI?" },
      { speaker: 'user', text: "The carrier requested the complete certificate holder mailing address. I've contacted the client to verify it." },
      { speaker: 'ai', text: "When will it be ready?" },
      { speaker: 'user', text: "Once I receive the address, I'll update the request and send it back to the carrier." },
      { speaker: 'ai', text: "[Stage 4 - Client] Any update?" },
      { speaker: 'user', text: "Yes. I've received the address, updated the request, and sent it to the carrier. We're currently waiting for the revised certificate." },
      { speaker: 'ai', text: "When do you expect it?" },
      { speaker: 'user', text: "Based on the current status, I'm expecting it later today. I'll monitor it and update you once it's received." }
    ]
  },

  // ==========================================
  // 11. CROSS-CHARACTER — INSURED → VA → CARRIER
  // ==========================================
  {
    id: 'scenario_11_cross_vehicle_add',
    category: 'cross_character',
    categoryTitle: '11. Cross-Character Scenario',
    scenarioCode: 'Scenario 11',
    title: 'Multi-Stage Simulation: Adding a New Vehicle to Commercial Auto',
    character: 'insured',
    characterTitle: 'Multi-Stage (Insured → Carrier → Insured)',
    tone: 'normal',
    callType: 'carrier_coordination',
    objective: 'Coordinate between Insured and Carrier: collect vehicle specs & VIN, respond to carrier requirement for purchase document, and retrieve it from insured.',
    scenarioData: {
      insuredName: 'Insured (Stage 1 & 3) / Carrier Underwriting (Stage 2)',
      company: 'Apex Delivery Service',
      tasks: ['Add new commercial vehicle', 'VIN, year, make, model', 'Bill of sale / purchase document']
    },
    aiObjective: 'Roleplay Insured adding vehicle, switch to Carrier requiring purchase doc, then switch back to Insured agreeing to send bill of sale.',
    expectedBehaviours: [
      'Inquire for vehicle year, make, model, VIN, purchase date',
      'Receive VIN and confirm submission to carrier',
      'Inquire from carrier what is required (purchase document)',
      'Follow up politely with insured explaining carrier requirement'
    ],
    initialOpeningLine: "[Insured] I need to add a new vehicle to my policy.",
    rulesTested: ['Cross-party coordination', 'Explanation of carrier requirements to customer', 'Closing loops'],
    stages: [
      { stageName: 'Stage 1 — Insured Request', character: 'insured', instructions: 'Insured wants to add a new vehicle and provides VIN.' },
      { stageName: 'Stage 2 — Carrier Response', character: 'carrier', instructions: 'Carrier acknowledges vehicle addition but requires purchase document copy.' },
      { stageName: 'Stage 3 — Insured Follow-up', character: 'insured', instructions: 'VA follows up with insured requesting purchase document.' }
    ],
    referenceDialogue: [
      { speaker: 'ai', text: "[Insured] I need to add a new vehicle to my policy." },
      { speaker: 'user', text: "Sure. I'll help you with the information required." },
      { speaker: 'ai', text: "What do you need?" },
      { speaker: 'user', text: "I'll need the vehicle's year, make, model, VIN, purchase date, and any other information required for the policy change." },
      { speaker: 'ai', text: "I have the VIN here." },
      { speaker: 'user', text: "Perfect. Please provide it to me." },
      { speaker: 'ai', text: "[Carrier] We received the vehicle addition request." },
      { speaker: 'user', text: "Great. Is anything else required?" },
      { speaker: 'ai', text: "We need a copy of the purchase document." },
      { speaker: 'user', text: "Understood. I'll obtain that from the insured." },
      { speaker: 'ai', text: "Once we receive it, we can process the request." },
      { speaker: 'user', text: "Got it. I'll send the document as soon as I receive it." },
      { speaker: 'ai', text: "[Insured] Hello, following up on your message?" },
      { speaker: 'user', text: "Hi, I'm following up regarding the vehicle addition request. The carrier needs a copy of the purchase document before they can process the change." },
      { speaker: 'ai', text: "Okay. I'll send it." },
      { speaker: 'user', text: "Thank you. Once we receive it, we'll submit it to the carrier and keep you updated." }
    ]
  },

  // ==========================================
  // 12. FEEDBACK — TASK QUALITY
  // ==========================================
  {
    id: 'scenario_12_feedback_quality',
    category: 'feedback',
    categoryTitle: '12. Feedback Calls',
    scenarioCode: 'Scenario 12',
    title: 'Feedback: Documentation Quality & Follow-Up Precision',
    character: 'poc',
    characterTitle: 'POC (Quality Assurance Manager)',
    tone: 'normal',
    callType: 'feedback',
    objective: 'Upgrade documentation standard: replace generic notes like "waiting for client" with: Date, Contact Person, Exact Document/Info, and Next Scheduled Action.',
    scenarioData: {
      clientName: 'Karen Vance (QA Lead)',
      issueDetails: 'Documentation is accurate overall, but follow-up notes are too brief (e.g. writing "waiting for client" instead of specific details).'
    },
    aiObjective: 'Praise accurate documentation, then coach on follow-up record format: date of follow-up, who contacted, exact document waiting for, next action date.',
    expectedBehaviours: [
      'Inquire specifically what to include in documentation',
      'Synthesize the 4 key elements (date, contact, specific item, next date)',
      'Commit to adopt the new standard across AMS notes'
    ],
    initialOpeningLine: "I reviewed the work you completed this week.",
    rulesTested: ['AMS/CRM documentation precision', 'Feedback adoption', 'Operational clarity'],
    referenceDialogue: [
      { speaker: 'ai', text: "I reviewed the work you completed this week." },
      { speaker: 'user', text: "Sure." },
      { speaker: 'ai', text: "Your documentation is accurate, but I'd like you to improve the way you record follow-ups." },
      { speaker: 'user', text: "What would you like me to include?" },
      { speaker: 'ai', text: "Include the date of the follow-up, who you contacted, what information you're waiting for, and the next action." },
      { speaker: 'user', text: "Understood." },
      { speaker: 'ai', text: "For example, instead of writing 'waiting for client,' write exactly what we're waiting for." },
      { speaker: 'user', text: "Got it. So I should mention the specific document or information, the date I followed up, and the next follow-up date." },
      { speaker: 'ai', text: "Exactly." },
      { speaker: 'user', text: "I'll follow that format going forward." }
    ]
  },

  // ==========================================
  // 13. FEEDBACK — POSITIVE + DEVELOPMENTAL
  // ==========================================
  {
    id: 'scenario_13_feedback_concise',
    category: 'feedback',
    categoryTitle: '13. Feedback Calls',
    scenarioCode: 'Scenario 13',
    title: 'Feedback: Positive & Developmental (Conciseness in Status Updates)',
    character: 'client',
    characterTitle: 'Client (Agency Managing Director)',
    tone: 'normal',
    callType: 'feedback',
    objective: 'Balance praise with developmental coaching: trainee is praised for client communication and confirming requirements, but needs to keep status updates concise.',
    scenarioData: {
      clientName: 'Jonathan Sterling',
      issueDetails: 'Communication with clients is strong and requirements are confirmed well, but verbal status updates are overly long and need a tighter 3-part structure.'
    },
    aiObjective: 'Commend improved client communication, confirm requirements habit, and advise keeping status updates tighter: task status, reason for delay, next action.',
    expectedBehaviours: [
      'Accept positive feedback with gracious appreciation',
      'Listen receptively to conciseness recommendation',
      'Summarize 3-point framework (status, reason for delay, next action)',
      'Commit to clear, concise future updates'
    ],
    initialOpeningLine: "I wanted to give you some feedback.",
    rulesTested: ['Conciseness', 'Active listening', 'Structure: Status → Reason → Next Action'],
    referenceDialogue: [
      { speaker: 'ai', text: "I wanted to give you some feedback." },
      { speaker: 'user', text: "Sure." },
      { speaker: 'ai', text: "Your client communication has improved significantly." },
      { speaker: 'user', text: "Thank you." },
      { speaker: 'ai', text: "You're also doing a good job confirming requirements before starting tasks." },
      { speaker: 'user', text: "I'm glad to hear that." },
      { speaker: 'ai', text: "One area I'd like you to work on is being more concise during status updates." },
      { speaker: 'user', text: "Understood." },
      { speaker: 'ai', text: "Sometimes the update is longer than necessary." },
      { speaker: 'user', text: "That's helpful feedback. I'll structure my updates around the task status, reason for any delay, and next action." },
      { speaker: 'ai', text: "Exactly." },
      { speaker: 'user', text: "I'll work on keeping my updates clear and concise." }
    ]
  }
];
