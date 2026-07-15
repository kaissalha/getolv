import type { ComponentProps } from "react";

import type { Route } from "next";
import Link from "next/link";

import { Check } from "lucide-react";

import { Button } from "@getolv/ui/components/button";
import { cn } from "@getolv/ui/lib/utils";

const plans = [
	{
		name: "Starter",
		price: "$49",
		period: "/practitioner/mo",
		subheadline: "Everything one practitioner needs to run the visit end to end.",
		features: [
			"Live scribe & session intelligence",
			"Patient records, notes & lab analysis",
			"Treatment & workout plans with your sign-off",
			"Branded PDF exports",
			"Workspace assistant",
			"Gmail & Google Calendar, linked to patients",
			"Daily briefing",
		],
		highlighted: false,
	},
	{
		name: "Pro",
		price: "$99",
		period: "/practitioner/mo",
		subheadline: "For practices that run the whole operation on getolv.",
		badge: "Full workspace",
		features: [
			"Everything in Starter",
			"Team members, roles & invitations",
			"Organization knowledge base for grounded answers",
			"Direct support from the team that builds getolv",
		],
		highlighted: true,
	},
];

export const Pricing = ({ className, ...props }: ComponentProps<"section">) => {
	return (
		<section
			id='pricing'
			className={cn(
				"py-16 mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10 flex flex-col gap-16",
				className
			)}
			{...props}
		>
			<div className='flex max-w-2xl flex-col gap-6'>
				<h2 className='font-display text-3xl tracking-tight text-pretty text-olive-950 sm:text-5xl text-start'>
					Simple pricing for independent practices.
				</h2>
				<div className='text-base text-olive-700 text-pretty'>
					<p>
						Create your account free and explore the workspace — no credit card. Billing starts only when
						you pick a plan.
					</p>
				</div>
			</div>
			<div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
				{plans.map((plan) => (
					<div
						key={plan.name}
						className='flex flex-col justify-between gap-6 rounded-xl bg-olive-950/2.5 p-6 sm:items-start'
					>
						<div className='self-stretch'>
							<div className='flex items-center justify-between'>
								{plan.badge && (
									<div className='order-last inline-flex rounded-full bg-olive-950/10 px-2 text-xs font-medium text-olive-950'>
										{plan.badge}
									</div>
								)}
								<h3 className='text-2xl tracking-tight text-olive-950'>{plan.name}</h3>
							</div>
							<p className='mt-1 inline-flex gap-1 text-base'>
								<span className='text-olive-950'>{plan.price}</span>
								{plan.period && <span className='text-olive-500'>{plan.period}</span>}
							</p>
							<div className='mt-4 flex flex-col gap-4 text-sm text-olive-700'>
								<p>{plan.subheadline}</p>
							</div>
							<ul className='mt-4 space-y-2 text-sm text-olive-700'>
								{plan.features.map((feature) => (
									<li key={feature} className='flex gap-4'>
										<Check className='h-lh shrink-0 size-3.5 stroke-olive-950' strokeWidth={1.5} />
										<p>{feature}</p>
									</li>
								))}
							</ul>
						</div>
						<Button variant={plan.highlighted ? "default" : "outline"} size='lg' asChild>
							<Link href={"/login" as Route}>Start for free</Link>
						</Button>
					</div>
				))}
			</div>
		</section>
	);
};
