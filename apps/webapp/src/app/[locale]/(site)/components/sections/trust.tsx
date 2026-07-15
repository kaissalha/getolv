import type { ComponentProps } from "react";

import { Badge } from "@getolv/ui/components/badge";
import { cn } from "@getolv/ui/lib/utils";

const principles = [
	{
		title: "You stay in charge",
		description:
			"The AI transcribes, summarizes, and drafts. You review, edit, and approve — every note, plan, and email.",
	},
	{
		title: "Audio doesn't linger",
		description: "Recordings are transient: once the final transcript is processed, the session audio is deleted.",
	},
	{
		title: "Scoped to your practice",
		description:
			"Every record, document, and AI tool call is bound to your organization — from the database to the assistant.",
	},
	{
		title: "Security comes standard",
		description:
			"Two-factor authentication, role-based access, and managed Google OAuth — built in, not bolted on.",
	},
];

export const Trust = ({ className, ...props }: ComponentProps<"section">) => {
	return (
		<section id='trust' className={cn("py-16", className)} {...props}>
			<div className='mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10 flex flex-col gap-16'>
				<div className='flex max-w-2xl flex-col gap-6'>
					<Badge>Trust &amp; control</Badge>
					<h2 className='font-display text-3xl tracking-tight text-pretty text-olive-950 sm:text-5xl'>
						Built like patient data matters.
					</h2>
					<div className='text-base text-olive-700 text-pretty'>
						<p>
							AI in a consult room has to earn its seat. getolv is deliberate about what it keeps, what it
							deletes, and who decides.
						</p>
					</div>
				</div>
				<div className='grid grid-cols-1 gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-4'>
					{principles.map((principle) => (
						<div key={principle.title} className='border-s border-olive-950/20 ps-6'>
							<div className='text-xl tracking-tight text-olive-950'>{principle.title}</div>
							<p className='mt-2 text-sm text-olive-700'>{principle.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
