import type { ComponentProps } from "react";

import type { Route } from "next";
import Link from "next/link";

import { ArrowRight, ChevronRight } from "lucide-react";

import { Button } from "@getolv/ui/components/button";
import { cn } from "@getolv/ui/lib/utils";

import { SessionMock } from "../product-mock";
import { Screenshot } from "../screenshot";

const trustPoints = ["No credit card", "You approve every note", "Audio deleted after processing"];

const disciplines = [
	"Naturopathy",
	"Functional medicine",
	"Physiotherapy",
	"Nutrition & dietetics",
	"Psychotherapy",
	"Personal training",
];

export const Hero = ({ className, ...props }: ComponentProps<"section">) => {
	return (
		<section
			id='hero'
			className={cn(
				"py-16 mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10 flex flex-col gap-16",
				className
			)}
			{...props}
		>
			<div className='flex flex-col gap-20'>
				<div className='flex flex-col items-start gap-6'>
					<Link
						href={"#features" as Route}
						className='group inline-flex max-w-full items-center gap-x-3 overflow-hidden rounded-full bg-olive-950/5 px-3 py-0.5 text-sm text-olive-950 hover:bg-olive-950/10'
					>
						<span className='truncate'>More than an AI scribe</span>
						<span className='h-3 w-px bg-olive-950/20' />
						<span className='inline-flex shrink-0 items-center gap-2 font-semibold'>
							See why <ChevronRight className='size-3' strokeWidth={1.5} />
						</span>
					</Link>
					<h1 className='font-display text-5xl tracking-tight text-balance sm:text-7xl text-olive-950 max-w-5xl'>
						Scribe the visit. Keep the whole patient.
					</h1>
					<div className='text-lg text-olive-700 flex max-w-3xl flex-col gap-4'>
						<p>
							getolv captures the conversation, surfaces what matters as you talk, and carries the
							follow-through — notes, plans, emails — so independent health and wellness practitioners can
							give every patient their full attention.
						</p>
					</div>
					<div className='flex items-center gap-4'>
						<Button size='lg' asChild>
							<Link href={"/login" as Route}>Start for free</Link>
						</Button>

						<Button variant='ghost' size='lg' asChild>
							<Link href={"#how-it-works" as Route}>
								See how it works <ArrowRight className='size-4' strokeWidth={1.5} />
							</Link>
						</Button>
					</div>
					<ul className='flex flex-wrap gap-x-4 gap-y-1 text-xs text-olive-500'>
						{trustPoints.map((point, index) => (
							<li key={point} className='flex items-center gap-4'>
								{index > 0 && <span className='size-0.5 rounded-full bg-olive-950/25' />}
								{point}
							</li>
						))}
					</ul>
				</div>

				<div className='flex flex-col gap-3'>
					<Screenshot className='rounded-lg' wallpaper='green' placement='bottom'>
						<div className='overflow-hidden'>
							<SessionMock />
						</div>
					</Screenshot>
					<p className='text-center text-xs text-olive-400'>
						Illustrative session — you review and approve every note.
					</p>
				</div>
			</div>

			<div className='flex flex-col items-center gap-6'>
				<p className='text-sm text-olive-500'>Built for the way you practice</p>
				<ul className='flex flex-wrap items-center justify-center gap-x-8 gap-y-3'>
					{disciplines.map((discipline) => (
						<li key={discipline} className='font-display text-lg tracking-tight text-olive-700 sm:text-xl'>
							{discipline}
						</li>
					))}
				</ul>
			</div>
		</section>
	);
};
