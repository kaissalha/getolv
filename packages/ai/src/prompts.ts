import { z } from "zod";

export const removeImageBackgroundPrompt = "do not change anything, we only want to remove the background";

type CurrentUser = {
	email?: string;
	name?: string;
};

export const dashboardChatSystemPrompt = ({
	currentUser,
}: {
	currentUser?: CurrentUser;
} = {}) => {
	const currentUserName = currentUser?.name?.trim();
	const currentUserEmail = currentUser?.email?.trim();

	return `You are a helpful medical practice assistant. You have access to tools for patients, sessions, notes, labs, workouts, Gmail, and calendar data.

## Available Capabilities

1. **Patient Management**
   - Search and list patients (getPatients)
   - View detailed patient information (getPatient)
   - Create new patients (createPatient)

2. **Session Management**
   - View a patient's consultation sessions (getPatientSessions)
   - Create new consultation sessions (createPatientSession)

3. **Patient Context**
   - View recent patient notes (getPatientNotes)
   - View patient lab reports (getPatientLabReports)
   - View patient workout plans (getPatientWorkoutPlans)
   - View the patient's recent cross-product activity timeline (getPatientActivityFeed)

4. **Communication**
   - Draft editable emails for the user (composeEmail)
   - Search Gmail threads across the connected mailbox (searchMailThreads)
   - View the recent email thread for a patient (getPatientMailThread)

5. **Calendar**
   - View upcoming Google Calendar events (listCalendarEvents)

6. **Knowledge Base**
   - Search organization documents and uploaded knowledge (retrieveKnowledge)

## Guidelines

- Be concise and professional in your responses
- When asked about patients, notes, labs, workouts, Gmail, calendar activity, or organization knowledge, always use the appropriate tools to fetch real data
- Use retrieveKnowledge before answering questions that may depend on indexed organization documents, policies, protocols, guides, or uploaded knowledge
- When retrieveKnowledge returns sources, ground your answer in those sources and cite them with their bracketed citation numbers
- If retrieval returns weak or incomplete matches, say what is missing instead of inventing details
- For patient-specific requests, combine tools when needed. For example: search patients first, then fetch details, sessions, notes, labs, workouts, or mail
- When the user asks you to write, draft, or rewrite an email, use composeEmail instead of pasting the full draft as regular chat text
- For composeEmail, include the recipient email when it is clearly known, and write a complete subject and plain-text body that is ready to edit and send
- When drafting emails, never use placeholders like [Your Name] or {{your_name}} in the body or signature
- Use getPatientActivityFeed when the user wants a recent overview of what has happened with a patient
- Format lists and results clearly using markdown tables when showing multiple items
- When creating patients, confirm all required information (first name, last name, email) is provided
- If a tool returns an error, explain it clearly to the user
- Do not make assumptions about patient data - always use tools to verify

## Response Format

- Use markdown formatting for clarity
- Present patient lists in tables with columns: Name, Email, Phone
- Present session lists in tables with columns: Date, Title, Summary
- Keep responses focused and actionable${
		currentUserName || currentUserEmail
			? `

## Current User
${currentUserName ? `- Name: ${currentUserName}\n` : ""}${currentUserEmail ? `- Email: ${currentUserEmail}\n` : ""}
When drafting emails, use the current user's real name in the sign-off when appropriate. Never use placeholders like [Your Name].`
			: ""
	}
`;
};

export const dashboardChatTitlePrompt = ({ message }: { message: string }) => `
Generate a concise title for this dashboard chat.

## User Message
${message}

## Requirements
- 2 to 6 words
- Clear and descriptive
- No quotation marks
- No trailing punctuation
- Reflect the user's request, not the assistant's response
`;

export const dashboardChatTitleSchema = z.object({
	title: z.string(),
});

export const ragAnswerSystemPrompt = `You are a RAG assistant for organization knowledge.

Use retrieveKnowledge before answering factual questions about indexed documents. Base answers on retrieved chunks, cite sources with bracketed citation numbers, and be clear when the knowledge base does not contain enough information.`;

export const mailSearchRewriteSchema = z.object({
	query: z.string(),
});

export const buildMailSearchRewritePrompt = ({ localDate, search }: { localDate: string; search: string }) =>
	`
You rewrite natural-language mail searches into Gmail search queries.

Current local date: ${localDate}

Rules:
- Return a Gmail query string only.
- Preserve any existing Gmail operators when they are already correct.
- Prefer Gmail operators such as from:, to:, subject:, is:unread, is:read, is:starred, has:attachment, category:, after:, before:, newer_than:, older_than:, and filename:.
- The app also has classification labels named "to respond", "meeting update", "fyi", "notification", and "marketing". Use label: or -label: for those when the user clearly refers to them.
- Keep useful free-text terms when they should remain content search.
- Do not invent custom labels or unsupported Gmail operators.
- If the input is already a good Gmail query, return it unchanged.

Examples:
- unread -> is:unread
- flight not marketing -> flight -label:marketing
- emails from jane last week -> from:jane after:2026-04-14 before:2026-04-21
- starred pdf invoices -> is:starred filename:pdf invoices
- subject quarterly review -> subject:"quarterly review"
- from:bob unread -> from:bob is:unread
- domain renewal -> domain renewal

User search:
${search}
`.trim();

type MailClassificationPromptThread = {
	id: string;
	sender: {
		email: string;
		name?: string;
	};
	snippet: string;
	subject: string;
};

type MailClassificationLabelPromptDefinition = {
	description: string;
	label: string;
};

export const mailThreadClassificationSchema = <Label extends string>({
	labels,
	threadIds,
}: {
	labels: readonly [Label, ...Label[]];
	threadIds: string[];
}) => {
	const validThreadIds = new Set(threadIds);

	return z.object({
		classifications: z
			.array(
				z.object({
					label: z.enum(labels),
					threadId: z.string(),
				})
			)
			.superRefine((classifications, ctx) => {
				const seenThreadIds = new Set<string>();

				classifications.forEach((classification, index) => {
					if (!validThreadIds.has(classification.threadId)) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `Unexpected threadId: ${classification.threadId}`,
							path: [index, "threadId"],
						});
						return;
					}

					if (seenThreadIds.has(classification.threadId)) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `Duplicate classification for threadId: ${classification.threadId}`,
							path: [index, "threadId"],
						});
						return;
					}

					seenThreadIds.add(classification.threadId);
				});

				const missingThreadIds = threadIds.filter((threadId) => !seenThreadIds.has(threadId));

				if (missingThreadIds.length > 0) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Missing classifications for threadIds: ${missingThreadIds.join(", ")}`,
					});
				}
			}),
	});
};

export const buildMailClassificationPrompt = ({
	connectionEmail,
	labelDefinitions,
	threads,
}: {
	connectionEmail: string;
	labelDefinitions: MailClassificationLabelPromptDefinition[];
	threads: MailClassificationPromptThread[];
}) => {
	const threadBlocks = threads
		.map((thread, index) => {
			const sender = thread.sender.name?.trim()
				? `${thread.sender.name.trim()} <${thread.sender.email}>`
				: thread.sender.email;

			return [
				`Thread ${index + 1}`,
				`threadId: ${thread.id}`,
				`from: ${sender}`,
				`subject: ${thread.subject || "(no subject)"}`,
				`snippet: ${thread.snippet || "(empty snippet)"}`,
			].join("\n");
		})
		.join("\n\n");

	const labelGuide = labelDefinitions.map(({ description, label }) => `- ${label}: ${description}`).join("\n");

	return [
		`You classify Gmail threads for ${connectionEmail}.`,
		"Choose exactly one label for each thread and return every threadId exactly once.",
		"Use these rules when labels overlap:",
		"- Prefer marketing for newsletters, promotions, announcements, and sales outreach.",
		"- Prefer meeting update for invites, schedule changes, agendas, calendar logistics, and joining details.",
		"- Prefer notification for automated alerts, receipts, reminders, and transactional system emails.",
		"- Use to respond only when the mailbox owner should personally reply next.",
		"- Use fyi when the thread is informational and no clear action is needed.",
		"",
		"Available labels:",
		labelGuide,
		"",
		"Threads:",
		threadBlocks,
	].join("\n");
};

type LabTestCatalogItem = {
	code: string;
	name: string;
	aliases: string[];
};

export const analyzeLabResultsPrompt = ({
	data,
	country,
	catalog,
}: {
	data: string;
	country: string;
	catalog: LabTestCatalogItem[];
}) => `
Analyze the following lab results and extract structured data.

## Country (for reference ranges)
${country}

## Lab Tests Catalog
Match each lab result to one of these known tests using the name or aliases:
${JSON.stringify(catalog, null, 2)}

## Raw Lab Data
${data}

## Instructions
For each lab result found in the raw data:
1. Extract the test name, value, and unit
2. Match it to a test from the catalog using name/aliases matching
3. Return the matched test code and the extracted value/unit

Return ONLY the lab results that can be matched to the catalog. Skip any tests that cannot be matched.
`;

export const labReportSummaryPrompt = ({ context }: { context: string }) => `
You are a practitioner writing a summary of lab results to present to your patient during their consultation.

## Context
${context}

## Instructions
- Write 4-6 sentences in plain, patient-friendly language.
- Provide an overall picture of the patient's lab results - what looks good and what needs attention.
- Focus on the most important findings and patterns, especially abnormal results.
- Explain medical terms briefly when you use them.
- Be informative and supportive in tone, as you are explaining results directly to your patient.
- Do NOT tell the patient to "see a doctor" or "consult with your doctor" - you ARE the doctor presenting this.
- Avoid internal IDs or clinician-only notes.
- Do not invent details that are not in the context.
- If the context is insufficient, say that a summary could not be generated.

Return only the summary text.
`;

export const naturopathicDoctorSystemPrompt = `
You assist a naturopathic doctor at intake: minimal text, precise, no web lookup.

## Voice
Tiny bullets. Plain language. Say clearly when you are uncertain; never invent facts not in the thread or **analyzeLabResults** output.

## Labs
If labs exist: **analyzeLabResults**; one line of implication per abnormal finding—no raw lab dump.

## Length (hard cap)
- **Two** patient questions max: \`**Label** one line each.\`
- **One** bullet \`**Red flags**\` (or "None from what is known" if appropriate).
- Optional: one short clause for **differentials** only if clearly warranted by the history.
- Entire message under ~120 words; skimmable in ~10 seconds.

## Safety
Not a substitute for in-person or emergency care; say when to escalate.
`;

export const generatedWorkoutPlanExerciseSchema = z.object({
	exerciseName: z.string(),
	sets: z.number().nullable(),
	reps: z.string().nullable(),
	restSeconds: z.number().nullable(),
	notes: z.string().nullable(),
});

export const generatedWorkoutPlanDaySchema = z.object({
	dayNumber: z.number(),
	name: z.string(),
	focus: z.string().nullable(),
	warmUp: z.string().nullable(),
	coolDown: z.string().nullable(),
	exercises: z.array(generatedWorkoutPlanExerciseSchema),
});

export const generatedWorkoutPlanSchema = z.object({
	title: z.string(),
	summary: z.string().nullable(),
	durationWeeks: z.number().nullable(),
	daysPerWeek: z.number().nullable(),
	days: z.array(generatedWorkoutPlanDaySchema),
});

type ExerciseCatalogItem = {
	name: string;
	targetMuscles: string[];
	bodyParts: string[];
	equipments: string[];
};

export const generateWorkoutPlanPrompt = ({
	patientContext,
	goal,
	exerciseCatalog,
}: {
	patientContext: string;
	goal?: string;
	exerciseCatalog: ExerciseCatalogItem[];
}) => `Generate a personalized workout plan for this patient.

## Patient Context
${patientContext}
${goal ? `\n## Goal\n${goal}` : ""}

## Exercise Catalog
Use exercises from this catalog when possible. Use the exact exercise name from the catalog.
${JSON.stringify(exerciseCatalog, null, 2)}

## Instructions
Create a structured workout plan with:
1. A concise, descriptive title
2. A comprehensive summary written as multiple plain paragraphs (no markdown, no bullet points, no headers):
   - Paragraph 1: Overview of the plan — primary goal, overall approach, and why it fits this patient
   - Paragraph 2: Coaching notes — guidance for the practitioner on how to deliver the sessions
   - Paragraph 3: Precautions — any contraindications, injuries, or limitations to keep in mind
   - Paragraph 4: Progression — how to advance the plan over time as the patient improves
3. Duration in weeks and training days per week
4. Individual training days, each with:
   - A name and focus area
   - Warm-up and cool-down instructions
   - Exercises with sets, reps, rest periods, and any notes

Match exercise names exactly to the catalog when possible. If an exercise is not in the catalog, use a descriptive name.
`;

export const editWorkoutPlanPrompt = ({
	patientContext,
	currentPlanJson,
	instructions,
	exerciseCatalog,
}: {
	patientContext: string;
	currentPlanJson: string;
	instructions: string;
	exerciseCatalog: ExerciseCatalogItem[];
}) => `You are revising an existing workout plan for a patient. Output a complete replacement plan (not a patch or diff).

## Patient Context
${patientContext}

## Current Plan (JSON)
${currentPlanJson}

## Practitioner Instructions
${instructions}

## Exercise Catalog
Use exercises from this catalog when possible. Use the exact exercise name from the catalog.
${JSON.stringify(exerciseCatalog, null, 2)}

## Instructions
Produce a full revised workout plan that honors the practitioner instructions while staying appropriate for the patient.
1. Keep unchanged parts only when the instructions do not ask to modify them; otherwise adjust freely.
2. Same output structure as creating a new plan: title, multi-paragraph summary (same rules as plan generation — no markdown in summary), durationWeeks, daysPerWeek, and all training days with warm-up, cool-down, and exercises (sets, reps, rest, notes).
3. Match exercise names exactly to the catalog when possible. If an exercise is not in the catalog, use a descriptive name.
`;

const generatedTreatmentPlanLifestyleRecommendationSchema = z.object({
	description: z.string(),
	title: z.string(),
});

const generatedTreatmentPlanPlateStepSchema = z.object({
	hint: z.string().nullable(),
	items: z.array(z.string()),
	title: z.string(),
});

const generatedTreatmentPlanSupplementSchema = z.object({
	dose: z.string(),
	name: z.string(),
	reason: z.string(),
});

const generatedTreatmentPlanMealPlanDaySchema = z.object({
	breakfast: z.string(),
	dinner: z.string(),
	lunch: z.string(),
	snacks: z.string(),
});

export const generatedTreatmentPlanSchema = z.object({
	dailyHabitLabels: z.array(z.string()),
	dietaryAvoid: z.array(z.string()),
	dietaryInclude: z.array(z.string()),
	lifestyleRecommendations: z.array(generatedTreatmentPlanLifestyleRecommendationSchema),
	longTermGoals: z.string(),
	mealPlan: z.object({
		Fri: generatedTreatmentPlanMealPlanDaySchema,
		Mon: generatedTreatmentPlanMealPlanDaySchema,
		Sat: generatedTreatmentPlanMealPlanDaySchema,
		Sun: generatedTreatmentPlanMealPlanDaySchema,
		Thu: generatedTreatmentPlanMealPlanDaySchema,
		Tue: generatedTreatmentPlanMealPlanDaySchema,
		Wed: generatedTreatmentPlanMealPlanDaySchema,
	}),
	mindfulnessParagraphs: z.array(z.string()),
	movementParagraphs: z.array(z.string()),
	pathologyRecommendations: z.string(),
	pathologyReview: z.string(),
	plateSteps: z.array(generatedTreatmentPlanPlateStepSchema),
	ratingLabels: z.array(z.string()),
	shortTermGoals: z.string(),
	summary: z.string(),
	supplements: z.array(generatedTreatmentPlanSupplementSchema),
	weeklyHabitLabels: z.array(z.string()),
});

export const buildGeneratedTreatmentPlanPrompt = ({
	labSummaryBlock,
	patientProfileBlock,
	priorSessionsBlock,
	recentNotesBlock,
	sessionContextBlock,
	sessionIntelligenceBlock,
}: {
	labSummaryBlock: string;
	patientProfileBlock: string;
	priorSessionsBlock: string;
	recentNotesBlock: string;
	sessionContextBlock: string;
	sessionIntelligenceBlock: string;
}) => `You are generating a structured treatment plan for a naturopathic clinic. The output will populate a pre-designed PDF given to the patient after their consultation.

The plan should feel personalized, grounded in the chart and session, and concise enough to fit comfortably into the document.

## Patient chart
${patientProfileBlock}

## This session
${sessionContextBlock}

## Session intelligence
${sessionIntelligenceBlock}

## Latest pathology context
${labSummaryBlock}

## Prior sessions
${priorSessionsBlock}

## Recent patient notes
${recentNotesBlock}

## Instructions
- Fill every field in the schema with useful patient-ready content.
- Write in plain language, not clinician shorthand.
- Keep each item concise and practical.
- Ground the plan in the provided context.
- Do not invent concrete diagnoses, medication changes, lab values, or specific supplement doses that are not supported by the context.
- If a supplement is reasonable but the exact dose is not supported, use "As directed by practitioner" for the dose.
- If pathology was not meaningfully discussed, say that clearly in a neutral way rather than inventing findings.
- Prefer conservative, food-first, lifestyle-first recommendations when context is limited.
- Create a realistic 7-day meal plan with short meal names, not recipes.
- Daily and weekly habit labels should be short checklist items.
- Rating labels should be short patient-facing outcomes that make sense as _/10 self-ratings.
- Plate steps should describe the four parts of building a balanced plate.

## Desired shape
- summary: 2-4 short paragraphs as plain text
- shortTermGoals: 1 small paragraph of 1-2 sentences, ideally under 180 characters
- longTermGoals: 1 concise paragraph
- pathologyReview: 1 concise paragraph
- pathologyRecommendations: 1 concise paragraph
- lifestyleRecommendations: 4-6 items
- movementParagraphs: 2-3 short paragraphs
- mindfulnessParagraphs: 2-3 short paragraphs
- dietaryInclude: 4-6 concise strings
- dietaryAvoid: 4-6 concise strings
- plateSteps: exactly 4 items, each with 2-4 short food/category strings
- supplements: 2-5 items
- dailyHabitLabels: 6-10 items
- weeklyHabitLabels: 4-6 items
- ratingLabels: 4-6 items

Return only structured data that matches the schema.`;

export const sessionSummaryPrompt = (
	conversationHistory: string
) => `Based on the following conversation history from a naturopathic doctor consultation, generate both a short and comprehensive summary FOR THE PRACTITIONER'S REFERENCE:

${conversationHistory}

Title Requirements:
- A title for the session
- The title should be a single sentence
- The title should be less than 65 characters

Short Summary Requirements (for practitioner quick reference):
- 2 sentences maximum (around 200 characters)
- Focus on key clinical findings, critical lab results, and immediate action items
- Highlight any red flags or urgent concerns requiring attention
- Written for healthcare professional review
- Do not include measurements, just the findings and recommendations

Full Summary Requirements (for comprehensive practitioner notes):
- 4 sentences maximum (around 400 characters)
- Professional clinical summary for practitioner records
- Patient's chief complaints and symptom presentation
- Significant clinical findings and assessment
- Lab results analysis with critical/suboptimal values highlighted
- Treatment recommendations and interventions discussed
- Patient education provided and compliance factors
- Red flags, contraindications, or safety concerns
- Follow-up plan and monitoring requirements
- Format as clinical documentation for healthcare provider review
- Do not include measurements, just the findings and recommendations`;

export const sessionIntelligenceDiagnosisEntrySchema = z.object({
	name: z.string(),
	reasoning: z.string().nullable().optional(),
	evidence: z.string().nullable().optional(),
	missing: z.string().nullable().optional(),
	verifyNext: z.string().nullable().optional(),
});

export const sessionIntelligenceSchema = z.object({
	visitReason: z.string().nullable(),
	riskFlags: z.array(z.string()),
	liveNote: z.string(),
	thingsToAsk: z.array(
		z.object({
			id: z.string(),
			question: z.string(),
			category: z.string().nullable().optional(),
		})
	),
	todos: z.array(
		z.object({
			id: z.string(),
			text: z.string(),
			category: z.string().nullable().optional(),
		})
	),
	workingDx: z.array(sessionIntelligenceDiagnosisEntrySchema),
	differentialDx: z.array(sessionIntelligenceDiagnosisEntrySchema),
	practitionerQaTurns: z.array(
		z.object({
			question: z.string(),
			answer: z.string(),
		})
	),
});

export const sessionIntelligenceWithMetaSchema = sessionIntelligenceSchema.extend({
	sessionTitle: z.string().nullable(),
	sessionSummary: z.string().nullable(),
});

export type SessionIntelligencePayload = z.infer<typeof sessionIntelligenceSchema>;

export const buildSessionIntelligencePrompt = ({
	patientProfileBlock,
	clinicianContextBlock,
	sessionRecordBlock,
	existingIntelligenceBlock,
	transcriptText,
	priorSessionsSummary,
	notesSummary,
	labSummary,
	practitionerFollowUpBlock,
}: {
	patientProfileBlock: string;
	clinicianContextBlock: string;
	sessionRecordBlock: string;
	existingIntelligenceBlock: string;
	transcriptText: string;
	priorSessionsSummary: string;
	notesSummary: string;
	labSummary: string;
	practitionerFollowUpBlock: string;
}) => `You are an AI clinical assistant helping a practitioner during a live patient session. Act like a thoughtful clinical copilot: do not just summarize the conversation. Surface the most useful guidance for the clinician right now, including what to ask next, what might explain the presentation, what could be connected to prior issues, and what to keep on the radar.

## Clinician
${clinicianContextBlock}

## Patient (from chart — allergies, medications, history, demographics)
${patientProfileBlock}

## This session (existing record — use as reference)
${sessionRecordBlock}

## Prior intelligence for this session (last saved — incrementally refine)
${existingIntelligenceBlock}

Treat the prior intelligence as the baseline when new transcript lines arrive: **update and extend** it rather than discarding stable content. Remove or replace items only when the conversation clearly supersedes them. Reuse the same **id** strings for **thingsToAsk** and **todos** when an item stays relevant (light edits OK); mint new ids only for genuinely new items. Prefer minimal churn in **liveNote**: refine the same running guidance note incrementally rather than rewriting from scratch unless the visit clearly pivots.

## Current Conversation Transcript
${transcriptText || "No conversation yet."}

## Prior Session History (other visits for this patient)
${priorSessionsSummary || "No prior sessions."}

## Practitioner Notes
${notesSummary || "No notes available."}

## Recent Lab Summary
${labSummary || "No lab results available."}

## Clinician follow-up (in-app assistant)
${practitionerFollowUpBlock}

## Instructions
Generate a structured intelligence payload based on the transcript, context, and any clinician follow-up above. When **Prior intelligence for this session** exists, merge new evidence into it; the **Clinician follow-up** block is authoritative over duplicate persisted **practitionerQaTurns** if they conflict.

**liveNote** is the most visible field to the clinician. Treat it like a brief real-time copilot message, not a chart summary. Prioritize decision-useful guidance over narration: what seems most likely, what else could be going on, what to ask or check next, and any meaningful links to prior history, labs, comorbidities, or medication issues when relevant. Avoid simply restating what was just said unless it changes clinical reasoning.

Also generate concise session metadata for downstream lists: a short encounter label (**sessionTitle**) and a brief encounter synopsis (**sessionSummary**). These should stay aligned with the evolving visit, not just the latest utterance.

**IMPORTANT — output budget constraints (hard limits):**

1. **visitReason**: One short sentence (max ~120 chars). Null if unclear.
2. **riskFlags**: Max 5 items, each ≤40 chars (e.g. "Suicide risk", "Chest pain"). Empty if none.
3. **liveNote**: A **single** tight assistant-style blurb for the clinician: **2–3 short sentences** (max ~450 chars). Write fluid, conversational prose—like a quick message in a clinical chat—not bullet lists, labels, or section headers. Make it feel like a useful in-room assistant note: lead with the working impression, then the best next question/check, then any meaningful linkage to prior problems or alternative explanations when relevant. Include practitioner Q&A substance when relevant. Do **not** use this field as a passive recap. Use empty string if there is nothing substantive yet.
4. **thingsToAsk**: Max 5 items, each question ≤120 chars. Category optional (history, safety, meds, labs, social). These should be specific, high-yield follow-up questions that would narrow the differential, clarify severity, or change management.
5. **todos**: Max 6 items, each ≤100 chars (order, refer, follow-up, schedule). Category optional.
6. **workingDx**: Max 3 diagnoses. Name ≤80 chars, reasoning ≤150 chars, evidence/missing/verifyNext each ≤120 chars. Prefer hypotheses that best explain the current picture and note links to prior issues when clinically relevant.
7. **differentialDx**: Max 5 diagnoses, same char limits as workingDx. Include plausible related or competing explanations worth keeping in mind.
8. **practitionerQaTurns**: Chronological { question, answer } pairs for every clinician question. Empty array if none. Preserve prior turns on transcript-only refreshes unless an answer must change.
9. **sessionTitle**: Short visit label for session lists (max ~72 chars), e.g. "FU: HTN", "Left knee pain — new". Refine incrementally as the visit clarifies; if **This session** already has a title that still fits, keep or lightly edit it. Null only if the transcript is empty or too vague to name the encounter.
10. **sessionSummary**: Brief session synopsis for timelines/tables: **1-2 concise sentences** (max ~240 chars). Capture the main concern plus the most relevant current impression, trajectory, or next step. Refine incrementally as the visit clarifies; if **This session** already has a summary that still fits, keep or lightly edit it. Null only if the transcript is empty or too vague.

Frame diagnoses as working hypotheses, never definitive. Be proactive, concise, and clinically precise. Prefer shorter text that fits the budget over thorough but verbose text. If the transcript is empty or thin, still leverage **Patient (from chart)**—allergies, medications, past history, demographics, and additional context—to produce useful guidance (risk flags, things to ask, todos) that reflects the record even when the conversation has not yet covered it. Return null/empty values only where truly no substance exists, and preserve **practitionerQaTurns** from prior exchanges when given.`;

export const buildPatientSummaryPrompt = ({
	currentSessionBlock,
	labReportsBlock,
	notesBlock,
	patientProfileBlock,
	priorSessionsBlock,
	workoutPlansBlock,
}: {
	currentSessionBlock: string;
	labReportsBlock: string;
	notesBlock: string;
	patientProfileBlock: string;
	priorSessionsBlock: string;
	workoutPlansBlock: string;
}) => `You are updating the patient overview summary in a clinician dashboard. Write a concise, durable chart snapshot that helps the practitioner quickly reorient before the next visit.

## Patient chart
${patientProfileBlock}

## Newly completed session
${currentSessionBlock}

## Prior completed sessions
${priorSessionsBlock}

## Notes
${notesBlock}

## Lab reports
${labReportsBlock}

## Workout plans
${workoutPlansBlock}

## Instructions
- Write plain text only. No markdown, bullets, headings, or labels.
- Write 4 to 6 concise sentences.
- Keep the summary under 900 characters.
- Base the summary on the full patient chart context provided here, not just the latest session.
- Focus on stable clinical context, recent trajectory, meaningful findings, ongoing plans, and what matters for follow-up.
- Prefer durable takeaways over moment-to-moment narration.
- Mention only information supported by the provided chart, sessions, notes, labs, and plans.
- If some data conflicts, favor the most recent session and chart details.
- If information is sparse, still produce the best concise patient snapshot possible from confirmed details.
`;

export const patientSummaryOutputSchema = z.object({
	summary: z.string().nullable(),
});

export const dailySummaryActionsOutputSchema = z.object({
	actions: z.array(z.string()).max(5),
});

export type DailySummaryPromptInput = {
	calendarBlock: string;
	mailBlock: string;
	notesBlock: string;
	periodLabel: string;
	periodType: "day" | "week";
	sourceCounts: {
		calendar: number;
		mail: number;
		notes: number;
	};
};

const getDailySummaryPeriodCopy = ({ periodType }: { periodType: DailySummaryPromptInput["periodType"] }) => {
	return periodType === "day" ? "today" : "this week";
};

const buildDailySummaryDataBlock = ({
	calendarBlock,
	mailBlock,
	notesBlock,
	periodLabel,
	periodType,
	sourceCounts,
}: DailySummaryPromptInput) => {
	return `period: ${periodLabel}
scope: ${periodType}
counts:
- calendar events: ${sourceCounts.calendar}
- mail threads: ${sourceCounts.mail}
- notes: ${sourceCounts.notes}

calendar:
${calendarBlock}

mail:
${mailBlock}

notes:
${notesBlock}`;
};

export const buildDailySummaryTitlePrompt = (input: DailySummaryPromptInput) => {
	const periodCopy = getDailySummaryPeriodCopy({ periodType: input.periodType });

	return `<role>
You write the headline for a medical practice daily summary widget.
This is the first thing the practitioner sees, so it should feel like a helpful colleague giving a quick briefing.
</role>

<data>
${buildDailySummaryDataBlock(input)}
</data>

<constraints>
- Word count: 8-18 words.
- Start with context, not a count.
- Mention the most important theme across calendar, mail, and notes.
- Use "your" when natural.
- If the day had no activity and this is weekly fallback data, make clear this is a week view without apologizing.
- Never use prefixes like "Daily Summary:" or "Weekly Summary:".
</constraints>

<examples>
<day>Busy patient day with follow-ups, inbox replies, and notes to close</day>
<week>Quiet today, but your week shows follow-ups and inbox work stacking up</week>
<empty>No calendar, mail, or note activity found ${periodCopy}</empty>
</examples>

<output>
Write one headline only. No preamble. No quotation marks.
</output>`;
};

export const buildDailySummarySummaryPrompt = (input: DailySummaryPromptInput) => {
	const periodCopy = getDailySummaryPeriodCopy({ periodType: input.periodType });

	return `<role>
You write the main paragraph for a medical practice daily summary.
Sound like a knowledgeable colleague giving a verbal debrief, not a report generator.
</role>

<data>
${buildDailySummaryDataBlock(input)}
</data>

<constraints>
- Word count: exactly 40-70 words.
- Use flowing prose, not bullets.
- Cover calendar, mail, and notes when data exists.
- Prioritize patient-facing obligations, scheduling risks, unanswered mail, and notes that need follow-up.
- If one source has no data, say that naturally only when it matters.
- If this is weekly fallback data, explain that today was quiet and summarize the week.
- Do not invent patient names, clinical details, times, or email content.
- Do not include medical advice. Summarize workflow context only.
- Never say "this period"; say "${periodCopy}" or use the period label.
</constraints>

<accuracy>
- Use only facts present in the data.
- Keep source details consistent: calendar events are scheduled work, mail threads are inbox context, notes are written practice notes.
- Do not imply an email needs a reply unless the snippet, unread state, or label supports it.
</accuracy>

<examples>
<day>Today is centered on two patient appointments, with one unread lab-related email and a note update that should be reviewed before the afternoon visit. Your calendar looks manageable, but the inbox has the clearest follow-up signal, so checking that thread before sessions will keep the day from drifting.</day>
<week>Nothing is showing for today, so this week is the better view: three calendar events, two inbox threads, and recent notes point to follow-up work around patient scheduling and documentation. The main risk is letting the mail and note context stay disconnected before the next appointment.</week>
</examples>

<output>
Write one summary paragraph only. No preamble, no labels, no markdown.
</output>`;
};

export const buildDailySummaryStoryPrompt = (input: DailySummaryPromptInput) => {
	return `<role>
You write the small forward-looking line beneath a practice summary.
It should feel like a useful nudge, not a slogan.
</role>

<data>
${buildDailySummaryDataBlock(input)}
</data>

<constraints>
- Maximum 16 words.
- Be specific to the data.
- Focus on what deserves attention next.
- No punctuation flourish, no quotation marks.
</constraints>

<output>
Write one short line only.
</output>`;
};

export const buildDailySummaryActionsPrompt = (input: DailySummaryPromptInput) => {
	return `<role>
You suggest practical next actions for a practitioner reviewing calendar, mail, and notes.
</role>

<data>
${buildDailySummaryDataBlock(input)}
</data>

<rules>
- Return 1-4 actions.
- Keep each action under 90 characters.
- Actions must be grounded in calendar, mail, or notes data.
- Prefer exact patient/event/email/note context when it is provided.
- Do not invent names, diagnoses, or commitments.
- If no data exists, return one action suggesting connecting sources or adding notes.
</rules>

<format>
Examples:
- Review the unread lab thread before the afternoon appointment
- Close the note from the morning follow-up
- Check this week's mail before tomorrow's patient block
</format>

<output>
Return structured actions only.
</output>`;
};
