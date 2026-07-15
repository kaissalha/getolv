import type { ComponentProps } from "react";

import { cn } from "@getolv/ui/lib/utils";

const steps = [
	{
		number: "01",
		title: "Prepare in minutes, not tabs",
		description:
			"Open one patient overview — history, last visit's summary, labs, plans, and recent messages. A daily briefing rounds up your calendar and inbox before the day starts.",
	},
	{
		number: "02",
		title: "Consult with a scribe in the room",
		description:
			"Hit Start Scribe. A speaker-aware transcript captures the conversation while live intelligence quietly surfaces a working summary, things worth a second look, and the follow-up questions worth asking — prompts for your judgment, not decisions made for you.",
	},
	{
		number: "03",
		title: "Follow through without the evening shift",
		description:
			"End the session and the drafts are waiting: a finalized transcript, a refreshed patient summary, an updated plan, and branded PDFs. You review, approve, and send.",
	},
];

export const HowItWorks = ({ className, ...props }: ComponentProps<"section">) => {
	return (
		<section
			id='how-it-works'
			className={cn(
				"py-16 mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10 flex flex-col gap-10 sm:gap-16",
				className
			)}
			{...props}
		>
			<div className='flex max-w-2xl flex-col gap-6'>
				<div className='flex flex-col gap-2'>
					<div className='text-sm font-semibold text-olive-700'>How it works</div>
					<h2 className='font-display text-3xl tracking-tight text-pretty text-olive-950 sm:text-5xl'>
						Before, during, and after the visit.
					</h2>
				</div>
				<div className='text-base text-olive-700 text-pretty'>
					<p>Most tools help with one slice of the visit. getolv is built around the whole arc.</p>
				</div>
			</div>
			<div className='grid grid-cols-1 gap-2 lg:grid-cols-3'>
				{steps.map((step) => (
					<div key={step.number} className='flex flex-col gap-4 rounded-lg bg-olive-950/2.5 p-6 sm:p-8'>
						<div className='font-display text-4xl tracking-tight text-olive-950/25'>{step.number}</div>
						<div>
							<h3 className='text-base font-medium text-olive-950'>{step.title}</h3>
							<p className='mt-2 text-sm text-olive-700'>{step.description}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};
