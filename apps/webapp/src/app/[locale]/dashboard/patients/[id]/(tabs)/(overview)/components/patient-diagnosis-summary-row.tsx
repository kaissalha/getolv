import type { RouterOutput } from "@starter/server";
import { cn } from "@starter/ui/lib/utils";

type PatientDetails = NonNullable<RouterOutput["patients"]["get"]>;

const diagnosisBadgeToneClass = {
	differential: "bg-info/12 text-info-foreground ring-1 ring-info/25",
	working: "bg-destructive/12 text-destructive ring-1 ring-destructive/25",
} as const;

type DiagnosisSummaryRowProps = {
	entry: PatientDetails["diagnosis"]["workingDx"][number];
	label: string;
	tone: keyof typeof diagnosisBadgeToneClass;
};

export const DiagnosisSummaryRow = ({ entry, label, tone }: DiagnosisSummaryRowProps) => (
	<div className='flex flex-col gap-1.5'>
		<div className='flex min-w-0 flex-wrap items-baseline gap-2'>
			<p className='min-w-0 text-sm font-medium text-foreground'>{entry.name}</p>
			<span
				className={cn(
					"shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold uppercase leading-none",
					diagnosisBadgeToneClass[tone]
				)}
			>
				{label}
			</span>
		</div>
		{entry.reasoning ? <p className='text-sm leading-snug text-muted-foreground'>{entry.reasoning}</p> : null}
		{entry.evidence ? (
			<p className='text-xs leading-relaxed text-muted-foreground/80'>
				<strong className='font-medium text-foreground/80'>{label}:</strong> {entry.evidence}
			</p>
		) : null}
		{entry.missing ? <p className='text-xs leading-relaxed text-muted-foreground/80'>{entry.missing}</p> : null}
		{entry.verifyNext ? (
			<p className='text-xs leading-relaxed text-muted-foreground/80'>{entry.verifyNext}</p>
		) : null}
	</div>
);
