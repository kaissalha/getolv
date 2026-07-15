import type { ComponentProps } from "react";

import { Check, Mic, Sparkles } from "lucide-react";

import { cn } from "@getolv/ui/lib/utils";

const transcriptTurns = [
	{
		speaker: "Practitioner",
		text: "How has your energy been since we increased the iron dose?",
	},
	{
		speaker: "Patient",
		text: "Mornings are much better, but I still crash around three — especially on clinic days.",
	},
	{
		speaker: "Practitioner",
		text: "Any changes in sleep, or is it still holding at about seven hours?",
	},
	{
		speaker: "Patient",
		text: "Sleep's fine. I did stop the magnesium two weeks ago, though.",
	},
];

const thingsToAsk = ["Why did she stop the magnesium?", "Caffeine intake on clinic days?"];

const todos = [
	{ text: "Order repeat ferritin + CBC", done: true },
	{ text: "Update plan — iron protocol", done: false },
];

const PanelTitle = ({ className, ...props }: ComponentProps<"p">) => (
	<p
		className={cn("text-[10px] font-semibold tracking-wide text-olive-500 uppercase sm:text-xs", className)}
		{...props}
	/>
);

/**
 * Hand-built mock of the live session view (transcript + session intelligence),
 * mirroring the real dashboard labels so the hero shows the actual product.
 */
export const SessionMock = ({ className, ...props }: ComponentProps<"div">) => {
	return (
		<div className={cn("bg-olive-50 text-left text-sm text-olive-950", className)} {...props}>
			{/* Window chrome */}
			<div className='flex items-center gap-3 border-b border-olive-950/10 bg-white/60 px-4 py-2.5'>
				<div className='flex gap-1.5'>
					<span className='size-2.5 rounded-full bg-olive-950/15' />
					<span className='size-2.5 rounded-full bg-olive-950/15' />
					<span className='size-2.5 rounded-full bg-olive-950/15' />
				</div>
				<p className='truncate text-xs font-medium text-olive-700 sm:text-sm'>Session — Maya Okafor</p>
				<div className='ms-auto flex items-center gap-2'>
					<span className='inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-700 sm:text-xs'>
						<span className='relative flex size-1.5'>
							<span className='absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-60 motion-reduce:animate-none' />
							<span className='relative inline-flex size-1.5 rounded-full bg-red-500' />
						</span>
						Active session
					</span>
					<span className='hidden text-xs tabular-nums text-olive-500 sm:inline'>12:47</span>
				</div>
			</div>

			<div className='grid grid-cols-1 gap-px bg-olive-950/10 md:grid-cols-[3fr_2fr]'>
				{/* Live transcript */}
				<div className='flex flex-col gap-4 bg-olive-50 p-4 sm:p-5'>
					<div className='flex items-center justify-between'>
						<PanelTitle>Live Transcript</PanelTitle>
						<span className='inline-flex items-center gap-1.5 text-[10px] text-olive-500 sm:text-xs'>
							<Mic className='size-3' strokeWidth={1.5} />
							Listening...
						</span>
					</div>
					<div className='flex flex-col gap-3'>
						{transcriptTurns.map((turn) => (
							<div key={turn.text} className='flex flex-col gap-0.5'>
								<p
									className={cn(
										"text-[10px] font-semibold sm:text-xs",
										turn.speaker === "Practitioner" ? "text-olive-950" : "text-olive-500"
									)}
								>
									{turn.speaker}
								</p>
								<p className='text-xs leading-relaxed text-olive-700 sm:text-sm'>{turn.text}</p>
							</div>
						))}
						<p className='text-xs text-olive-400 italic sm:text-sm'>Transcribing...</p>
					</div>
				</div>

				{/* Session intelligence */}
				<div className='flex flex-col gap-4 bg-white/70 p-4 sm:p-5'>
					<div className='flex items-center justify-between'>
						<PanelTitle>Live intelligence</PanelTitle>
						<Sparkles className='size-3 text-olive-400' strokeWidth={1.5} />
					</div>

					<div className='flex flex-col gap-1'>
						<PanelTitle className='text-olive-400'>Visit reason</PanelTitle>
						<p className='text-xs text-olive-700 sm:text-sm'>Persistent fatigue — 3 month follow-up</p>
					</div>

					<div className='flex flex-col gap-1.5'>
						<PanelTitle className='text-olive-400'>Flags</PanelTitle>
						<div className='flex flex-wrap gap-1.5'>
							<span className='rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-800 sm:text-xs'>
								Ferritin recheck due
							</span>
							<span className='rounded-full bg-olive-950/5 px-2 py-0.5 text-[10px] font-medium text-olive-700 sm:text-xs'>
								Supplement change
							</span>
						</div>
					</div>

					<div className='flex flex-col gap-1 rounded-md bg-olive-950/4 p-3'>
						<p className='text-xs leading-relaxed text-olive-700 sm:text-sm'>
							Energy improving on the higher iron dose, but afternoon crashes persist. Magnesium was
							stopped two weeks ago — worth asking why before adjusting. Ferritin was 18 µg/L in March; a
							recheck would confirm the trend.
						</p>
						<p className='text-[10px] text-olive-400 sm:text-xs'>Updated just now</p>
					</div>

					<div className='flex flex-col gap-1.5'>
						<PanelTitle className='text-olive-400'>Things to ask</PanelTitle>
						<ul className='flex flex-col gap-1'>
							{thingsToAsk.map((question) => (
								<li key={question} className='text-xs text-olive-700 sm:text-sm'>
									{question}
								</li>
							))}
						</ul>
					</div>

					<div className='flex flex-col gap-1.5'>
						<PanelTitle className='text-olive-400'>Todos</PanelTitle>
						<ul className='flex flex-col gap-1.5'>
							{todos.map((todo) => (
								<li key={todo.text} className='flex items-center gap-2'>
									<span
										className={cn(
											"flex size-3.5 shrink-0 items-center justify-center rounded-xs border",
											todo.done ? "border-olive-950 bg-olive-950" : "border-olive-950/30"
										)}
									>
										{todo.done && <Check className='size-2.5 stroke-white' strokeWidth={3} />}
									</span>
									<p
										className={cn(
											"text-xs sm:text-sm",
											todo.done ? "text-olive-400 line-through" : "text-olive-700"
										)}
									>
										{todo.text}
									</p>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

/**
 * Mock of a patient overview — the longitudinal record that organizes the workspace.
 */
export const PatientRecordMock = ({ className, ...props }: ComponentProps<"div">) => {
	return (
		<div className={cn("bg-olive-50 p-4 text-left text-sm text-olive-950 sm:p-5", className)} {...props}>
			<div className='flex items-center gap-3'>
				<span className='flex size-10 items-center justify-center rounded-full bg-olive-950/10 text-xs font-semibold text-olive-700'>
					MO
				</span>
				<div>
					<p className='font-medium'>Maya Okafor</p>
					<p className='text-xs text-olive-500'>34 · she/her · Patient since Nov 2025</p>
				</div>
			</div>

			<div className='mt-4 flex flex-wrap gap-1.5'>
				{["Persistent fatigue", "Low ferritin", "Iron protocol"].map((concern) => (
					<span
						key={concern}
						className='rounded-full bg-olive-950/5 px-2 py-0.5 text-[10px] font-medium text-olive-700 sm:text-xs'
					>
						{concern}
					</span>
				))}
			</div>

			<p className='mt-4 line-clamp-3 text-xs leading-relaxed text-olive-700 sm:text-sm'>
				Fatigue improving since iron protocol began in December. Ferritin trending up (12 → 18 µg/L). Afternoon
				energy dips remain; magnesium recently discontinued. Next: repeat ferritin, revisit supplement plan.
			</p>

			<div className='mt-4 flex flex-col gap-2 border-t border-olive-950/10 pt-3'>
				{[
					{ label: "Session — fatigue follow-up", meta: "Today" },
					{ label: "Lab report — ferritin panel", meta: "Mar 12" },
					{ label: "Plan updated — iron protocol", meta: "Dec 4" },
					{ label: "Email — appointment confirmed", meta: "Dec 1" },
				].map((item) => (
					<div key={item.label} className='flex items-center justify-between gap-3'>
						<p className='truncate text-xs text-olive-700 sm:text-sm'>{item.label}</p>
						<p className='shrink-0 text-[10px] text-olive-400 sm:text-xs'>{item.meta}</p>
					</div>
				))}
			</div>
		</div>
	);
};

/**
 * Mock of the workspace assistant answering from real patient context via typed tools.
 */
export const AssistantMock = ({ className, ...props }: ComponentProps<"div">) => {
	return (
		<div className={cn("flex flex-col gap-3 bg-olive-50 p-4 text-left text-sm sm:p-5", className)} {...props}>
			<div className='ms-auto max-w-[85%] rounded-lg rounded-br-sm bg-olive-950 px-3 py-2 text-xs text-olive-50 sm:text-sm'>
				When did Maya&apos;s ferritin last improve, and did we change anything around then?
			</div>

			<div className='flex flex-wrap gap-1.5'>
				{["Read lab reports", "Searched sessions"].map((tool) => (
					<span
						key={tool}
						className='inline-flex items-center gap-1 rounded-full bg-olive-950/5 px-2 py-0.5 text-[10px] font-medium text-olive-500 sm:text-xs'
					>
						<Check className='size-2.5' strokeWidth={2} />
						{tool}
					</span>
				))}
			</div>

			<div className='max-w-[90%] rounded-lg rounded-bl-sm bg-white/80 px-3 py-2 text-xs leading-relaxed text-olive-700 ring-1 ring-olive-950/5 sm:text-sm'>
				Ferritin rose from 12 to 18 µg/L between November and March — the iron protocol started that December.
				The March session notes better mornings. Want me to draft a follow-up email about the recheck?
			</div>

			<div className='flex gap-2'>
				<span className='rounded-sm bg-olive-950/5 px-2.5 py-1 text-[10px] font-medium text-olive-950 sm:text-xs'>
					Draft the email
				</span>
				<span className='rounded-sm px-2.5 py-1 text-[10px] font-medium text-olive-500 sm:text-xs'>
					Not now
				</span>
			</div>
		</div>
	);
};
