import type { ComponentProps } from "react";

import { CalendarDays, ClipboardList, FileBadge, Users } from "lucide-react";

import { cn } from "@getolv/ui/lib/utils";

import { AssistantMock, PatientRecordMock } from "../product-mock";
import { Screenshot } from "../screenshot";

const smallFeatures = [
	{
		icon: ClipboardList,
		title: "Plans drafted, not decided",
		description:
			"Treatment and workout plans drafted from what actually happened in session — sets, reps, progressions and all — ready for your sign-off.",
	},
	{
		icon: FileBadge,
		title: "Your brand on every export",
		description: "Send plans and summaries as polished PDFs that carry your practice's identity, not ours.",
	},
	{
		icon: CalendarDays,
		title: "Mail and calendar, in context",
		description: "Gmail threads and Google Calendar events linked to the patient they belong to.",
	},
	{
		icon: Users,
		title: "Grows into a team",
		description:
			"Organizations, roles, and invitations when you're ready to hire — with two-factor authentication for everyone.",
	},
];

export const Features = ({ className, ...props }: ComponentProps<"section">) => {
	return (
		<section
			id='features'
			className={cn(
				"py-16 mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10 flex flex-col gap-10 sm:gap-16",
				className
			)}
			{...props}
		>
			<div className='flex max-w-2xl flex-col gap-6'>
				<div className='flex flex-col gap-2'>
					<div className='text-sm font-semibold text-olive-700'>The workspace</div>
					<h2 className='font-display text-3xl tracking-tight text-pretty text-olive-950 sm:text-5xl'>
						A scribe gives you a note. getolv gives you the whole patient.
					</h2>
				</div>
				<div className='text-base text-olive-700 text-pretty'>
					<p>
						Every capability attaches to the patient record — so the context from this visit is already
						there for the next one.
					</p>
				</div>
			</div>

			<div className='flex flex-col gap-2'>
				<div className='grid grid-cols-1 gap-2 lg:grid-cols-2'>
					<div className='rounded-lg bg-olive-950/2.5 p-2'>
						<div className='relative overflow-hidden rounded-sm'>
							<Screenshot wallpaper='green' placement='bottom-end'>
								<PatientRecordMock />
							</Screenshot>
						</div>
						<div className='flex flex-col gap-4 p-6 sm:p-10 lg:p-6'>
							<div>
								<h3 className='text-base font-medium text-olive-950'>
									The patient record is the workspace
								</h3>
								<div className='mt-2 flex flex-col gap-4 text-sm text-olive-700'>
									<p>
										Sessions, labs, notes, plans, and email threads live on one longitudinal record.
										Walk into every visit knowing the whole story — even six months later.
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className='rounded-lg bg-olive-950/2.5 p-2'>
						<div className='relative overflow-hidden rounded-sm'>
							<Screenshot wallpaper='brown' placement='bottom-start'>
								<AssistantMock />
							</Screenshot>
						</div>
						<div className='flex flex-col gap-4 p-6 sm:p-10 lg:p-6'>
							<div>
								<h3 className='text-base font-medium text-olive-950'>
									An assistant that knows your practice
								</h3>
								<div className='mt-2 flex flex-col gap-4 text-sm text-olive-700'>
									<p>
										Ask about a patient, a lab trend, or your week. The assistant answers only from
										your own records — it can look up sessions, labs, and mail, and prepare email
										drafts, but nothing sends without your approval.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4'>
					{smallFeatures.map((feature) => (
						<div key={feature.title} className='flex flex-col gap-4 rounded-lg bg-olive-950/2.5 p-6'>
							<feature.icon className='size-5 text-olive-950' strokeWidth={1.5} />
							<div>
								<h3 className='text-base font-medium text-olive-950'>{feature.title}</h3>
								<p className='mt-2 text-sm text-olive-700'>{feature.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
