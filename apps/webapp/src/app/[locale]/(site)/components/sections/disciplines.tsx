import type { ComponentProps } from "react";

import { cn } from "@getolv/ui/lib/utils";

const disciplines = [
	{
		name: "Naturopathy",
		scenario: "Connect this visit's fatigue complaint to January's ferritin panel without leaving the session.",
	},
	{
		name: "Functional medicine",
		scenario: "Long intakes become structured timelines: history, labs, and protocols on one record.",
	},
	{
		name: "Physiotherapy",
		scenario:
			"Turn today's assessment into a progressive rehab plan — reviewed, approved, and out the door as a branded PDF before your patient reaches the parking lot.",
	},
	{
		name: "Nutrition & dietetics",
		scenario: "Consult conversations become plans and follow-ups your clients actually receive.",
	},
	{
		name: "Psychotherapy & counselling",
		scenario:
			"Stay present in session while gentle prompts — things to ask, items to follow up — surface quietly beside the transcript.",
	},
	{
		name: "Personal training & coaching",
		scenario:
			"Programs with sets, reps, and progressions — drafted from the conversation, not an evening of admin.",
	},
];

export const Disciplines = ({ className, ...props }: ComponentProps<"section">) => {
	return (
		<section
			id='disciplines'
			className={cn(
				"py-16 mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10 flex flex-col gap-10 sm:gap-16",
				className
			)}
			{...props}
		>
			<div className='flex max-w-2xl flex-col gap-6'>
				<div className='flex flex-col gap-2'>
					<h2 className='font-display text-3xl tracking-tight text-pretty text-olive-950 sm:text-5xl'>
						Built for how you practice.
					</h2>
				</div>
				<div className='text-base text-olive-700 text-pretty'>
					<p>
						Medical or wellness, hands-on or conversational — getolv adapts to the shape of your discipline,
						including whether the person across from you is a patient or a client.
					</p>
				</div>
			</div>
			<div className='grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3'>
				{disciplines.map((discipline) => (
					<div
						key={discipline.name}
						className='flex flex-col gap-3 rounded-md bg-olive-950/2.5 p-6 text-sm text-olive-950'
					>
						<h3 className='font-display text-xl tracking-tight text-olive-950'>{discipline.name}</h3>
						<p className='text-olive-700'>{discipline.scenario}</p>
					</div>
				))}
			</div>
		</section>
	);
};
