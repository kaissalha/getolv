"use client";

import type { ComponentProps } from "react";

import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@getolv/ui/components/accordion";
import { cn } from "@getolv/ui/lib/utils";

const faqs = [
	{
		id: "faq-1",
		question: "Is getolv an EHR replacement?",
		answer: "getolv is a practice workspace organized around the patient record: scribing, notes, labs, plans, mail, and scheduling in one place. It works alongside whatever you use today — there's no migration project between you and your first session.",
	},
	{
		id: "faq-2",
		question: "Do my patients need to consent to recording?",
		answer: "Yes. Recording laws vary by region, and asking is good practice everywhere. Most practitioners take ten seconds at the start of a visit: “I use a tool that transcribes our conversation so I can focus on you — the audio is deleted after the note is written. OK?” The audio-deletion promise makes that an easy yes.",
	},
	{
		id: "faq-3",
		question: "What happens to session recordings?",
		answer: "During the visit, audio is transcribed live. When the session ends, the recording is reprocessed once with a speech-to-text model specialized for medical vocabulary to finalize the transcript — then the audio is deleted. The transcript and everything derived from it stay on the patient record.",
	},
	{
		id: "faq-4",
		question: "Does the AI make clinical decisions?",
		answer: "No. It transcribes, summarizes, surfaces things worth a second look, suggests questions, and drafts plans and emails. You review and approve everything, and you remain responsible for every clinical decision.",
	},
	{
		id: "faq-5",
		question: "Who can see my patients' data?",
		answer: "Access is scoped to your practice: every record, document, and AI tool call is bound to your organization, with role-based access and two-factor authentication for your team. Our privacy policy details the providers that process data to deliver the service — like transcription and AI models — and what each one sees.",
	},
	{
		id: "faq-6",
		question: "I'm not a doctor. Is getolv for me?",
		answer: "Yes — getolv is built for health and wellness: naturopaths, physiotherapists, nutritionists, therapists, trainers, and coaches. Records, plans, and language adapt to your discipline, including whether the person across from you is a patient or a client.",
	},
	{
		id: "faq-7",
		question: "What if I leave?",
		answer: "Your records are yours. Plans and summaries export as branded PDFs today, and you can contact us any time to take the rest of your data with you or have it deleted.",
	},
];

export const Faqs = ({ className, ...props }: ComponentProps<"section">) => {
	return (
		<section
			id='faqs'
			className={cn(
				"py-16 mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16",
				className
			)}
			{...props}
		>
			<h2 className='font-display text-3xl tracking-tight text-pretty text-olive-950 sm:text-5xl'>
				Questions &amp; Answers
			</h2>
			<Accordion multiple={false}>
				{faqs.map((faq) => (
					<AccordionItem key={faq.id} value={faq.id} className='border-b border-olive-950/10'>
						<AccordionTrigger className='flex w-full items-center justify-between py-6 text-start text-base font-medium text-olive-950'>
							{faq.question}
						</AccordionTrigger>
						<AccordionPanel className='pb-6 text-sm text-olive-700'>{faq.answer}</AccordionPanel>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
};
