import type { ComponentProps } from "react";

import type { Route } from "next";
import Link from "next/link";

import { Button } from "@getolv/ui/components/button";
import { cn } from "@getolv/ui/lib/utils";

export const CTA = ({ className, ...props }: ComponentProps<"section">) => {
	return (
		<section
			id='call-to-action'
			className={cn(
				"py-16 mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10 flex flex-col items-start gap-10",
				className
			)}
			{...props}
		>
			<h2 className='font-display text-3xl tracking-tight text-pretty text-olive-950 sm:text-5xl'>
				Your next consult can be the first one getolv scribes.
			</h2>
			<div className='text-base text-olive-700 text-pretty max-w-2xl'>
				<p>
					Start with one visit. getolv holds the rest — the note, the plan, the follow-up, and the whole
					patient story.
				</p>
			</div>
			<Button size='lg' asChild>
				<Link href={"/login" as Route}>Start free — no card needed</Link>
			</Button>
		</section>
	);
};
